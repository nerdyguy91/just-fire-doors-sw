# Prototype reference (Claude Design)

Read-only reference material from the approved Claude Design prototype, project `4fbcea84-33e9-4f66-8c10-d5aead95e0f4`. This folder is **not** part of the build. Use it to check layout, spacing, copy and data while building the Astro components. Do not import from it.

## Where it came from

The original bundles are also in this repository, one level up (`docs/*.dc.html`, with the design system in `docs/_ds/`). GitHub Pages publishes them as the clickable prototype.

The prototype was supplied as self-unpacking "bundled" HTML files. Each bundle contains:

- `<script type="__bundler/template">`: the page markup
- `__bundler/manifest`: the assets, base64-encoded and gzipped when `compressed` is true
- `__bundler/ext_resources`: asset names mapped to UUIDs

These files were unpacked on 2026-09-28. In the saved pages:

- Embedded fonts and data URIs were stripped.
- UUID image references were rewritten to the asset paths below.
- Runtime script references are labelled `support.js` or `(runtime script)`.

## Contents

| Path | What it is |
| :--- | :--- |
| `pages/home-b.dc.html` | `Just Fire Doors Home B.dc.html` (home). Uses the `split` hero and `ledger` process by default |
| `pages/service-repairs.dc.html` | `Service Repairs.dc.html` → `/services/fire-door-remedial-works/` |
| `pages/service-inspections.dc.html` | `Service Inspections.dc.html` → `/services/fire-door-inspections/` |
| `pages/service-maintenance.dc.html` | `Service Maintenance.dc.html` → `/services/fire-door-maintenance/` |
| `pages/service-replacement.dc.html` | `Service Replacement.dc.html` → `/services/fire-door-installation/` |
| `pages/projects.dc.html` | `Projects.dc.html` → `/projects/` and project pages |
| `pages/why-jfd.dc.html` | `Why JFD.dc.html` → `/about/` |
| `pages/contact.dc.html` | `Contact.dc.html` → `/contact/` |
| `pages/get-a-quote.dc.html` | `Get a Quote.dc.html` → `/get-a-quote/` |
| `components/*.dc.html` | Shared prototype components (`JfdHeader`, `JfdFooter`, `JfdProofStrip`, `JfdDecision`, `JfdEvidence`, `JfdWhy`, `JfdFaq`, `JfdFinalCta`, `JfdCaseStudy`) |
| `design-system/tokens/*.css` | Design tokens: colours, typography, layout, effects, fonts |
| `design-system/jfd.css` | Base styles and class library |

Page copy and repeated data (FAQs, case studies, rows) live in each page's `renderVals()` script, at the bottom of the file.

## Image assets

The originals are in `src/assets/images/`. They are processed at build time (AVIF/WebP, responsive widths, metadata stripped) and must never be placed in `public/`. The originals were checked on 2026-09-28 and contain no GPS metadata.

Files without a prototype filename were only referenced by UUID and have been named from their alt text.

| Repo path (`src/assets/images/…`) | Prototype name | Size |
| :--- | :--- | :--- |
| `evidence/dds-firestopping.jpeg` | `assets/dds-firestopping.jpeg` | 1280x2774 |
| `evidence/dds-gap-checks.jpeg` | `assets/dds-gap-checks.jpeg` | 1280x2774 |
| `evidence/dds-install-checks.jpeg` | `assets/dds-install-checks.jpeg` | 1280x2774 |
| `evidence/dds-parts-list.jpeg` | `assets/dds-parts-list.jpeg` | 1280x2598 |
| `logos/bsc-fire-door-installation.jpg` | `assets/bsc-fire-door-installation.jpg` | 1024x1024 |
| `logos/door-data-systems.jpeg` | `assets/door-data-systems.jpeg` | 200x200 (converted from CMYK) |
| `logos/university-of-plymouth.png` | — | 900x500 |
| `photos/bodmin-installer.jpeg` | `assets/bodmin-installer.jpeg` | 1280x1707 |
| `photos/bodmin-ward-double-doorset.jpeg` | — | 1280x1707 |
| `photos/council-hinges.jpeg` | `assets/council-hinges.jpeg` | 1280x1707 |
| `photos/davey-corridor.jpeg` | `assets/davey-corridor.jpeg` | 1280x1707 |
| `photos/davey-lab-doorset.jpeg` | `assets/davey-lab-doorset.jpeg` | 1280x1707 |
| `photos/existing-opening-refurbishment.jpeg` | — | 1280x1707 |
| `photos/exmouth-bsc-label.jpeg` | `assets/exmouth-bsc-label.jpeg` | 1280x1707 |
| `photos/mammo-blind-door.jpeg` | `assets/mammo-blind-door.jpeg` | 1280x1707 |
| `photos/mammo-corridor.jpeg` | `assets/mammo-corridor.jpeg` | 1280x1707 |
| `photos/mammo-double-door.jpeg` | `assets/mammo-double-door.jpeg` | 1280x1707 |
| `photos/mammo-rooms.jpeg` | `assets/mammo-rooms.jpeg` | 1280x1707 |
| `photos/penryn-doorset.jpeg` | `assets/penryn-doorset.jpeg` | 1280x1707 |
| `photos/pub-closer.jpeg` | `assets/pub-closer.jpeg` | 1280x1707 |
| `photos/stoke-lock.jpeg` | `assets/stoke-lock.jpeg` | 1280x1707 |
| `photos/stoke-room.jpeg` | `assets/stoke-room.jpeg` | 1280x1707 |
| `photos/torbridge-doorset.jpeg` | `assets/torbridge-doorset.jpeg` | 1280x1707 |
| `photos/torbridge-mercury.jpeg` | `assets/torbridge-mercury.jpeg` | 1280x1706 |
| `photos/torbridge-sign.jpeg` | `assets/torbridge-sign.jpeg` | 2048x1536 |
| `photos/weston-classroom-double-doorset.jpeg` | — | 1280x1707 |
| `photos/weston-corridor.jpeg` | — | 1280x1707 |
| `photos/weston-doorsets.jpeg` | — | 1280x1707 |
| `photos/weston-double-doorset-closers.jpeg` | — | 1280x1707 |

## Known asset gaps

- `logos/door-data-systems.jpeg` is only 200×200 px. Ask DDS for an SVG or a larger PNG.
- `logos/bsc-fire-door-installation.jpg` (BlueSky badge) is a 1024×1024 raster. Ask BlueSky for a vector version, and confirm logo usage rights (plan Decision 2).
- `logos/university-of-plymouth.png`: permission to use the logo is still needed (plan Decision 2).
- The four `evidence/dds-*.jpeg` files are tall phone screenshots. Crop them to the region the design shows when building the components.
