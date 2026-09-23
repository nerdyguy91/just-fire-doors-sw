# Just Fire Doors — Design System

Just Fire Doors (SW) is a fire door specialist working in the South West: inspection, repair/remedial work and supply & install for landlords, housing providers and facilities teams. The single surface represented is the **marketing website** (home page "Design B").

## Sources
- `uploads/jfd-design-system.css` — "Just Fire Doors SW — Design System B", extracted from `Just Fire Doors Home B.dc.html` (that HTML file was not supplied). All tokens, classes and values here come from it verbatim.
- No logo, imagery, icon set or font binaries were supplied.

## Index
- `styles.css` — entry point (imports only)
- `tokens/` — `fonts.css` (Google Fonts import), `colors.css`, `typography.css`, `layout.css`, `effects.css` (base + semantic aliases)
- `css/jfd.css` — base reset + full `.jfd-*` class library, verbatim from source
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives (below), one card per folder
- `ui_kits/website/` — Home, Inspection, Book click-through
- `thumbnail.html`, `SKILL.md`

## Components
- actions: **Button** (primary / inverse / ghostDark; sm / md / lg), **TextLink** (onDark)
- navigation: **Wordmark**, **SiteHeader** (sticky, drop menu, scrolled state), **SiteFooter**
- layout: **Section** (ground / surface / tint / dark / action), **Heading** (h1 / h2 / h3 / statement, eyebrow, accent)
- content: **Card**, **Panel**, **HairlineGrid** + **Tile**, **Stat**, **Chip**, **NumberedRow**, **Flow**
- media: **Photo** (16x10 / 5x4 / 4x3, caption, striped placeholder)
- records: **StatusBadge** (closed / onsite / decide / neutral), **JobRecord**

### Intentional additions
- **Section**, **Heading**, **Wordmark** wrap source classes (`.jfd-section`, `.jfd-h*` + `.jfd-eyebrow`, `.jfd-wordmark`) so consumers compose pages without memorising class names.
- Booking form fields in the UI kit are styled inline (square, 52px, `--jfd-rule-strong` border) — the source defines no form inputs.

## CONTENT FUNDAMENTALS
- **Voice:** plain, practical, trade-competent. Speaks like a surveyor handing over a job sheet — specific, factual, no hype. Reassurance comes from evidence (records, photos, standards), not adjectives.
- **Person:** "we" for the company, "you" for the client. "We'll confirm a date." "You'll know exactly what was found."
- **Casing:** sentence case for headings and buttons ("Book an inspection", not "Book An Inspection"). UPPERCASE only via mono eyebrows/labels/chips (CSS `text-transform`), so write them in normal case.
- **Headlines:** short, declarative, often split with a blue accent tail: "Fire doors *that actually close.*" Statements end with a full stop.
- **Vocabulary:** job-sheet language — Closed, On site, Decision needed, Booked; door IDs (FD-01), job refs (JFD-2291), ratings (FD30, FD60), standards (BS 8214).
- **Numbers:** use real, concrete figures ("48 hr", "4mm") in condensed stat type.
- **Process:** expressed as a mono arrow flow: Survey → Report → Repair → Certify.
- **Emoji:** never. Arrows (→) and carets (▾) are the only unicode glyphs.

## VISUAL FOUNDATIONS
- **Colour:** cool technical neutrals — graphite ink `#23282C` on ground `#F4F6F8`, white surfaces, tint `#E9EDF1`. One action blue `#0E6FAF` (hover `#0B5789`) carries buttons, links and eyebrows. Azure `#29A9E9` is the logo-mark colour — only used as the 3px `.jfd-divider-azure` rule, never for text on light. Soft/pale/mist azures are for text on dark and on action-blue bands. Status colours are muted (green, amber, brick) and appear only as dot+label.
- **Type:** Barlow Condensed 600 for display with negative tracking (−0.025em), tight leading (1.02–1.16); Barlow 400/500 for body (16/1.58, lead 18.5/1.62, max 48ch); IBM Plex Mono for eyebrows, labels, IDs, captions — always uppercase with 0.06–0.1em tracking. Fluid clamp() sizes for H1–H3.
- **Layout:** 1240 max, 28px gutter, 88px section rhythm. Full-width bands alternate ground → surface → tint, each closed by a 1px bottom rule; graphite and action-blue bands punctuate. Card grid 24px gap, auto-fit minmax(310px). Sticky header 82px → 64px on scroll.
- **Corners:** **square everywhere** (`--jfd-radius: 0`). Only status dots are round.
- **Borders:** hairlines do the structural work — `#D7DDE3` default, `#C9D2DA` for raised panels, `#EAEEF2` row dividers. Hairline grids use 1px gaps on the rule colour for a spec-sheet look.
- **Shadows:** almost none. Two long, soft, negative-spread shadows: panel (`0 26px 60px -34px`) for the hero job sheet, menu (`0 18px 44px -24px`) for drop menus. Cards are flat.
- **Cards:** white, 1px rule border, 3:2 media on `#E4E9EE` with bottom rule, body 24/24/26, meta line with top rule. Hover = border turns action blue; no lift.
- **Backgrounds:** flat colour only. No gradients except the diagonal-stripe placeholder pattern. No textures, no illustration.
- **Imagery:** documentary site photography in hairline frames at fixed ratios (16:10, 5:4, 4:3) with mono uppercase captions. Expect neutral/cool, honest, unfiltered work photos. None supplied — use `Photo` placeholders.
- **Transparency & blur:** only the sticky header — `rgba(244,246,248,0.94)` + `blur(8px)`.
- **Motion:** minimal. `.18s ease` colour/background transitions; `.2s` card border; `.22s` header height. No bounces, no entrance animations. `prefers-reduced-motion` kills all transitions.
- **Hover:** buttons darken; links darken and underline strengthens (`#A9C6DB` → action); nav links turn blue; menu rows get tint bg; footer links go azure-soft; ghost-dark buttons outline in azure-soft. **Press:** no distinct press state defined. **Focus:** 2px action-blue outline, 3px offset.

## ICONOGRAPHY
The source defines **no icon system** — no icon font, sprite or SVGs. Visual markers are typographic: mono index numerals (01, 02), status dots (CSS `::before` circles), the `→` arrow in flows and links, and `▾` for drop menus. Don't introduce an icon set without brand approval; if one becomes necessary, a thin-stroke square-capped set (e.g. Lucide at 1.5px) would sit closest — flag it as a substitution.

## Brand mark
**No logo file was supplied.** The wordmark is type-only: "Just Fire Doors" in Barlow Condensed 700 with a superscript "SW" (`.jfd-wordmark` / `Wordmark`). Replace with real artwork when available.

## Fonts
Barlow Condensed, Barlow and IBM Plex Mono are loaded from Google Fonts as the source specifies — no local binaries.
