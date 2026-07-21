# Design Language — Champion Motors

Always read this file before building, designing, or styling anything. Never guess at
colors or fonts — apply the exact tokens defined here.

**Source of truth.** The values below come from the `champion-motors-brand-guideline`
skill, which extracted them from the production stylesheet at championmotors.co.il.
For anything this file doesn't cover — voice, campaigns, photography direction, per-marque
governance — invoke that skill and read
`.claude/skills/champion-motors-brand-guideline/references/visual-identity.md` and
`references/sub-brands.md`.

> The July-2026 `champion-motors-brand-guidelines.pdf` draft is superseded on color and
> type: its hexes were sampled from screenshots (it lists `#2D82FF` and `#CCE0F2` as
> estimates) and its typeface is explicitly a placeholder. Its *rules* — the two-blue
> discipline, partner-logo handling, color ratio — are folded in below and still hold.

## Brand Identity
Champion Motors is a trusted mobility partner: international automotive excellence
delivered with local trust and human relationships. Design should feel **premium but
never expensive-sounding, confident but never loud**. The brand is the senior specialist
who explains things clearly and doesn't need to raise their voice.

Whitespace is the primary premium signal. When a layout feels cramped, remove elements
rather than shrinking them.

## Color Palette

### Tailwind utility classes (use these in components)
| Class | Hex | Usage |
|---|---|---|
| `bg-cm-navy` / `text-cm-navy` | `#020755` | Authority color — headers, footers, hero bands, dark statement sections |
| `bg-cm-deep-blue` / `text-cm-deep-blue` | `#00335C` | Headings on light backgrounds, secondary UI, borders, menus |
| `bg-cm-blue` / `text-cm-blue` | `#1760F0` | **Action color** — links, primary buttons, focus rings, active/selected states |
| `bg-cm-sky` / `text-cm-sky` | `#539FFF` | Hover/active state only — dark surfaces or ≥24px decorative |
| `bg-cm-red` / `text-cm-red` | `#FF0036` | Price emphasis, real deadlines, alerts. **Rationed.** |
| `text-cm-ink` | `#0F0F0F` | Primary body text |
| `text-cm-graphite` | `#505050` | Secondary text |
| `text-cm-slate` | `#5F5F5F` | Tertiary text, captions |
| `text-cm-gray` | `#707070` | Muted text — AA floor, never lighter for text |
| `border-cm-line` | `#CCCCCC` | Borders and dividers only — never text |
| `border-cm-mist` | `#CED5DF` | Cool borders, disabled states |
| `border-cm-stone` | `#D9D9D8` | Warm borders, dividers |
| `bg-cm-surface` | `#F5F5F5` | Section backgrounds |
| `bg-cm-paper` | `#FAFAF9` | Page background, cards |

```js
// tailwind.config.js → theme.extend.colors
cm: {
  navy: "#020755",     "deep-blue": "#00335C", blue: "#1760F0",
  sky:  "#539FFF",     red: "#FF0036",
  ink:  "#0F0F0F",     graphite: "#505050",    slate: "#5F5F5F",
  gray: "#707070",     line: "#CCCCCC",        mist: "#CED5DF",
  stone:"#D9D9D8",     surface: "#F5F5F5",     paper: "#FAFAF9",
}
```

### Usage rules
- **Two blues, deliberately far apart.** Navy carries identity and never invites a tap.
  Champion Blue carries function and appears only where the interface wants a click.
  Never combine them in the same headline.
- **Navy: one identity block per view** — a hero band or a full-bleed statement section.
  On navy use white text, Sky for links, Paper for surfaces.
- **Champion Blue is reserved.** If it shows up as a decorative background wash, the
  interface has lost its most important signal.
- **Sky is a state, not a fill.** 2.7:1 on white — it fails contrast for text. This is
  the most common accidental accessibility violation in this palette.
- **Signal Red is rationed to one role per layout**, always attached to a real fact:
  a price figure, a genuine program end-date, a recall notice. Never a section
  background, never a campaign theme. The voice rules forbid manufactured urgency;
  the visual system holds the same line.
- Body text is `cm-ink`, not pure black and not a pale gray.
- **Target ratio:** ~60% neutral surfaces · ~25% navy/deep-blue structure ·
  ~10% Champion Blue interaction · ≤5% everything else. Premium reads as restraint.

## Typography

### Font stack
```css
font-family: 'ploni', 'Assistant', 'Heebo', system-ui, -apple-system, sans-serif;
```
**Ploni** is the brand Hebrew family. Assistant and Heebo are the open-source fallbacks
for surfaces where Ploni isn't licensed (email, third-party platforms). Never fall back
to a Latin-first face for Hebrew — the glyphs get substituted inconsistently. Never use
a decorative or condensed face.

| Weight | Use |
|---|---|
| Bold (700) | Primary headlines, model names, strong emphasis |
| Demibold (600) | Subheads, buttons, table headers, navigation |
| Regular (400) | Body copy, UI text, captions |
| Ultralight (200) | Display sizes ≥32px only — illegible below that |

### Type scale
1.25 major third. Scale down ~one step at mobile; keep body at 16px minimum so mobile
browsers don't zoom on input focus.

| Role | Size | Weight | Line height | Color |
|---|---|---|---|---|
| Display / Hero | 61px | Bold or Ultralight | 1.1 | white on `cm-navy` |
| H1 | 49px | Bold | 1.15 | `cm-deep-blue` |
| H2 | 39px | Bold | 1.2 | `cm-deep-blue` |
| H3 | 31px | Demibold | 1.25 | `cm-deep-blue` |
| H4 / Card title | 25px | Demibold | 1.3 | `cm-ink` |
| Body large | 20px | Regular | 1.6 | `cm-ink` |
| Body | 16px | Regular | 1.6 | `cm-ink` |
| Small / Caption | 13px | Regular | 1.5 | `cm-slate` |
| Stat / Price | 39–61px | Bold | 1.1 | `cm-ink`, or `cm-red` for the figure itself |

- Hebrew needs more air than Latin: `1.5`–`1.7` body, `1.15`–`1.25` large headlines
- No letter-spacing on Hebrew — it reads as amateur
- No condensing, stretching, outlining or artificial bolding; use real weights
- Max ~75 characters per line

## Layout & Spacing
- Base unit **8px**. Steps: `4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128`
- Section vertical padding: 96–128px desktop, 48–64px mobile
- Content max-width ~1200px for mixed layouts, ~680px for long-form reading.
  Dashboard/table screens run full-width inside the app shell — don't box them in an
  extra `max-w-*`/`mx-auto` wrapper that leaves dead margins
- 12-column grid, 24–32px gutters
- Generous margins around imagery — let photographs breathe

### RTL
Use Tailwind logical utilities everywhere: `ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*`
`text-start` `text-end`. Never `ml-*` `mr-*` `left-*` `right-*` `text-left`.

- `dir="rtl" lang="he"` on `<html>`
- Filter sidebars and primary nav sit on the reading-start side (right, in RTL)
- Mirror directional icons; never mirror logos or object icons
- Numbers, prices and Latin model names stay LTR inline; numeric table columns stay
  LTR-aligned

## UI Components

### Cards
```tsx
<div className="bg-cm-paper border border-cm-mist rounded-lg p-8">
```
- Paper on white, or white on `cm-surface`
- Radius 8px · 1px `cm-mist` border **or** a soft shadow — not both
- Internal padding 24–32px

### Buttons
```tsx
{/* Primary */}
<button className="bg-cm-blue hover:bg-cm-navy text-white font-semibold px-8 py-4 rounded transition-colors">

{/* Secondary / outline */}
<button className="border border-cm-deep-blue text-cm-deep-blue hover:bg-cm-deep-blue hover:text-white font-semibold px-8 py-4 rounded transition-colors">

{/* Tertiary */}
<button className="text-cm-blue hover:underline font-semibold">

{/* On navy */}
<button className="bg-white text-cm-navy hover:bg-cm-sky font-semibold px-8 py-4 rounded transition-colors">
```
Radius 4–8px — restrained. Fully rounded pills read consumer-promotional and pull
against the premium register. Focus ring: 2px `cm-blue` at 2px offset, never removed.

### Forms
- 1px `cm-mist` border, 4px radius, 48px minimum height
- Focus: `cm-blue` border plus focus ring
- Errors in `cm-red` **with a text message** — never color alone
- Labels above fields, right-aligned in RTL

### Tables
`cm-deep-blue` header text, `cm-line` bottom rules, generous row padding, numeric
columns LTR-aligned.

### Stat / price
```tsx
<div>
  <p className="text-5xl font-bold text-cm-ink leading-none">
    <span dir="ltr">1,162</span> ₪
  </p>
  <p className="text-sm text-cm-slate mt-2">לחודש · מקדמה <span dir="ltr">41,639</span> ₪</p>
</div>
```

### Data charts
- Primary series: `cm-blue` · Secondary: `cm-deep-blue` · Structure/grid: `cm-mist`
- `cm-red` only for a genuinely negative or alerting value
- Never encode meaning through color alone — label the series

## Logo & partner marks
- Champion wordmark: "צ'מפיון מוטורס Champion Motors"
- Clear space ≥ the mark's cap-height on all sides. Minimum ~24px height digital
- Backgrounds: white, Paper, or Navy. On photography, only over a clean low-detail
  area or a navy scrim at 60%+
- Never recolor, rotate, stretch, add effects, or composite the Champion mark with a
  marque logo into a single mark

**Partner OEM logos — two contexts, one rule each:**
- **Global nav / masthead:** single flat color (black, or white on dark). Five OEM
  brand colors competing in one thin row reads as visual noise.
- **Service network, model listings, filter tabs:** full authentic OEM colors. Here
  color *is* the information — it tells the customer which marque is which.
- Never recolor, stretch or flatten an OEM logo outside those two sanctioned treatments,
  and never let a manufacturer's brand color leak into Champion's own chrome (nav,
  footer, forms).

## Photography
High-quality, natural light, real environments, **people in frame** — a customer
collecting keys, a technician explaining a diagnostic, a family loading the boot. The
car is often the enabler, not the hero. Real Israeli context beats generic European
studio backdrops. Text over imagery needs a solid panel or a navy scrim at 60%+ opacity,
never a hope that the photo is dark enough.

**Avoid:** cars floating on gradient voids · lens flare and heavy vignettes ·
motion-blur speed clichés · price starbursts composited onto imagery · staged stock smiles.

## Motion
200–300ms for UI transitions, up to 600ms for larger reveals.
Easing `cubic-bezier(0.4, 0, 0.2, 1)`. Fade and gentle rise — no bounce, no aggressive
slides, no attention-grabbing loops. Respect `prefers-reduced-motion` with a static
equivalent.

## Accessibility floor
Non-negotiable — part of the Responsibility value, not a compliance afterthought.
- Text contrast ≥ 4.5:1 normal, ≥ 3:1 large (≥18.66px or ≥14px bold)
- UI component and focus-indicator contrast ≥ 3:1
- Never communicate meaning through color alone
- Visible focus indicators everywhere; never `outline: none` without a replacement
- Touch targets ≥ 44×44px · body text ≥ 16px
- Full keyboard operability with logical RTL tab order
- Meaningful Hebrew `alt` text on informational images

## Quick checklist — "Does this look Champion Motors?"
- ✅ One navy identity block per view
- ✅ Champion Blue on clickable things only
- ✅ Signal Red in at most one role, tied to a real fact
- ✅ Body text in `cm-ink`, generous line height for Hebrew
- ✅ Layout built on logical properties — genuinely RTL, not hand-flipped
- ✅ Latin model names and numerals inline LTR
- ✅ A human is present in the imagery
- ✅ Whitespace is generous; nothing cramped to fit more in
- ❌ No Action Blue as a background fill or heading color
- ❌ No navy + blue in the same headline
- ❌ No third blue or navy shade beyond the tokens above
- ❌ No pure black for reading text
- ❌ No recolored, stretched or flattened OEM logo
- ❌ No OEM brand color inside Champion's own chrome
- ❌ No gradients, no pill buttons, no serif or condensed faces
- ❌ No LTR component shipped without RTL mirroring
