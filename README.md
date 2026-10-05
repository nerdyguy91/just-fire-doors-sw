# Just Fire Doors SW website

Static Astro site for Just Fire Doors SW, hosted on Cloudflare Pages. Enquiry forms go through Cloudflare Pages Functions, and uploaded files are stored in Cloudflare R2.

## Repository layout

- `src/`, `public/`, `functions/`: the production site (Astro) and its Cloudflare Pages Functions.
- `docs/`: two things share this folder.
  - The approved **Claude Design prototype**, as exported (`docs/*.dc.html`, `docs/index.html`, `docs/_ds/`). GitHub Pages publishes it from `main` at <https://nerdyguy91.github.io/just-fire-doors-sw/>, so leave these files and `docs/.nojekyll` in place.
  - Project documents: `docs/architecture-plan.md` (the build plan), `docs/brand/` and `docs/prototype/` (unpacked prototype templates for reference). GitHub Pages serves these too, as plain files.

## Requirements

- Node 22 LTS (see `.nvmrc`)
- npm

## Commands

| Command                       | Action                                                                                |
| :---------------------------- | :------------------------------------------------------------------------------------ |
| `npm install`                 | Install dependencies                                                                  |
| `npm run dev`                 | Dev server at `localhost:4321`                                                        |
| `npm run build`               | Build the static site to `./dist/`                                                    |
| `npm run preview`             | Serve the built site locally                                                          |
| `npx wrangler pages dev dist` | Serve `dist/` together with the Pages Functions and R2 locally                        |
| `npm run check`               | Type-check (`astro check`)                                                            |
| `npm test`                    | Unit tests (`node --test`)                                                            |
| `npm run format`              | Format with Prettier                                                                  |
| `npm run lint:html`           | Validate the built HTML                                                               |
| `npm run ci`                  | Format check, type check, tests, build, HTML validation and built-site checks         |
| `npm run check:dist`          | Built site: no placeholders, links and anchors resolve, size budgets                  |
| `npm run a11y`                | Accessibility (axe, WCAG 2 AA) on every sitemap page; needs `npm run preview` running |
| `npm run lhci`                | Lighthouse budgets on five key pages; needs `npm run preview` running                 |

## Environment

Copy `.env.example` to `.dev.vars` for local function testing. Production and preview values are set in the Cloudflare Pages dashboard, and secrets are never committed.

## Testing the forms locally

The forms need the Pages Functions in `functions/` and an R2 bucket, which `astro dev` doesn't run. To test them:

1. Copy `.env.example` to `.dev.vars` and set `FILE_LINK_SECRET` (`openssl rand -hex 32`), `FORM_TO_EMAIL`, `FORM_FROM_EMAIL` and a Resend key. Keep Cloudflare's Turnstile test keys.
2. Build with the Turnstile site key: `PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build`.
3. Run `npx wrangler pages dev dist`. Wrangler simulates the bucket on disk in `.wrangler/`.

Without a Resend key, set `RESEND_API_URL` in `.dev.vars` to a local endpoint that accepts the request. This is for local testing only.

`npm test` covers the functions end to end against an in-memory bucket (`tests/functions.test.ts`).

## Analytics

Google Analytics 4 is switched on by setting `PUBLIC_GA_MEASUREMENT_ID` (for example `G-XXXXXXXXXX`) at build time. Without it the site ships no analytics code and no consent banner. With it, visitors see a consent banner. Until they choose, GA4 runs cookie-free (Consent Mode, analytics storage denied); accepting turns on cookies, and "Switch off" stops analytics entirely. Set `PUBLIC_GA_BEFORE_CONSENT=off` to load nothing from Google until a visitor accepts. Events are listed at the top of `src/scripts/track.ts`.

## Deploys

- Pushes to `main` deploy to production on Cloudflare Pages.
- Every other branch and pull request gets a preview URL.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and push to `main`: formatting, types, tests, build, HTML validity, the built-site checks, accessibility and Lighthouse. Lighthouse reports are kept as a workflow artifact for 14 days.

- **Accessibility:** `scripts/a11y.mjs` fails on confirmed axe violations. Results axe can't decide (the decorative → arrows, text over images) are listed for a manual check instead.
- **Lighthouse:** scores of 95 or more (SEO 100), CLS under 0.05, blocking time under 50 ms, and LCP under 2.5 s. The plan's 1.8 s LCP target is checked on the deployed site, because the local preview server is slower than Cloudflare.
- To run either against a deployed preview: `node scripts/a11y.mjs https://<preview-host>`.

## Dependency policy

- No runtime dependencies are shipped to the browser.
- New packages need a stated requirement that existing code can't meet.
- Dependabot opens grouped monthly updates.

## HTML validation exceptions

`.htmlvalidate.json` allows `role="list"` on `<ul>` and `<ol>`. It's deliberate: Safari with VoiceOver drops list semantics when `list-style: none` is set, and the explicit role restores them.

The About page credentials use ARIA table roles on `div`s (`role="table"`, `row`, `cell`, `columnheader`) rather than a native `<table>`. On mobile the rows stack, and changing `display` on native table elements removes their table semantics in Safari. The validator config allows these roles for that reason.
