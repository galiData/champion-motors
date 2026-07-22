#!/usr/bin/env python3
"""Champion Motors brand validator.

Checks a file against the mechanical parts of the Champion Motors brand rules:
off-palette hex colors, banned sales phrases in Hebrew and English,
exclamation-mark abuse, contrast violations, non-brand font stacks, gradient
discipline, and RTL correctness.

    python validate_brand.py <file> [more files...]
    python validate_brand.py --strict src/          # warnings fail too

Exit code is 1 when there are errors (2 with --strict if there are warnings),
so it drops into a pre-commit hook or a CI step cleanly.

This catches mechanical failures only. Whether the work sits in the right brand
layer, whether a claim is substantiated, and whether the tone is warm rather
than soft are judgment calls the checklist in SKILL.md covers.

Standard library only — no install step.
"""

from __future__ import annotations

import argparse
import re
import sys
from bisect import bisect_right
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator

# --------------------------------------------------------------------------
# Brand facts. Sourced from references/visual-identity.md and
# .claude/rules/design.md — keep the two in sync when either moves.
# --------------------------------------------------------------------------

PALETTE = {
    "#020755": "cm-navy",
    "#00335c": "cm-deep-blue",
    "#1760f0": "cm-blue",
    "#539fff": "cm-sky",
    "#ff0036": "cm-red",
    "#0f0f0f": "cm-ink",
    "#505050": "cm-graphite",
    "#5f5f5f": "cm-slate",
    "#707070": "cm-gray",
    "#cccccc": "cm-line",
    "#ced5df": "cm-mist",
    "#d9d9d8": "cm-stone",
    "#f5f5f5": "cm-surface",
    "#fafaf9": "cm-paper",
    "#fcfbf9": "brand surface (alt)",
}

WHITE = "#ffffff"
PURE_BLACK = {"#000000"}

# Tokens that may legally carry text, and the surfaces they sit on.
TOKEN_HEX = dict(
    {name: hexcode for hexcode, name in PALETTE.items()},
    white=WHITE,
)

# Borders and dividers only — never text. From the palette table in design.md.
BORDER_ONLY_TOKENS = {"cm-line", "cm-mist", "cm-stone"}

# The only gradient stops the design rules allow (navy family, dark surfaces).
GRADIENT_ALLOWED_TOKENS = {"cm-navy", "cm-deep-blue"}

BRAND_FONTS = ("ploni", "assistant", "heebo")

# Banned copy patterns, from the voice rules in SKILL.md. Hebrew first.
BANNED_PHRASES: list[tuple[str, str]] = [
    (r"רק\s+היום", "manufactured scarcity"),
    (r"הזדמנות\s+אחרונה", "manufactured scarcity"),
    (r"מהר\s+לפני\s+שייגמר", "manufactured scarcity"),
    (r"מבצע\s+ענק", "discount shouting"),
    (r"חיסול", "discount shouting"),
    (r"במחיר\s+הזול\s+בשוק", "discount shouting"),
    (r"הכי\s+טוב\s+ב(ארץ|שוק)", "superlative without evidence"),
    (r"לחץ\s+כאן\s+עכשיו", "pressure CTA"),
    (r"\bact\s+now\b", "manufactured scarcity"),
    (r"\blast\s+chance\b", "manufactured scarcity"),
    (r"\bunbeatable\s+price\b", "discount shouting"),
    (r"\bcheapest\b", "discount shouting"),
    (r"\bbuy\s+now\b", "pressure CTA"),
]

# Lower confidence — real copy sometimes needs these, so they warn.
SOFT_PHRASES: list[tuple[str, str]] = [
    (r"\bthe\s+best\b", "superlative — needs a source or it goes"),
    (r"\bno\.?\s*1\b", "superlative — needs a source or it goes"),
]

HEBREW = re.compile(r"[֐-׿]")

# LTR-hardcoded utilities that break Hebrew layout. design.md: logical only.
PHYSICAL_CLASS = re.compile(
    r"(?<![\w-])(ml|mr|pl|pr|left|right)-(?:\[[^\]]+\]|[\w.]+)|"
    r"(?<![\w-])text-(?:left|right)(?![\w-])"
)
PHYSICAL_CSS = re.compile(
    r"(?<![\w-])(margin|padding)-(left|right)\s*:|"
    r"(?<![\w-])(?<!inset-inline-)(left|right)\s*:\s*(?!auto\s*;?\s*$)|"
    r"text-align\s*:\s*(left|right)\b"
)

HEX_RE = re.compile(r"#([0-9a-fA-F]{3,8})\b")
FONT_FAMILY_RE = re.compile(r"font-family\s*:\s*([^;}\n]+)", re.IGNORECASE)
GRADIENT_CSS_RE = re.compile(r"(linear|radial|conic)-gradient\s*\(([^;{}]*)\)", re.IGNORECASE)
GRADIENT_CLASS_RE = re.compile(r"bg-(?:gradient-to-\w+|linear|radial|conic)(?![\w-])")
GRADIENT_STOP_RE = re.compile(r"(?:from|via|to)-([\w-]+)")
STRING_LITERAL_RE = re.compile(r"\"([^\"\\\n]{2,}?)\"|'([^'\\\n]{2,}?)'|`([^`\\]{2,}?)`", re.DOTALL)
JSX_TEXT_RE = re.compile(r">([^<>{}]{2,}?)<", re.DOTALL)

TEXT_SUFFIXES = {".md", ".markdown", ".txt", ".html", ".htm"}
CODE_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".scss"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", "coverage", "__pycache__"}

# Escape hatch for lines that legitimately quote a prohibition — the rules
# docs themselves, or a test fixture. `brand-ignore` suppresses every finding
# on that line; `brand-ignore: code,code` suppresses only those codes.
IGNORE_LINE_RE = re.compile(r"brand-ignore(?!-file)\s*:?\s*([\w/,\s-]*)")
IGNORE_FILE_RE = re.compile(r"brand-ignore-file\b")


# --------------------------------------------------------------------------
# Findings
# --------------------------------------------------------------------------


@dataclass(frozen=True)
class Finding:
    path: Path
    line: int
    level: str  # "error" | "warning"
    code: str
    message: str

    def render(self, root: Path) -> str:
        try:
            shown = self.path.relative_to(root)
        except ValueError:
            shown = self.path
        mark = "error  " if self.level == "error" else "warning"
        return f"  {shown}:{self.line}  {mark}  {self.code}  {self.message}"


class LineIndex:
    """Maps a character offset back to a 1-based line number."""

    def __init__(self, source: str) -> None:
        self._starts = [0]
        for match in re.finditer(r"\n", source):
            self._starts.append(match.end())

    def line_of(self, offset: int) -> int:
        return bisect_right(self._starts, offset)


# --------------------------------------------------------------------------
# Color helpers
# --------------------------------------------------------------------------


def normalize_hex(raw: str) -> str | None:
    """Expand shorthand hex and drop any alpha channel. None if unparseable."""
    value = raw.lower()
    if len(value) in (3, 4):
        value = "".join(ch * 2 for ch in value)
    if len(value) == 8:
        value = value[:6]
    if len(value) != 6:
        return None
    return f"#{value}"


def relative_luminance(hex_color: str) -> float:
    channels = []
    for i in (1, 3, 5):
        channel = int(hex_color[i : i + 2], 16) / 255
        channels.append(channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4)
    red, green, blue = channels
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


def contrast_ratio(foreground: str, background: str) -> float:
    lighter = relative_luminance(foreground)
    darker = relative_luminance(background)
    if lighter < darker:
        lighter, darker = darker, lighter
    return (lighter + 0.05) / (darker + 0.05)


# --------------------------------------------------------------------------
# Prose extraction
#
# Voice checks must run on user-facing text, never on raw source — otherwise
# every `!==` and `!important` reads as exclamation-mark abuse.
# --------------------------------------------------------------------------


def extract_prose(path: Path, source: str, index: LineIndex) -> list[tuple[int, str]]:
    suffix = path.suffix.lower()
    segments: list[tuple[int, str]] = []

    if suffix in {".md", ".markdown", ".txt"}:
        in_fence = False
        for lineno, line in enumerate(source.splitlines(), start=1):
            if line.lstrip().startswith("```"):
                in_fence = not in_fence
                continue
            if not in_fence:
                segments.append((lineno, line))
        return segments

    if suffix in {".html", ".htm"}:
        stripped = re.sub(r"<(script|style)\b.*?</\1>", " ", source, flags=re.DOTALL | re.IGNORECASE)
        for match in re.finditer(r">([^<]+)<", stripped):
            text = match.group(1).strip()
            if text:
                segments.append((index.line_of(match.start(1)), text))
        return segments

    # Code: JSX text nodes plus string literals that look like natural language.
    for match in JSX_TEXT_RE.finditer(source):
        text = match.group(1).strip()
        if text and not text.startswith(("=", "/")):
            segments.append((index.line_of(match.start(1)), text))

    for match in STRING_LITERAL_RE.finditer(source):
        text = next((group for group in match.groups() if group), "").strip()
        if not text:
            continue
        # Natural language means Hebrew, or at least two words of letters.
        if HEBREW.search(text) or len(re.findall(r"[A-Za-z]{2,}", text)) >= 2:
            segments.append((index.line_of(match.start()), text))

    return segments


def mask_comments(source: str, suffix: str) -> str:
    """Blank out comments, preserving length and newlines so offsets stay valid.

    Comments routinely quote the very patterns this script bans — design.md's
    rules restated above a component, a JSDoc note saying "never text-left".
    Scanning them produces confident nonsense.
    """
    if suffix in {".html", ".htm"}:
        return re.sub(
            r"<!--.*?-->",
            lambda m: re.sub(r"[^\n]", " ", m.group(0)),
            source,
            flags=re.DOTALL,
        )
    if suffix not in CODE_SUFFIXES:
        return source

    out: list[str] = []
    state: str | None = None  # None | "line" | "block" | quote character
    escaped = False
    i, length = 0, len(source)
    while i < length:
        char = source[i]
        pair = source[i : i + 2]
        if state is None:
            if pair == "//" and suffix != ".css":
                state, out, i = "line", out + ["  "], i + 2
                continue
            if pair == "/*":
                state, out, i = "block", out + ["  "], i + 2
                continue
            if char in "\"'`":
                state = char
            out.append(char)
        elif state in ("line", "block"):
            if state == "line" and char == "\n":
                state = None
                out.append(char)
            elif state == "block" and pair == "*/":
                state, out, i = None, out + ["  "], i + 2
                continue
            else:
                out.append("\n" if char == "\n" else " ")
        else:  # inside a string literal
            out.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == state:
                state = None
        i += 1
    return "".join(out)


# A Tailwind color utility, with any variant prefixes and opacity modifier.
CLASS_TOKEN_RE = re.compile(
    r"(?<![\w:/-])((?:[a-z][\w-]*:)*)(text|bg)-(cm-[\w-]+|white)(/\d+)?(?![\w/-])"
)


def iter_class_strings(source: str, index: LineIndex) -> Iterator[tuple[int, str]]:
    """Yield string literals that look like Tailwind class lists."""
    for match in STRING_LITERAL_RE.finditer(source):
        text = next((group for group in match.groups() if group), "")
        if re.search(r"(?:^|\s)(?:bg|text|border|from|to|via|hover:|focus:)[\w:-]", text):
            yield index.line_of(match.start()), text


# --------------------------------------------------------------------------
# Checks
# --------------------------------------------------------------------------


def check_palette(path: Path, source: str, index: LineIndex) -> Iterator[Finding]:
    for match in HEX_RE.finditer(source):
        normalized = normalize_hex(match.group(1))
        if normalized is None:
            continue
        line = index.line_of(match.start())
        if normalized in PALETTE or normalized == WHITE:
            continue
        if normalized in PURE_BLACK:
            yield Finding(
                path, line, "error", "palette/pure-black",
                f"{match.group(0)} is pure black — reading text is cm-ink (#0F0F0F).",
            )
            continue
        yield Finding(
            path, line, "error", "palette/off-brand",
            f"{match.group(0)} is not a brand token. If a color isn't in design.md it "
            "doesn't go in the product.",
        )


def check_voice(path: Path, prose: Iterable[tuple[int, str]]) -> Iterator[Finding]:
    for lineno, text in prose:
        for pattern, label in BANNED_PHRASES:
            found = re.search(pattern, text, re.IGNORECASE)
            if found:
                yield Finding(
                    path, lineno, "error", "voice/banned-phrase",
                    f"{label}: {found.group(0).strip()!r}. State the fact calmly instead.",
                )
        for pattern, label in SOFT_PHRASES:
            found = re.search(pattern, text, re.IGNORECASE)
            if found:
                yield Finding(
                    path, lineno, "warning", "voice/superlative",
                    f"{label}: {found.group(0).strip()!r}",
                )

        if re.search(r"!\s*!", text):
            yield Finding(
                path, lineno, "error", "voice/exclamation",
                "Multiple exclamation marks. The brand does not shout.",
            )

        # ALL-CAPS shouting: a run of caps words. Hebrew has no case, so this
        # only applies to Latin text. SCREAMING_SNAKE_CASE constants are code,
        # not copy, so an underscore anywhere disqualifies the match.
        shout = re.search(r"\b[A-Z]{3,}(?:\s+[A-Z]{2,}){1,}\b", text)
        if shout and "_" not in text:
            yield Finding(
                path, lineno, "warning", "voice/all-caps",
                f"ALL-CAPS shouting: {shout.group(0)!r}. Emphasis comes from weight and size.",
            )


def check_fonts(path: Path, source: str, index: LineIndex) -> Iterator[Finding]:
    for match in FONT_FAMILY_RE.finditer(source):
        stack = match.group(1).strip()
        line = index.line_of(match.start())
        lowered = stack.lower()
        if lowered.startswith(("var(", "inherit", "initial", "unset")):
            continue
        if re.search(r"(?<!sans-)\bserif\b", lowered) or "condensed" in lowered or "narrow" in lowered:
            yield Finding(
                path, line, "error", "type/decorative-face",
                f"Serif or condensed face in {stack!r}. Premium comes from restraint, not expressive type.",
            )
            continue
        if not any(font in lowered for font in BRAND_FONTS):
            yield Finding(
                path, line, "error", "type/non-brand-stack",
                f"{stack!r} has no brand Hebrew family. Use 'ploni', 'Assistant', 'Heebo', system-ui.",
            )

    for match in re.finditer(r"(?<![\w-])font-serif(?![\w-])", source):
        yield Finding(
            path, index.line_of(match.start()), "error", "type/decorative-face",
            "font-serif — the brand has no serif face.",
        )


def check_contrast(path: Path, source: str, index: LineIndex) -> Iterator[Finding]:
    """Contrast for pairs we can actually resolve.

    Two cases are decidable without rendering: a CSS block that sets both
    color and background-color, and a Tailwind class list that names both a
    text token and a background token.
    """
    for block in re.finditer(r"\{([^{}]*)\}", source):
        body = block.group(1)
        fg = re.search(r"(?<!-)\bcolor\s*:\s*(#[0-9a-fA-F]{3,8})", body)
        bg = re.search(r"background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,8})", body)
        if not (fg and bg):
            continue
        fg_hex, bg_hex = normalize_hex(fg.group(1)[1:]), normalize_hex(bg.group(1)[1:])
        if not (fg_hex and bg_hex):
            continue
        ratio = contrast_ratio(fg_hex, bg_hex)
        if ratio < 4.5:
            yield Finding(
                path, index.line_of(block.start() + fg.start()), "error", "a11y/contrast",
                f"{fg.group(1)} on {bg.group(1)} is {ratio:.1f}:1 — below the 4.5:1 floor for body text.",
            )

    for lineno, classes in iter_class_strings(source, index):
        # Group by variant prefix: a base text color and a hover: background
        # never render together, so pairing them invents a failure. An opacity
        # modifier (bg-cm-blue/10) composites against an unknown surface, so
        # the pair is not decidable here either.
        text_by_variant: dict[str, list[str]] = {}
        bg_by_variant: dict[str, list[str]] = {}
        for variant, kind, token, opacity in CLASS_TOKEN_RE.findall(classes):
            if opacity:
                continue
            bucket = text_by_variant if kind == "text" else bg_by_variant
            bucket.setdefault(variant, []).append(token)

        for token in {t for tokens in text_by_variant.values() for t in tokens}:
            if token in BORDER_ONLY_TOKENS:
                yield Finding(
                    path, lineno, "warning", "a11y/border-token-as-text",
                    f"text-{token} — {token} is a border and divider token. Fine on a "
                    "decorative icon; as text it fails contrast.",
                )

        for variant, text_tokens in text_by_variant.items():
            bg_tokens = bg_by_variant.get(variant, [])
            if not bg_tokens:
                # Sky on an unstated surface is the palette's classic trap: it
                # fails contrast on anything light.
                if "cm-sky" in text_tokens and not variant:
                    yield Finding(
                        path, lineno, "warning", "a11y/sky-as-text",
                        "text-cm-sky with no background token in the same class list. Sky "
                        "is 2.7:1 on white — a state on dark surfaces, not a text color.",
                    )
                continue

            for text_token in text_tokens:
                for bg_token in bg_tokens:
                    fg_hex = TOKEN_HEX.get(text_token)
                    bg_hex = TOKEN_HEX.get(bg_token)
                    if not (fg_hex and bg_hex):
                        continue
                    ratio = contrast_ratio(fg_hex, bg_hex)
                    if ratio < 4.5:
                        level = "error" if ratio < 3.0 else "warning"
                        shown = f"{variant}text-{text_token} on {variant}bg-{bg_token}"
                        yield Finding(
                            path, lineno, level, "a11y/contrast",
                            f"{shown} is {ratio:.1f}:1 — below 4.5:1 for body text "
                            "(3:1 for ≥18.66px or ≥14px bold).",
                        )


def check_gradients(path: Path, source: str, index: LineIndex) -> Iterator[Finding]:
    """Gradients are allowed only within the navy family, on dark surfaces."""
    for match in GRADIENT_CLASS_RE.finditer(source):
        line = index.line_of(match.start())
        window = source[match.start() : match.start() + 400]
        stops = [stop for stop in GRADIENT_STOP_RE.findall(window) if stop.startswith("cm-") or stop == "white"]
        offenders = [stop for stop in stops if stop not in GRADIENT_ALLOWED_TOKENS]
        if offenders:
            yield Finding(
                path, line, "error", "color/gradient-scope",
                f"Gradient stop {', '.join(sorted(set(offenders)))} outside the navy family. "
                "Allowed: cm-navy → cm-deep-blue on a dark surface.",
            )
        if re.search(r"(?<![\w-])bg-clip-text(?![\w-])", window):
            yield Finding(
                path, line, "error", "color/gradient-on-text",
                "Gradient on text. Gradients are for dark identity surfaces only.",
            )

    for match in GRADIENT_CSS_RE.finditer(source):
        line = index.line_of(match.start())
        hexes = [normalize_hex(raw) for raw in HEX_RE.findall(match.group(2))]
        named = {PALETTE.get(value) for value in hexes if value}
        offenders = {name for name in named if name and name not in GRADIENT_ALLOWED_TOKENS}
        if offenders:
            yield Finding(
                path, line, "error", "color/gradient-scope",
                f"Gradient stop {', '.join(sorted(offenders))} outside the navy family.",
            )


def check_rtl(path: Path, source: str, index: LineIndex) -> Iterator[Finding]:
    suffix = path.suffix.lower()

    if suffix in {".html", ".htm"}:
        html_tag = re.search(r"<html\b([^>]*)>", source, re.IGNORECASE)
        if not html_tag:
            yield Finding(path, 1, "error", "rtl/missing-root", "No <html> element — cannot confirm dir/lang.")
        else:
            attrs = html_tag.group(1)
            line = index.line_of(html_tag.start())
            if not re.search(r'dir\s*=\s*["\']rtl["\']', attrs, re.IGNORECASE):
                yield Finding(path, line, "error", "rtl/missing-dir", 'Root <html> needs dir="rtl".')
            if not re.search(r'lang\s*=\s*["\']he["\']', attrs, re.IGNORECASE):
                yield Finding(path, line, "error", "rtl/missing-lang", 'Root <html> needs lang="he".')

    if suffix in {".css", ".scss"}:
        for match in PHYSICAL_CSS.finditer(source):
            yield Finding(
                path, index.line_of(match.start()), "error", "rtl/physical-property",
                f"{match.group(0).strip()} hard-codes LTR. Use logical properties "
                "(margin-inline-start, inset-inline-end, text-align: start).",
            )
        return

    for lineno, classes in iter_class_strings(source, index):
        for match in PHYSICAL_CLASS.finditer(classes):
            yield Finding(
                path, lineno, "error", "rtl/physical-utility",
                f"{match.group(0)} hard-codes LTR and breaks Hebrew layout. "
                "Use ms-* me-* ps-* pe-* start-* end-* text-start text-end.",
            )


# --------------------------------------------------------------------------
# Driver
# --------------------------------------------------------------------------


def suppressed(finding: Finding, lines: list[str]) -> bool:
    if not 1 <= finding.line <= len(lines):
        return False
    match = IGNORE_LINE_RE.search(lines[finding.line - 1])
    if not match:
        return False
    codes = {code.strip() for code in match.group(1).replace(",", " ").split() if code.strip()}
    return not codes or finding.code in codes


def validate_file(path: Path) -> list[Finding]:
    try:
        source = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return [Finding(path, 1, "error", "io/unreadable", str(exc))]

    if IGNORE_FILE_RE.search(source):
        return []

    index = LineIndex(source)
    code = mask_comments(source, path.suffix.lower())
    prose = extract_prose(path, code, index)

    findings: list[Finding] = []
    findings += check_palette(path, code, index)
    findings += check_voice(path, prose)
    findings += check_fonts(path, code, index)
    findings += check_contrast(path, code, index)
    findings += check_gradients(path, code, index)
    findings += check_rtl(path, code, index)

    lines = source.splitlines()
    findings = [f for f in findings if not suppressed(f, lines)]
    return sorted(findings, key=lambda f: (f.line, f.code))


def collect_paths(targets: list[str]) -> list[Path]:
    seen: dict[Path, None] = {}
    for target in targets:
        path = Path(target)
        if path.is_dir():
            for child in sorted(path.rglob("*")):
                if child.is_file() and not SKIP_DIRS & set(child.parts):
                    if child.suffix.lower() in TEXT_SUFFIXES | CODE_SUFFIXES:
                        seen.setdefault(child.resolve(), None)
        elif path.is_file():
            seen.setdefault(path.resolve(), None)
        else:
            print(f"validate_brand: no such file or directory: {target}", file=sys.stderr)
    return list(seen)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="validate_brand",
        description="Check files against the mechanical Champion Motors brand rules.",
    )
    parser.add_argument("targets", nargs="+", metavar="PATH", help="files or directories to check")
    parser.add_argument("--strict", action="store_true", help="treat warnings as failures")
    parser.add_argument("--quiet", action="store_true", help="only print the summary")
    args = parser.parse_args(argv)

    # This tool reports Hebrew phrases and typographic dashes. A Windows
    # console defaults to a legacy codepage and would crash on both.
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")

    paths = collect_paths(args.targets)
    if not paths:
        print("validate_brand: nothing to check", file=sys.stderr)
        return 1

    root = Path.cwd()
    errors = warnings = 0
    for path in paths:
        findings = validate_file(path)
        if not findings:
            continue
        errors += sum(1 for f in findings if f.level == "error")
        warnings += sum(1 for f in findings if f.level == "warning")
        if not args.quiet:
            for finding in findings:
                print(finding.render(root))

    checked = f"{len(paths)} file{'s' if len(paths) != 1 else ''}"
    if errors or warnings:
        print(f"\n{checked} checked — {errors} error(s), {warnings} warning(s)")
    else:
        print(f"{checked} checked — clean")

    if errors:
        return 1
    if warnings and args.strict:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
