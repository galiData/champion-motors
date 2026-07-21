# Visual identity — full specification

All color and typography values here were extracted from the production stylesheet at championmotors.co.il. Contrast ratios are computed (WCAG 2.1 relative luminance) and determine legal usage.

## Contents

- [Palette](#palette)
- [Color application rules](#color-application-rules)
- [Typography](#typography)
- [Type scale](#type-scale)
- [Spacing and layout](#spacing-and-layout)
- [Components](#components)
- [Photography](#photography)
- [Iconography](#iconography)
- [Logo usage](#logo-usage)
- [Motion](#motion)
- [Accessibility floor](#accessibility-floor)

---

## Palette

### Core

| Token | Hex | RGB | Contrast on white | Legal text use |
|---|---|---|---|---|
| Navy | `#020755` | 2, 7, 85 | 18.0:1 | Any size ✓ AAA |
| Deep Blue | `#00335C` | 0, 51, 92 | 12.9:1 | Any size ✓ AAA |
| Champion Blue | `#1760F0` | 23, 96, 240 | 5.3:1 | Any size ✓ AA |
| Sky | `#539FFF` | 83, 159, 255 | 2.7:1 | ✗ No text on white. Dark surfaces or ≥24px decorative only |
| Signal Red | `#FF0036` | 255, 0, 54 | 4.0:1 | Large text only (≥18.66px, or ≥14px bold) |

### Neutrals

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| Ink | `#0F0F0F` | 19.6:1 | Primary body text |
| Graphite | `#505050` | 8.1:1 | Secondary text |
| Slate | `#5F5F5F` | 6.4:1 | Tertiary text, captions |
| Gray | `#707070` | 4.9:1 | Muted text — AA floor, don't go lighter for text |
| Line | `#CCCCCC` | 1.6:1 | Borders and dividers only — never text |
| Mist | `#CED5DF` | — | Cool borders, disabled states |
| Stone | `#D9D9D8` | — | Warm borders, dividers |
| Surface | `#F5F5F5` | — | Section backgrounds |
| Paper | `#FAFAF9` | — | Page background, cards |
| Warm Paper | `#FCFBF9` | — | Alternate warm surface |

## Color application rules

**Navy is the authority color.** Dark headers, footers, full-bleed statement sections. It carries the premium weight of the brand. On navy, use white text, Sky for links, and Paper for surfaces.

**Champion Blue is the action color.** It signals "this does something": links, primary buttons, focus rings, active tabs, selected states. Reserve it. If Champion Blue appears as a decorative background wash, the interface has lost its most important signal.

**Sky is a state, not a fill.** Hover and active only, or large decorative shapes on dark. It fails contrast for text on white — this is the most common accidental accessibility violation in this palette.

**Signal Red is rationed.** One role per layout, always attached to a real fact: a price figure, a genuine program end-date, a safety recall notice. Red as a section background, a campaign theme, or a second decorative accent pushes the brand into the discount-shouting register that the voice rules explicitly forbid. The visual system and the verbal system have to hold the same line.

**Ratio guidance for a typical layout:** roughly 60% neutral surfaces, 25% navy/deep blue structure, 10% Champion Blue interaction, 5% or less everything else. Premium reads as restraint.

## Typography

**Ploni** — the brand Hebrew type family. Available weights on the live site: Ultralight, Regular, Demibold, Bold.

```css
font-family: 'ploni', 'Assistant', 'Heebo', system-ui, -apple-system, sans-serif;
```

| Weight | Use |
|---|---|
| **Bold (700)** | Primary headlines, strong emphasis |
| **Demibold (600)** | Subheads, buttons, table headers, navigation |
| **Regular (400)** | Body copy, UI text, captions |
| **Ultralight (200)** | Display sizes ≥32px only — it vanishes and fails legibility below that |

**Fallbacks.** Assistant and Heebo are open-source Hebrew faces with comparable proportions and a full weight range — use them when Ploni isn't licensed for the surface (email, third-party platforms, partner templates). Never fall back to a Latin-first face for Hebrew text; the Hebrew glyphs will be substituted inconsistently.

**Rules:**
- Hebrew needs more line height than Latin — `1.5`–`1.7` for body, `1.15`–`1.25` for large headlines.
- No letter-spacing adjustments on Hebrew. Hebrew letterforms are not designed to be tracked, and it reads as amateur.
- No condensing, stretching, outlining, or artificial bolding. Use real weights.
- Emphasis comes from weight and size. Hebrew has no uppercase — never simulate emphasis with spacing tricks.
- Maximum ~75 characters per line for comfortable reading.

## Type scale

A 1.25 (major third) scale, comfortable for both Hebrew and Latin:

| Role | Size | Weight | Line height |
|---|---|---|---|
| Display | 61px | Bold / Ultralight | 1.1 |
| H1 | 49px | Bold | 1.15 |
| H2 | 39px | Bold | 1.2 |
| H3 | 31px | Demibold | 1.25 |
| H4 | 25px | Demibold | 1.3 |
| Body large | 20px | Regular | 1.6 |
| Body | 16px | Regular | 1.6 |
| Small | 13px | Regular | 1.5 |

Scale down roughly one step at mobile breakpoints; keep body at 16px minimum so mobile browsers don't zoom on input focus.

## Spacing and layout

Base unit **8px**. Steps: `4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

- **Whitespace is the premium signal.** When a layout feels cramped, remove elements — don't shrink them or tighten the gutters.
- Section vertical padding: 96–128px desktop, 48–64px mobile.
- Content max-width: ~1200px for mixed layouts, ~680px for long-form reading.
- 12-column grid, 24–32px gutters.
- Generous margins around imagery. Let photographs breathe.

**RTL implementation:**

```css
/* Right, always */
margin-inline-start / margin-inline-end
padding-inline-start / padding-inline-end
inset-inline-start / inset-inline-end
border-inline-start / border-inline-end
text-align: start / end

/* Wrong — breaks bidirectionality */
margin-left / margin-right / left / right / text-align: left
```

Set `dir="rtl" lang="he"` on `<html>`. Mirror directional icons (arrows, chevrons, progress, back/next); do not mirror logos or object icons. Numbers, prices, Latin model names and brand names stay LTR — the bidi algorithm handles this; wrap in `<span dir="ltr">` only when a specific string renders incorrectly.

## Components

**Buttons**

| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| Primary | Champion Blue `#1760F0` | White | — | Navy `#020755` |
| Secondary | Transparent | Deep Blue `#00335C` | 1px Deep Blue | Deep Blue fill, white text |
| Tertiary | Transparent | Champion Blue | — | Underline |
| On navy | White | Navy | — | Sky `#539FFF` |

Radius 4–8px — restrained. Fully rounded pills read consumer-promotional and pull against the premium register. Padding `16px 32px`. Focus ring: 2px Champion Blue at 2px offset, never removed.

**Cards.** Paper `#FAFAF9` on white, or white on Surface `#F5F5F5`. 1px `#CED5DF` border or a soft shadow — not both. Radius 8px. Internal padding 24–32px.

**Forms.** 1px `#CED5DF` border, 4px radius, 48px minimum height. Focus: Champion Blue border plus focus ring. Errors in Signal Red with a text message — never color alone, since that fails for colorblind users. Labels above fields, right-aligned in RTL.

**Tables.** Deep Blue header text, `#CCCCCC` bottom rules, generous row padding. Numeric columns stay LTR-aligned.

## Photography

**Direction:** high-quality, natural light, real environments, human-centered.

- **People belong in frame.** This is the brand's core visual differentiator — a customer collecting keys, a technician explaining a diagnostic, a family loading the boot. The car is often the enabler rather than the hero.
- **Real Israeli context** where the setting is visible — recognizable landscape and light beat generic European studio backdrops for local trust.
- **Natural, candid expressions.** Not staged stock smiling.
- **Clean, uncluttered compositions.** Premium comes from what isn't in the frame.
- **Consistent, neutral color treatment.** No heavy filters, no aggressive teal-and-orange grading.

**Avoid:** cars floating on gradient voids · lens flare and heavy vignettes · motion-blur "speed" clichés · price stickers or starbursts composited onto imagery · obviously generic stock photography.

**Text over imagery:** ensure a real contrast floor. Use a solid panel or a navy scrim at 60%+ opacity rather than relying on the photo being dark enough.

## Iconography

Consistent line weight (1.5–2px), rounded joins, geometric and simple. Champion Blue for interactive icons, Deep Blue or Graphite for informational, white on navy. Match icon optical size to adjacent text. Mirror directional icons in RTL. Never mix icon families in one layout — inconsistent stroke weight is immediately visible and reads as unfinished.

## Logo usage

- **Clear space:** minimum equal to the height of the mark's cap-height on all sides. More is better.
- **Minimum size:** legibility floor — roughly 24px height digital, 15mm print. Test at size before shipping.
- **Backgrounds:** white, Paper, or Navy. On photography, only over a demonstrably clean, low-detail area or a scrim.
- **Never:** recolor outside brand values · rotate · add effects, shadows or outlines · stretch or condense · place on a busy background · combine with a marque logo into a composite mark · reconstruct from scratch when the official file exists.

For marque logos, the governing rules are in each marque's own CI manual — see `sub-brands.md`.

## Motion

Subtle and purposeful. Duration 200–300ms for UI transitions, up to 600ms for larger reveals. Easing `cubic-bezier(0.4, 0, 0.2, 1)`. Fade and gentle rise; no bounce, no aggressive slides, no attention-grabbing loops. Respect `prefers-reduced-motion` — provide a static equivalent.

## Accessibility floor

Non-negotiable, and part of the Responsibility value rather than a compliance afterthought:

- Text contrast ≥ 4.5:1 normal, ≥ 3:1 large (≥18.66px, or ≥14px bold)
- UI component and focus-indicator contrast ≥ 3:1
- Never communicate meaning through color alone — pair with text or icon
- Visible focus indicators everywhere; never `outline: none` without a replacement
- Touch targets ≥ 44×44px
- Body text ≥ 16px
- Full keyboard operability; logical RTL tab order
- Meaningful Hebrew `alt` text on informational images
