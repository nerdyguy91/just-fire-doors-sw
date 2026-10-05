# Just Fire Doors SW: production architecture and build plan

## Context

Just Fire Doors SW (JFD) is a fire door contractor based in Plymouth. Its main commercial service is fire door **remedial works** for estates, facilities and property teams. Claude Design produced an approved visual and UX prototype of nine pages. It works as a design, but its technical build is not production-ready:

- Every page is rendered in the browser. The prototype uses the Claude Design runtime, React 18 loaded from unpkg, and inline JSX style strings.
- Each bundle weighs 0.8–5.4 MB.
- The `<noscript>` message says "This page requires JavaScript to display."
- There are no meta descriptions, canonicals or `lang` attribute.
- Nav items and FAQ answers are missing from the DOM until someone clicks them.
- Both forms are simulated.

The aim is a static site with no framework JavaScript that looks the same, loads instantly, can be crawled, meets WCAG 2.2 AA, and turns visitors into qualified enquiries. It should cost close to nothing to host and should be easy to extend with projects, service content and useful regional content later.

**Planning only. No production code has been written.** The working directory `/Users/alexprinter/Client Websites/JustFireDoors` is empty.

---

## 1. Prototype audit

### 1.1 What was inspected

The prototype files came from the attached Claude Design bundles. Each bundle is a self-unpacking HTML file. Inside it:

- `<script type="__bundler/template">` holds the page.
- `__bundler/manifest` holds the assets as base64, some gzipped.
- `__bundler/ext_resources` maps each asset name to its UUID.

| Prototype file                   | Page                                                                     | Header `active` |
| -------------------------------- | ------------------------------------------------------------------------ | --------------- |
| `Just Fire Doors Home B.dc.html` | Home. Hero variant `split` and process variant `ledger` are the defaults | –               |
| `Service Inspections.dc.html`    | Fire Door Inspections & Surveys                                          | inspections     |
| `Service Repairs.dc.html`        | Fire Door Repairs & Remedial Works                                       | repairs         |
| `Service Maintenance.dc.html`    | Fire Door Maintenance                                                    | maintenance     |
| `Service Replacement.dc.html`    | Fire Door Replacement & Installation                                     | replacement     |
| `Projects.dc.html`               | Projects: Mammography Unit, Tor Bridge High, Stoke Damerel               | projects        |
| `Why JFD.dc.html`                | Why Just Fire Doors?                                                     | why             |
| `Contact.dc.html`                | Contact, with a message form                                             | contact         |
| `Get a Quote.dc.html`            | Quote router with five routes (a–e), each with its own form and uploads  | –               |

**Shared components:**

| Component       | What it is                           |
| --------------- | ------------------------------------ |
| `JfdHeader`     | Header                               |
| `JfdFooter`     | Footer                               |
| `JfdProofStrip` | Accreditation and proof strip        |
| `JfdDecision`   | Repair / replace / investigate triad |
| `JfdEvidence`   | Close-out evidence block             |
| `JfdWhy`        | "Why JFD" section                    |
| `JfdFaq`        | FAQs                                 |
| `JfdFinalCta`   | Closing call to action               |
| `JfdCaseStudy`  | Case study                           |

**Design system:** the `_ds/just-fire-doors-design-system…` folder contains:

- token files: `colors.css`, `typography.css`, `layout.css`, `effects.css`, `fonts.css`
- the `css/jfd.css` class library, which covers container, section, buttons, header, cards, photo, record, status, row, flow and footer

**Assets:**

- About 30 site photos, mostly 1280×1707 JPEGs at around 230 KB each. Four are 1280×2774 phone screenshots from the Door Data Systems (DDS) app.
- Logos: BlueSky certified-installer badge and DDS logo, both 200×200 **CMYK** JPEGs, and the University of Plymouth logo as a 900×500 PNG.

### 1.2 What to keep (the approved visual and UX spec)

**Visual system**

- **Tokens:** keep them exactly as they are.
  - Azure `#29A9E9`, action blue `#0E6FAF` / `#0B5789`, graphite `#23282C` and the neutral scale.
  - Status colours: closed `#1F6B4D`, on site `#8A6100`, decide `#A33A2A`.
  - Square corners (`--jfd-radius: 0`), 1240 px maximum width, 28 px gutter.
- **Typography:**
  - Barlow Condensed 600/700 for display text.
  - Barlow 400/500/600 for body text.
  - IBM Plex Mono 400/500 for labels, eyebrows and IDs.
  - Keep the existing fluid `clamp()` scale.
- **Visual language:**
  - hairline grids (1 px gaps over a rule-colour background)
  - uppercase mono eyebrows and labels
  - numbered rows
  - the dark "principle" band
  - the action-blue closing CTA
  - sticky side column in the "Why" section
- **"Job sheet" record motif:** door ID → finding → action → status dot. It appears in the:
  - home hero record
  - quotation table
  - programme view
  - backlog handoff
  - "what people usually send" file stack

  This motif is the brand's signature, so keep it as real HTML, not images.

**Content and UX**

- All copy, the section order on every page, and the image choices, crops (`object-position`) and alt text. The existing alt text is good.
- The Decide → Deliver → Close narrative.
- Call-to-action hierarchy:
  - primary: "Send us your survey or job sheet" (the quote form, route a)
  - secondary: "Talk through your fire-door work" (contact)
- Quote router: five routes with route-specific fields. Only a name and one contact method are required. Keep the error summary pattern, inline errors and success receipt.
- Contact form fields and messages, exactly as in the prototype.

### 1.3 Problems to fix before production

| #   | Issue in prototype                                                                                                                                                          | Type                  | Fix                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | All content rendered in the browser by React and the Claude Design runtime; blank without JS                                                                                | SEO / Perf            | Pre-render to static HTML (Astro)                                                                                                                        |
| 2   | Inline JSX style strings on every element; tokens duplicated as literal hex values                                                                                          | Perf / Maint          | Class-based CSS built on the existing tokens and `jfd.css`                                                                                               |
| 3   | Google Fonts loaded via `@import`, including Vietnamese, Cyrillic and Latin-Ext subsets                                                                                     | Perf / Privacy        | Self-host a Latin-only WOFF2 subset; preload two files                                                                                                   |
| 4   | Header decides mobile or desktop layout from `window.innerWidth >= 980` in JS                                                                                               | Perf / CLS / a11y     | CSS media queries                                                                                                                                        |
| 5   | Services dropdown and mobile menu are only added to the DOM when open (`sc-if`); links can't be crawled                                                                     | SEO / a11y            | Keep the links in the DOM and toggle `hidden` with a disclosure button. Drop `aria-haspopup`: this is a disclosure, not an ARIA menu                     |
| 6   | FAQ answers are only in the DOM when expanded                                                                                                                               | SEO / a11y            | `<details><summary>`, so all answers are in the HTML and FAQPage schema matches the visible content                                                      |
| 7   | Quote router and Yes/No/Not-sure control are `<button role="radio">`                                                                                                        | a11y                  | Native `<input type="radio">` styled as cards                                                                                                            |
| 8   | File dropzone is a `div role="button"` driving a hidden input; upload progress is faked                                                                                     | a11y / function       | Visible native `<input type="file" multiple>` with a label; drag-and-drop added as an enhancement; the progress bars now show real upload progress to R2 |
| 9   | Forms validate only in the browser and don't submit anywhere                                                                                                                | Function / security   | Native POST to a server function; shared validation rules; honeypot plus Turnstile                                                                       |
| 10  | Focus ring is always 2 px `#0E6FAF`, which is invisible on the `#0B5789`, `#0E6FAF` and `#23282C` backgrounds                                                               | a11y (2.4.7 / 2.4.11) | `--focus-ring` token set to white or azure-soft in dark and action sections; also check forced-colours mode                                              |
| 11  | No skip link; `<html>` has no `lang`                                                                                                                                        | a11y                  | Skip link to `#main`; `lang="en-GB"`                                                                                                                     |
| 12  | `<font color>` inside the home H1                                                                                                                                           | Markup                | `<span class="jfd-accent">`                                                                                                                              |
| 13  | Every `<section>` has an `aria-label`, creating many region landmarks                                                                                                       | a11y                  | `aria-labelledby` pointing at the visible H2; no label when unnecessary                                                                                  |
| 14  | Decorative arrows (→, ↓) read aloud; `scroll-behavior: smooth` ignores reduced-motion                                                                                       | a11y                  | Hide the arrows with `aria-hidden`; enable smooth scroll only under `prefers-reduced-motion: no-preference`                                              |
| 15  | Illustrative records (the job sheet, quote Q-2291 with £ prices, programme, backlog) are built from spans                                                                   | a11y                  | Semantic `<table>` with a caption. Keep the visible "Illustrative" caption until real anonymised examples replace them                                   |
| 16  | Wordmark icon drawn with CSS border triangles; home page has a duplicated inline footer                                                                                     | Maint                 | Inline SVG wordmark (also used for the favicon); one shared footer                                                                                       |
| 17  | 1280 px JPEGs served at every size; 1280×2774 screenshots shown cropped; CMYK logo JPEGs                                                                                    | Perf / rendering      | `astro:assets` AVIF/WebP `srcset`; crop the screenshots at build time to their displayed ratio; convert logos to sRGB, or use SVG from the issuers       |
| 18  | Links point to `.dc.html` files; Privacy and Terms link to `#top`; the "Services" breadcrumb isn't linked                                                                   | SEO                   | Clean URLs; a real `/privacy/` page; a `/services/` hub                                                                                                  |
| 19  | "To confirm", "To add" and `showNotes` notes default to on for several pages; bracketed placeholders (founder, hours, `[X] years`); phone `01752 000 000`                   | Content               | Never render them. Track them in `CONTENT-TODO.md` and treat them as launch blockers                                                                     |
| 20  | The home page features a Weston-super-Mare project (150 doors) and the University of Plymouth Davey Building, but `/projects/` has neither ("View project →" leads nowhere) | Content / UX          | Add both as projects if the copy is supplied; otherwise link to real anchors only                                                                        |
| 21  | Home page has two variant switches (hero `split`/`ledger`, process `ledger`/`rail`)                                                                                         | Scope                 | Ship the defaults only: `split` hero and `ledger` process                                                                                                |

---

## 2. Recommended architecture

### 2.1 Stack

| Layer                | Choice                                                                                                                                                                          | Why                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site generator       | **Astro, current stable, `output: 'static'`, no UI-framework integration**                                                                                                      | Ships HTML with no JavaScript by default. Components map one-to-one to the prototype's `.dc` components. Built-in image pipeline (`astro:assets` with sharp), typed content collections and scoped CSS. One build step, no runtime. Plain static HTML would mean copying the header, footer, schema and nine sets of `<head>` by hand; React or Next.js would add hydration nothing here needs. |
| Styling              | Plain CSS: tokens (verbatim) + `base.css` + scoped `<style>` in components                                                                                                      | Nothing to install. Tailwind isn't needed because the design system already exists.                                                                                                                                                                                                                                                                                                             |
| Client JS            | Three small vanilla TS modules, bundled by Astro and loaded only where used: `nav.ts` (~1 KB, all pages), `forms.ts` (~4 KB, contact and quote only), `track.ts` (~0.5 KB)      | Progressive enhancement: every page works without JS.                                                                                                                                                                                                                                                                                                                                           |
| Content              | Astro content collections for **projects** (Markdown) and **FAQs** (YAML), plus typed TS data files for business facts, services and navigation                                 | No CMS. The Zod schemas can later map onto a Git-based CMS (such as Keystatic or Decap) or a headless one without changing the templates.                                                                                                                                                                                                                                                       |
| Form backend         | **Four small Cloudflare Pages Functions**: `api/upload-session`, `api/upload`, `api/enquiry`, `files/[[key]]`                                                                   | Server-side validation, Turnstile check, streaming uploads, email sending and signed file downloads, with secrets and bindings held in Cloudflare. No backend app and no Astro SSR adapter.                                                                                                                                                                                                     |
| File storage         | **Cloudflare R2**: private bucket `jfd-enquiry-uploads`, bound to the functions as `UPLOADS`                                                                                    | Handles surveys up to **50 MB per file** (the prototype's limit) without size-limited email attachments. Egress is free and the free tier (10 GB) far exceeds likely volume. There is no public bucket access and no `r2.dev` URL.                                                                                                                                                              |
| Email delivery       | Transactional API (**Resend** recommended; Postmark is the alternative), called with `fetch` from the function                                                                  | Plain-text email to `FORM_TO_EMAIL` with `Reply-To` set to the enquirer. It contains **signed, expiring download links** to the uploaded files, not attachments.                                                                                                                                                                                                                                |
| Spam protection      | Honeypot + minimum fill time + **Cloudflare Turnstile** (managed mode, loaded only on form pages when the form is first focused) + a Cloudflare WAF rate-limit rule on `/api/*` | Privacy-friendly and free.                                                                                                                                                                                                                                                                                                                                                                      |
| Hosting              | **Cloudflare Pages**                                                                                                                                                            | See 2.3.                                                                                                                                                                                                                                                                                                                                                                                        |
| Runtime dependencies | **None**                                                                                                                                                                        | –                                                                                                                                                                                                                                                                                                                                                                                               |
| Dev dependencies     | `astro`, `@astrojs/sitemap`, `sharp` (image processing), `typescript`, `@astrojs/check`, `prettier` + `prettier-plugin-astro`, `html-validate`, `@lhci/cli`, `pa11y-ci`         | Each one covers a specific requirement: build, sitemap, images, type checks, formatting, markup validity, performance budgets and accessibility.                                                                                                                                                                                                                                                |

### 2.2 Rendering and JavaScript

- **Every page is pre-rendered at build time.**
- `trailingSlash: 'always'` and `build.format: 'directory'`, so URLs look like `/services/fire-door-remedial-works/`.
- **Navigation:**
  - With JS, `<html class="no-js">` is swapped to `js` by a hashed three-line inline script in `<head>`. This prevents layout shift on mobile.
  - With JS, the Services menu and mobile menu are disclosure buttons (`aria-expanded`, `aria-controls`). Escape closes them and returns focus to the button; clicking outside closes them.
  - Without JS, the mobile nav simply shows expanded.
- **Header shrink on scroll** (82 px → 64 px): an IntersectionObserver on a sentinel element toggles `.is-scrolled`. No scroll listeners.
- **FAQ:** `<details>` elements, no JS.
- **Quote router:** native radio buttons plus CSS `:has()` show the chosen route's fieldsets with no JS. The server reads `route` and ignores fields from other routes. `forms.ts` adds:
  - hash deep-links (`#survey`, `#backlog`, `#inspection`, `#maintenance`, `#not-sure`, replacing `#route-a` to `#route-e`)
  - inline validation
  - a selected-files list with remove buttons and size checks
  - **real upload progress** to R2 (XHR `upload.onprogress`), which drives the prototype's existing progress-bar UI
  - `fetch` submission, with the in-page receipt and success state from the prototype
  - moving focus to the error summary or success heading
- **Without JS, forms still work:**
  - Text fields submit as a normal POST. Uploads need JS, because both Turnstile and the streaming upload depend on it.
  - The file field shows a no-JS note instead: "Send the form, then email your documents to {email} and quote your name."
  - A successful POST gets a 303 redirect to `/contact/thanks/` or `/get-a-quote/thanks/` (`noindex`, left out of the sitemap).
  - On a validation failure, the function returns a minimal accessible HTML error page listing the problems, with a "Go back" link. Browsers keep the typed values when going back.

### 2.3 Hosting: Cloudflare Pages (recommended)

|                          | Cloudflare Pages                                                         | Netlify                                                            | Vercel                                                           | Traditional static / cPanel            |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------- |
| UK performance           | London and Manchester PoPs; very fast time to first byte                 | Good (UK/EU edge)                                                  | Good                                                             | One origin server; depends on the host |
| Bandwidth / cost         | Free, unmetered static bandwidth; Functions free up to 100k requests/day | Free tier now credit-based; Forms limited to 100 submissions/month | **Hobby plan forbids commercial use**, so Pro at about $20/month | £3–10/month                            |
| SSL, redirects, headers  | Automatic; `_headers` and `_redirects` files; redirect rules             | Same                                                               | `vercel.json`                                                    | Manual `.htaccess`                     |
| Forms / serverless       | Pages Functions, plus native Turnstile and R2 if needed                  | Netlify Forms (no code, but capped) or Functions                   | Functions                                                        | PHP mail script (security burden)      |
| Previews and maintenance | Preview URL for every branch and PR; nothing to patch                    | Same                                                               | Same                                                             | Manual FTP deploys; server upkeep      |

**Choose Cloudflare Pages:**

- Hosting is free at this scale.
- It has the best UK edge performance of the four.
- The form function, Turnstile, DNS, WAF rate limiting and HTTPS all live in one account.

The site is static files, four small function files and one R2 bucket. If Cloudflare consolidates Pages into Workers static assets, the move is a configuration change, not a rewrite.

---

## 3. Site structure and URLs

**Launch URLs.** Every page listed here has distinct content already written in the prototype.

| URL                                        | Source              | Notes                                                                                                                                                                                                                                                                          |
| ------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                                        | Home B              | Split hero and ledger process                                                                                                                                                                                                                                                  |
| `/services/`                               | **New**, small hub  | Reuses the prototype's service cards and the "capability map" from Why JFD (Inspect / Repair / Maintain / Replace). Gives the breadcrumb a target.                                                                                                                             |
| `/services/fire-door-remedial-works/`      | Service Repairs     | **Priority commercial page.** H1 stays "Fire Door Repairs & Remedial Works" so it covers both "repair" and "remedial" searches.                                                                                                                                                |
| `/services/fire-door-inspections/`         | Service Inspections | Genuinely offered: it has its own content, FAQs and quote route c                                                                                                                                                                                                              |
| `/services/fire-door-maintenance/`         | Service Maintenance | Genuinely offered: quote route d                                                                                                                                                                                                                                               |
| `/services/fire-door-installation/`        | Service Replacement | H1 stays "Fire Door Replacement & Installation"; the slug matches BlueSky's "Fire Door Installation" certification and the search term                                                                                                                                         |
| `/projects/`                               | Projects            | Index with the prototype's intro and "same need for clarity" sections, plus project cards                                                                                                                                                                                      |
| `/projects/{slug}/`                        | `JfdCaseStudy` data | One page per project, e.g. `plymouth-mammography-unit`, `tor-bridge-high`, `stoke-damerel-community-college` (and Weston-super-Mare schools and University of Plymouth Davey Building once written). **Visible change from the prototype's single long page: see Decision 7.** |
| `/about/`                                  | Why JFD             | Nav label stays "Why JFD"; H1 "Why Just Fire Doors?"                                                                                                                                                                                                                           |
| `/contact/` (+ `/contact/thanks/`)         | Contact             | Thanks page is `noindex`                                                                                                                                                                                                                                                       |
| `/get-a-quote/` (+ `/get-a-quote/thanks/`) | Get a Quote         | Thanks page is `noindex`                                                                                                                                                                                                                                                       |
| `/privacy/`                                | **New**             | Required under UK GDPR, because the form collects personal data and files                                                                                                                                                                                                      |
| `/404`                                     | **New**             | Branded page linking to services, projects and contact                                                                                                                                                                                                                         |

**Not built at launch, deliberately:**

- **`/sectors/`:** the prototype has no sector content. Healthcare and education are covered in project pages and the "occupied buildings" sections. Add `/sectors/{healthcare|education}/` only when there are at least two projects plus content specific to the sector (e.g. HTM/NHS estates constraints, working in school holidays).
- **`/locations/`:** no town pages. Coverage is stated once, from central data, on contact, about and the footer. **Possible later page:** `/locations/plymouth/`. Four named projects are in Plymouth (Davey Building, Mammography Unit, Tor Bridge, Stoke Damerel), so this page could be genuinely local. Build it only with that content. Cornwall and Devon pages would need the same level of local project evidence.
- **`/insights/` and a standalone `/faqs/`:** FAQs live on the page they relate to. Add an Insights Markdown collection when there is real content to publish (e.g. "What a fire door remedial schedule should contain").
- **`/terms/`:** only if JFD supplies terms. Otherwise remove the link.

**Internal linking**

- Header:
  - Services (disclosure listing all four, plus "All services")
  - Projects
  - Why JFD (`/about/`)
  - Contact
  - Button: "Send us your job sheet" (`/get-a-quote/#survey`)
- The footer mirrors the header and adds Privacy.
- Service pages cross-link as the prototype already does:
  - remedial works → installation and maintenance
  - inspections → remedial works
- Project pages link to the services they used.
- Service pages link to relevant projects.
- Breadcrumbs appear on every page except home.
- The home page's "Situation" cards keep pointing at the quote routes: backlog → `#backlog`, capacity → `#backlog`, evidence → `#not-sure`, maintenance → `#maintenance`.

---

## 4. Technical SEO

- **Metadata API.** `BaseLayout` requires these props:
  - `title` and `description` (both required)
  - `canonicalPath`
  - `ogImage?`, `noindex?`
  - `breadcrumbs?` (array of `{name, path}`)
  - `schema?` (array of JSON-LD nodes)

  The canonical URL is `site + canonicalPath`, always absolute, HTTPS and with a trailing slash. OG and Twitter tags use `summary_large_image` and a default 1200×630 branded image, with a per-page override. Output `<html lang="en-GB">`.

- **Titles.** Start from the prototype's titles and fix the home page, which is currently "Bundled Page". Pattern: `{Primary term} | {Region} | Just Fire Doors`, 60 characters or fewer. The region wording must use only coverage that has been confirmed.
  - Example: "Fire Door Remedial Works & Repairs | Plymouth & South West | Just Fire Doors" (trim to fit).
  - Meta descriptions: 140–160 characters, written from the hero copy.
- **Headings.** One H1 per page (the prototype already has this). H2 for sections, H3 for items. Stage labels such as "Decide" stay H3; the headline under them stays a `<p>`, as in the prototype.
- **Crawlability.** All primary content, nav links and FAQ answers are in the static HTML. There are no hash-only routes to content.
- **`robots.txt`.** Generated. Allow everything, disallow `/api/`, and point to the sitemap.
- **Sitemap.** `@astrojs/sitemap`, with the thanks pages and 404 filtered out.
- **Canonical host.**
  - Apex domain over HTTPS: `https://justfiredoorssw.com/` (confirmed in step 14, Decision 4).
  - `www` 301-redirects to the apex using a Cloudflare redirect rule.
  - HTTP → HTTPS via "Always Use HTTPS".
  - HSTS enabled.
  - URLs without a trailing slash 301 to the slashed version (Pages does this by default for directory-format builds).
  - `*.pages.dev` preview hosts get `X-Robots-Tag: noindex` through a `_headers` rule scoped to the preview host (or Cloudflare Access on previews).
- **Redirects.**
  - `_redirects` contains 301s from any existing site's URLs (see Decision 4).
  - Add friendly aliases: `/why-jfd/` → `/about/`, `/quote/` → `/get-a-quote/`.
  - Old `#route-a` to `#route-e` hashes are mapped in `forms.ts`.
- **Favicons.** `favicon.svg` (the wordmark mark), `favicon.ico` at 32 px, and `apple-touch-icon.png` at 180 px. **No web manifest:** this isn't an app, so it adds nothing.
- **Structured data** is built by `src/lib/schema.ts` from `src/data/business.ts`, and only ever uses fields that are populated. Nodes are linked by `@id`.

  | Node                                        | Where                                               | Contents (confirmed facts only)                                                                                                                                                     |
  | ------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `Organization` (`@id #org`)                 | Every page, via layout                              | name, legalName*, url, logo, telephone*, email*, `sameAs`* (Google Business Profile or LinkedIn if they exist)                                                                      |
  | `LocalBusiness` subtype `GeneralContractor` | Home, contact                                       | **Only if a public address is confirmed.** Otherwise `Organization` stands alone and `areaServed` goes on the services. No `openingHours` until confirmed.                          |
  | `WebSite`                                   | Home                                                | name, url, `publisher` → `#org`. No `SearchAction`, because the site has no search.                                                                                                 |
  | `Service`                                   | Each service page                                   | name, `serviceType`, description, url, `provider` → `#org`, `areaServed`*                                                                                                           |
  | `BreadcrumbList`                            | Every page except home                              | Generated from the same `breadcrumbs` prop that renders the visible trail                                                                                                           |
  | `FAQPage`                                   | Service pages and `/about/`, where FAQs are visible | Generated from the same YAML that renders `<details>`, so they always match. Rich results for FAQs are now limited by Google, but the markup is valid and costs nothing to produce. |

  \* Output only when the value is confirmed.

  Never output:
  - `Review` or `AggregateRating`
  - `foundingDate`
  - employee counts
  - credentials that are still placeholders

  BlueSky FDI-146 goes in visible content only.

---

## 5. Local SEO

- **Business details (name, address, phone)** come from `business.ts` alone: the footer, contact page, `tel:` and `mailto:` links, and schema all read from it. The spelling must be identical everywhere, e.g. "Just Fire Doors SW".
- **Google Business Profile:**
  - Set up as a service-area business (address hidden) unless JFD wants a public address.
  - Service areas: only confirmed ones.
  - Categories chosen from what GBP offers (for example "Fire protection service" and "Door supplier"), confirmed with JFD.
  - Website link to `/`; the profile URL goes in `sameAs`.
- **Region signals in content:** "Plymouth-based, working across Devon and Cornwall" (from the prototype), once confirmed. The project pages naturally name places: Plymouth, Bodmin, Penryn, Exmouth, Weston-super-Mare.
- **Citations and links:** a listing in the BlueSky certified-installer directory, if one exists; other relevant trade directories.
- **Reviews:** after launch, ask real clients for Google reviews. Never put reviews on the site without permission, and never mark them up.

---

## 6. Performance

**Budgets, enforced in Lighthouse CI on mobile:**

| Measure                   | Target                 |
| ------------------------- | ---------------------- |
| Lighthouse Performance    | 95 or more             |
| Lighthouse Accessibility  | 95 or more             |
| Lighthouse Best Practices | 95 or more             |
| Lighthouse SEO            | 100                    |
| LCP                       | Under 1.8 s (lab)      |
| CLS                       | Under 0.05             |
| Total blocking time       | Under 50 ms            |
| JS per page, own code     | 10 KB or less, gzipped |
| CSS per page              | 20 KB or less, gzipped |

- **LCP elements:**
  - **Home and service pages:** the H1 text. The heroes are HTML panels, not photos, so the display font is what matters most. Preload `barlow-condensed-600-latin.woff2` and `barlow-400-latin.woff2` only.
  - **Contact page:** the 1280×1707 installer photo, loaded with `<Picture loading="eager" fetchpriority="high">` and correct `sizes`.
- **Fonts:**
  - Self-host a Latin subset in WOFF2 with `font-display: swap`. Eight files:
    - Barlow 400, 500, 600
    - Barlow Condensed 500, 600, 700
    - Plex Mono 400, 500
  - Barlow Condensed 500 is kept: the prototype uses it in five places, including unweighted display text that renders at 500 because no 400 is loaded (amended in step 3).
  - Add fallback `@font-face` rules with `size-adjust` and ascent/descent overrides for Arial, to keep swap shift near zero.
  - All three families are licensed under the SIL Open Font License, so self-hosting is allowed.
- **Images.** A wrapper component, `Img.astro`, around `<Picture>`:
  - formats: AVIF, WebP, then JPEG fallback
  - widths: 360, 640, 960 and 1280
  - explicit `width` and `height` for the aspect ratios used in the prototype (3/2, 4/3, 5/4, 16/10)
  - `loading="lazy"` and `decoding="async"` by default; eager only for the LCP image
  - 1280×2774 DDS screenshots cropped at build time to the region shown
  - EXIF data, including any GPS, stripped. All photos live in `src/assets/`, **never** in `public/`.
- **CSS:**
  - Tokens and base CSS form one small global stylesheet; component styles are scoped.
  - `build.inlineStylesheets: 'auto'`.
  - Styles the pages don't use are removed from `jfd.css`.
- **Third parties:**
  - Only Turnstile (on the two form pages, loaded on first focus of the form) and the chosen analytics script (about 1 KB, `defer`).
  - No map embeds, chat widgets or social embeds.
- **Caching** (`_headers`):
  - `/_astro/*` and `/fonts/*`: `public, max-age=31536000, immutable`
  - HTML: `public, max-age=0, must-revalidate`, with Cloudflare's edge cache

---

## 7. Accessibility (WCAG 2.2 AA)

- **Semantics:**
  - landmarks: `header`, `nav` (labelled "Primary" and "Footer"), `main#main`, `footer`
  - skip link
  - `aria-labelledby` on sections that have headings
  - real lists and tables for list and record content
- **Navigation:** the disclosure pattern described in section 2.2, with `aria-current="page"` on the active item. The mobile menu has 44 px targets (the prototype already uses `min-height: 44px`).
- **Focus:**
  - `:focus-visible` rings use a `--focus-ring` token that switches on dark and action backgrounds.
  - Nothing is hidden under the sticky header: set `scroll-padding-top` to the header height.
  - Rings are checked in forced-colours mode.
- **Contrast:** the palette is text-safe as specified. Graphite, ink-3 `#5B646B` and ink-4 `#5F6970` all pass 4.5:1 on the light surfaces, and `#9BA7B1` passes on graphite. Azure `#29A9E9` is decorative only (bars and dots). **This must be confirmed with automated checks per page;** the 10.5–11.5 px mono labels are the thing to watch.
- **Status** is never shown by colour alone: the dot always sits next to a text label, as in the prototype.
- **Forms:**
  - Visible labels, with "Required" or "Optional" tags as in the prototype.
  - `autocomplete` tokens.
  - Hints and errors linked with `aria-describedby`; `aria-invalid` on errors.
  - Error summary with `role="alert"`; focus moves to the first invalid field.
  - Success message with `role="status"`, and focus moves to its heading.
  - Grouped controls use `fieldset` and `legend`.
  - The file input is native and has a visible label.
  - No placeholder-only labels.
- **Motion:**
  - The existing reduced-motion rule stays.
  - Smooth scroll only under `no-preference`.
  - The header shrink transition is turned off under reduced motion.
- **Images:** keep the prototype's alt text. Logos get their name as alt text. Photos that are decorative inside links get `alt=""` when the link text already describes them.

---

## 8. Content and component architecture

### 8.1 Data and content model

```
src/data/business.ts
  name, legalName, companyNumber?, registeredOffice?, phone?, email?, address? (public or not),
  areaServed[] (confirmed only), hours?, sameAs[], credentials[] (confirmed only)

src/data/services.ts
  [{ slug, navLabel, title, shortTitle, cardBody, cardImage, cardImagePos, serviceType, quoteRoute }]
  Used by: header, footer, home service cards, /services/ hub, related-service links, Service schema

src/data/navigation.ts
  Header and footer link groups

src/content/projects/*.md
  Frontmatter mirrors the JfdCaseStudy props:
    title, slug, n, useCase, sector, location, subhead, tags[], heroImage, heroAlt, caption,
    facts[{k, v}], situation[], stages[{label, title, lines[], callouts?, timeline?, shots?}],
    outcome, outcomeSub, services[] (service slugs), featured (bool), order, card{title, body, meta}
  Body: optional extra prose

src/content/faqs/{inspections,remedial-works,maintenance,installation,about}.yaml
  [{ q, a: string[], link?, href? }]
  The prototype's `note` field is dropped from content and moved to CONTENT-TODO.md
```

Service pages stay as hand-built `.astro` pages made from shared sections. Each one has distinct visuals (quotation, programme, backlog handoff), so forcing them into one Markdown template would lose the approved design. Structured, repeated content (services, projects, FAQs) goes into typed data or collections, so adding a project means adding one Markdown file.

### 8.2 Components (prototype → production)

| Production component                                                                                                            | From prototype                              | Action                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `layouts/BaseLayout.astro`                                                                                                      | page shell + `helmet`                       | Rebuild. Includes head/SEO, skip link, header, footer and JSON-LD                       |
| `seo/Seo.astro`, `seo/JsonLd.astro`                                                                                             | none                                        | New                                                                                     |
| `layout/SiteHeader.astro` + `scripts/nav.ts`                                                                                    | `JfdHeader`                                 | Rebuild: CSS breakpoints, disclosure pattern, links always in the DOM                   |
| `layout/SiteFooter.astro`                                                                                                       | `JfdFooter` + inline home footer            | Preserve the design; data comes from `business.ts` and `services.ts`; duplicate removed |
| `layout/Wordmark.astro`                                                                                                         | CSS-triangle mark                           | Rebuild as inline SVG                                                                   |
| `layout/Breadcrumbs.astro`                                                                                                      | inline breadcrumb `nav`                     | Refactor: linked, with schema                                                           |
| `sections/PageHero.astro` (slot for side panel)                                                                                 | hero section of every page                  | Refactor                                                                                |
| `records/JobSheet.astro`, `QuoteSheet.astro`, `ProgrammeView.astro`, `BacklogHandoff.astro`, `FileStack.astro`                  | inline record mock-ups                      | Refactor into semantic tables and lists, keeping the "Illustrative" caption             |
| `sections/ProofStrip.astro`                                                                                                     | `JfdProofStrip` + home credibility block    | Refactor (props: `stats`)                                                               |
| `sections/NumberedRows.astro`                                                                                                   | home problems, reasons rows                 | Refactor                                                                                |
| `sections/PrincipleBand.astro`                                                                                                  | home dark "We keep fire door safety simple" | Refactor                                                                                |
| `sections/ProcessLedger.astro`                                                                                                  | home Decide/Deliver/Close (`ledger`)        | Refactor; the `rail` variant is removed                                                 |
| `sections/SituationGrid.astro`                                                                                                  | home "Where can we take some weight off"    | Refactor                                                                                |
| `sections/ServiceCards.astro`                                                                                                   | home services grid                          | Refactor, data from `services.ts`                                                       |
| `sections/FeaturedProject.astro`, `ProjectCard.astro`                                                                           | home projects block                         | Refactor, data from the projects collection                                             |
| `sections/DecisionTriad.astro`                                                                                                  | `JfdDecision`                               | Refactor                                                                                |
| `sections/EvidenceBlock.astro`                                                                                                  | `JfdEvidence`                               | Refactor                                                                                |
| `sections/WhyJfd.astro`                                                                                                         | `JfdWhy` + home "Why"                       | Refactor                                                                                |
| `sections/FaqList.astro`                                                                                                        | `JfdFaq`                                    | Rebuild with `<details>`                                                                |
| `sections/FinalCta.astro`                                                                                                       | `JfdFinalCta` + home contact band           | Refactor                                                                                |
| `sections/CaseStudy.astro`                                                                                                      | `JfdCaseStudy`                              | Refactor, driven by the collection entry                                                |
| `sections/RelatedServices.astro`                                                                                                | "If the list points somewhere else"         | Refactor                                                                                |
| `forms/ContactForm.astro`, `forms/QuoteForm.astro`, `Field.astro`, `FileField.astro`, `ErrorSummary.astro` + `scripts/forms.ts` | Contact and Quote logic                     | Rebuild. Copy, validation messages and success states are kept                          |
| `ui/Img.astro`                                                                                                                  | `<img>` everywhere                          | New wrapper around `<Picture>`                                                          |
| Button and link styles                                                                                                          | `.jfd-btn*`, `.jfd-link*`                   | Preserve as global classes, not components                                              |

---

## 9. Lead generation: form architecture

**Flow.** Uploads go to R2 by streaming through a function. Files never pass through email, and nothing is buffered in the function's memory.

```
<form method="post" action="/api/enquiry">       (fields + honeypot + ts + route; Turnstile widget)

JS path (normal case)
 1. User submits → forms.ts validates fields in the browser (shared rules)
 2. POST /api/upload-session  {turnstileToken, fileCount}
      → verify Turnstile (siteverify) → return signed session token
        (HMAC-SHA256 with FILE_LINK_SECRET; payload: sessionId, maxFiles ≤ 10, exp = now + 30 min)
      (sent even with no files, so every JS submission is Turnstile-verified exactly once)
 3. For each file: PUT /api/upload?session=…  (headers: X-Filename, Content-Type, Content-Length)
      → XHR progress drives the prototype's per-file progress bar → returns {key}
 4. POST /api/enquiry  (JSON: fields, route, session token, file keys)
      → 200 {ok:true} → in-page success receipt

No-JS path
 POST /api/enquiry (urlencoded fields only; no files, no Turnstile)
      → honeypot + timing + WAF rate limit → 303 to the thanks page
      → email subject marked "[no-JS]" so JFD can watch for spam
```

**`functions/api/upload-session.ts`:**

- `POST` only; JSON body of 2 KB or less.
- Verify Turnstile with `TURNSTILE_SECRET_KEY` and the client IP.
- Return `{ token }`, signed as above.

**`functions/api/upload.ts`:**

1. Verify the session token: signature valid, not expired, and file count not over `maxFiles` (the count is tracked by listing `uploads/{sessionId}/`).
2. Check the file:
   - `Content-Length` of `UPLOAD_MAX_FILE_MB` (50 MB) or less; otherwise 413.
   - Allowed types: PDF, XLS, XLSX, CSV, DOC, DOCX, JPG, PNG, HEIC. Both extension and MIME type are checked.
   - Filename sanitised to ASCII kebab-case, 100 characters maximum.
3. Stream the body to R2:
   - `env.UPLOADS.put('uploads/{yyyy-mm}/{sessionId}/{uuid}-{name}', request.body, { httpMetadata: { contentType }, customMetadata: { originalName, sessionId } })`
   - Wrap the body in `FixedLengthStream`, so R2 receives the length and memory stays flat.
4. Return `{ key, name, size }`.

**`functions/api/enquiry.ts`:**

1. Accept JSON (JS path) or `application/x-www-form-urlencoded` (no-JS path). Anything else, or a body over 64 KB, is rejected.
2. If the honeypot is filled, or the form was submitted less than 3 s after render, return a fake success and send nothing.
3. **JS path:** verify the session token. Each file key must start with `uploads/*/{sessionId}/` and exist (`UPLOADS.head`).
4. Validate with `src/lib/enquiry/validate.ts`. This module is shared with `forms.ts`, so both sides give the same messages.
   - Name is required.
   - At least one of email or phone is required. Route e has a single combined contact field.
   - Email format is checked.
   - Length caps on every field.
   - Only fields for the chosen route are accepted.
5. For each file, build a signed download link: `https://{domain}/files/{key}?exp={unix}&sig={HMAC(key+exp)}`, with `exp = now + FILE_LINK_TTL_DAYS` (30 days).
6. Build a **plain-text** email, so no HTML injection is possible:
   - subject: `[JFD enquiry] {route title} — {org || name}`
   - body: labelled fields, submission time, page URL
   - files: name, size and link for each, plus a line saying when the links expire and when the files are deleted
   - `From`: `forms@{domain}`, the verified sending domain
   - `To`: `FORM_TO_EMAIL`
   - `Reply-To`: the enquirer's email, if valid
7. Send through the Resend API using `RESEND_API_KEY`. Never log personal data.
8. Respond:
   - JSON `{ok:true}` for JS requests, or a 303 to the thanks page.
   - On a provider failure: a 502 with a friendly message showing the phone number and email address, matching the prototype's "If the form isn't working, call or email us directly." The uploaded files stay in R2 until the lifecycle rule removes them.

**`functions/files/[[key]].ts` (download):**

1. `GET` only. Check `exp` has not passed and that the signature matches, using a constant-time comparison. Otherwise return 403.
2. Stream the object from R2 with these headers:
   - `Content-Disposition: attachment; filename="{originalName}"`
   - `Content-Type` as stored
   - `X-Content-Type-Options: nosniff`
   - `Cache-Control: private, no-store`
   - `X-Robots-Tag: noindex`
3. **Recommended hardening:** put a Cloudflare Access policy on `/files/*` that lets in only JFD staff email addresses (one-time email code; free for up to 50 users). This is configuration only, with no code. A forwarded link alone then can't open a client's building survey.

**R2 bucket configuration:**

- Private. No custom domain and no `r2.dev` public URL.
- Lifecycle rule: delete objects under `uploads/` after **90 days**. This also clears uploads from sessions that were abandoned. JFD saves any files it needs into its own systems within that time.
- Separate buckets for Preview (`jfd-enquiry-uploads-preview`) and Production.

**Shared server code** lives in `src/lib/server/` and is imported by the functions:

- `hmac.ts`: sign and verify session tokens and links; constant-time comparison
- `turnstile.ts`
- `files.ts`: type allowlist, filename sanitising, key format
- `email.ts`: build the plain-text body; Resend call

**Bindings, secrets and settings.** All are set in Cloudflare, separately for Preview and Production. Preview sends to a test inbox.

- R2 binding: `UPLOADS`
- `FORM_TO_EMAIL`
- `FORM_FROM_EMAIL`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `PUBLIC_TURNSTILE_SITE_KEY`
- `FILE_LINK_SECRET` (32 random bytes)
- `FILE_LINK_TTL_DAYS=30`
- `UPLOAD_MAX_FILE_MB=50`
- `UPLOAD_MAX_FILES=10`
- `PUBLIC_SITE_URL`

**Data protection.** Uploaded documents are held in R2 (EU jurisdiction bucket if JFD prefers) for 90 days, then deleted automatically. The privacy page states this retention and names the processors: Cloudflare (hosting and storage), Resend (email) and the analytics provider.

**Tests:**

- `node:test` unit tests for `validate.ts`, `hmac.ts` (valid, tampered and expired tokens and links) and `files.ts` (allowlist, sanitising).
- Manual end-to-end tests on the preview deploy (see QA).

---

## 10. Analytics

- **Recommended: Plausible.** It uses no cookies, so no consent banner is needed under PECR, and it supports custom events. The alternatives are in Decision 6.
- **Nothing is added until approved.** The build ships a provider-agnostic `track.ts` that reads `data-track` attributes.
- **Events:**

  | Event                  | Properties                      |
  | ---------------------- | ------------------------------- |
  | `cta_click`            | label, location                 |
  | `tel_click`            | –                               |
  | `mailto_click`         | –                               |
  | `quote_route_selected` | route                           |
  | `form_submit_success`  | form, route                     |
  | `form_submit_error`    | form, type (validation, server) |

- The success event fires on the JS success state and on the `noindex` thanks pages, so it's counted once either way.
- Verify Google Search Console and Bing Webmaster Tools through DNS.

---

## 11. Security

**`public/_headers`, applied to all pages:**

| Header                       | Value                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains` (add preload later, once confirmed)          |
| `Content-Security-Policy`    | see below                                                                          |
| `X-Content-Type-Options`     | `nosniff`                                                                          |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                  |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                                      |
| `X-Frame-Options`            | `DENY`                                                                             |

Content-Security-Policy:

```
default-src 'self';
script-src 'self' 'sha256-{no-js swap}' https://challenges.cloudflare.com {analytics};
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self' {analytics};
frame-src https://challenges.cloudflare.com;
form-action 'self';
base-uri 'self';
frame-ancestors 'none';
object-src 'none'
```

`'unsafe-inline'` is allowed for styles only. It's low risk and covers Astro's scoped styles and `object-position` style attributes. Scripts stay hash-only.

**Other controls:**

- **Functions:**
  - size limits and a file-type allowlist
  - Turnstile check, then HMAC-signed short-lived upload sessions
  - honeypot
  - plain-text email
  - no secrets in client code and no personal data in logs
- **R2:**
  - private bucket with no public URL
  - downloads only through HMAC-signed expiring links, served as `attachment` with `nosniff`
  - optional Cloudflare Access on `/files/*` for staff only
  - 90-day lifecycle deletion
- **WAF:** rate-limit rules on `/api/enquiry` and `/api/upload-session` (e.g. 5 requests per 10 minutes per IP), and a looser rule on `/api/upload` (e.g. 30 requests per 10 minutes).
- **Dependencies:**
  - Dependabot runs monthly with grouped updates.
  - `npm ci` uses the lockfile.
  - Node LTS is pinned in `.nvmrc`.
  - New dependencies need a stated requirement; runtime dependencies stay at zero.
- **Email domain:** SPF, DKIM and DMARC records for the sending domain.

---

## 12. Project structure

```
just-fire-doors/
├─ astro.config.mjs          # site, trailingSlash:'always', build.format:'directory', sitemap
├─ package.json              # scripts: dev, build, preview, check, test, format, lint:html, ci
├─ tsconfig.json  .nvmrc  .prettierrc  .env.example  CONTENT-TODO.md  README.md
├─ .github/
│  ├─ dependabot.yml
│  └─ workflows/ci.yml       # check → test → build → html-validate → links → pa11y-ci → lhci
├─ functions/                # the only server-side code (Cloudflare Pages Functions)
│  ├─ api/upload-session.ts  # Turnstile → signed upload session
│  ├─ api/upload.ts          # stream one file to R2
│  ├─ api/enquiry.ts         # validate + email with signed links
│  └─ files/[[key]].ts       # signed, expiring download from R2
├─ wrangler.toml             # R2 binding (UPLOADS) for local dev with `wrangler pages dev`
├─ public/
│  ├─ _headers  _redirects
│  ├─ fonts/*.woff2          # 8 Latin-subset files
│  └─ favicon.svg  favicon.ico  apple-touch-icon.png
├─ src/
│  ├─ assets/images/{site,services,projects,logos,evidence}/   # originals, processed at build
│  ├─ components/
│  │  ├─ layout/   SiteHeader, SiteFooter, Wordmark, Breadcrumbs, SkipLink
│  │  ├─ seo/      Seo, JsonLd
│  │  ├─ sections/ PageHero, ProofStrip, NumberedRows, PrincipleBand, ProcessLedger, SituationGrid,
│  │  │            ServiceCards, FeaturedProject, ProjectCard, DecisionTriad, EvidenceBlock,
│  │  │            WhyJfd, FaqList, FinalCta, CaseStudy, RelatedServices
│  │  ├─ records/  JobSheet, QuoteSheet, ProgrammeView, BacklogHandoff, FileStack
│  │  ├─ forms/    ContactForm, QuoteForm, Field, FileField, ErrorSummary
│  │  └─ ui/       Img, StatusDot, Chip
│  ├─ content/
│  │  ├─ projects/*.md
│  │  └─ faqs/*.yaml
│  ├─ content.config.ts      # Zod schemas for projects, faqs
│  ├─ data/                  # business.ts, services.ts, navigation.ts
│  ├─ lib/
│  │  ├─ schema.ts  seo.ts
│  │  ├─ enquiry/  fields.ts  validate.ts   # shared by forms.ts and functions/api/enquiry.ts
│  │  └─ server/   hmac.ts  turnstile.ts  files.ts  email.ts   # imported by functions only
│  ├─ layouts/BaseLayout.astro
│  ├─ pages/
│  │  ├─ index.astro  about.astro  privacy.astro  404.astro  robots.txt.ts
│  │  ├─ services/  index.astro  fire-door-remedial-works.astro  fire-door-inspections.astro
│  │  │             fire-door-maintenance.astro  fire-door-installation.astro
│  │  ├─ projects/  index.astro  [slug].astro
│  │  ├─ contact/   index.astro  thanks.astro
│  │  └─ get-a-quote/ index.astro  thanks.astro
│  ├─ scripts/  nav.ts  forms.ts  track.ts
│  └─ styles/   tokens.css (verbatim from DS)  fonts.css  base.css (from jfd.css)
└─ tests/ validate.test.ts  hmac.test.ts  files.test.ts
```

**Commands:**

| Command                   | What it does                                                                 |
| ------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`             | Local development server                                                     |
| `npm run build`           | Build to `dist/`                                                             |
| `npm run preview`         | Serve the built site locally                                                 |
| `wrangler pages dev dist` | Test the function locally (Wrangler used through `npx`, not as a dependency) |

**Deploys:** GitHub `main` → Cloudflare production. Every PR and branch gets a preview URL.

---

## 13. Migration summary: preserve, refactor, rebuild, optimise, remove

| Status       | Items                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Preserve** | Design tokens (colours, type, layout, effects) verbatim; all copy and section order; alt text and image crops; button and link classes; status vocabulary; Decide → Deliver → Close narrative; form fields, validation messages, error-summary and success patterns; footer design                                                                                                                                        |
| **Refactor** | `jfd.css` into base CSS plus scoped styles; ProofStrip, Decision, Evidence, Why, FinalCta and CaseStudy into Astro components with the same props; breadcrumbs (linked, with schema); illustrative records into semantic tables; section `aria-label` to `aria-labelledby`; `.dc.html` links to clean URLs; `#route-a…e` to named hashes                                                                                  |
| **Rebuild**  | Header and nav (CSS breakpoints, disclosure); FAQ (`<details>`); both forms (native controls plus server functions); file uploads (streamed to R2 with real progress, replacing the simulated progress); quote router (native radios plus `:has()`); wordmark (SVG); page shell and SEO head                                                                                                                              |
| **Optimise** | Images (AVIF/WebP, `srcset`, crops, sRGB logos, EXIF stripped); fonts (self-hosted Latin subset, 8 files, 2 preloaded); CSS (unused rules dropped)                                                                                                                                                                                                                                                                        |
| **Remove**   | Claude Design runtime and `support.js`; React and ReactDOM from unpkg; bundler loader; Google Fonts `@import` and non-Latin subsets; JS width detection; home variant switches (`ledger` hero, `rail` process); every "To confirm" note and `showNotes`; placeholder phone, email, hours and founder text (replaced with confirmed data or the section left out); duplicate inline footer; `#top` Privacy and Terms links |

---

## 14. QA and testing plan

**Automated (CI on every PR, and repeated against the preview URL):**

- `astro check` (types)
- `node --test` (validator)
- `astro build`
- `html-validate` on `dist/`: duplicate IDs, invalid nesting, a single H1
- Link check with lychee against `dist/`
- `pa11y-ci` (axe, WCAG 2 AA) on every URL in the sitemap
- Lighthouse CI on the mobile preset for home, remedial works, projects/{one}, contact and get-a-quote, failing the build if it misses the budgets in section 6

**Manual checks per template (home, service, project, about, contact, quote):**

- **Functional:**
  - Every link and CTA.
  - Nav disclosure: mouse, keyboard and Escape.
  - Mobile menu.
  - FAQ open and close.
  - Quote route selection, with and without JS, including the hash deep links.
  - `tel:` and `mailto:` links.
  - The 404 page.
- **Forms, on the preview deploy with a test inbox:**
  - every route, with and without files
  - an oversized file and a disallowed file type
  - missing name, and missing both contact methods
  - honeypot filled
  - Turnstile failure
  - JS off (303 and error page; files note shown)
  - a simulated provider failure
  - confirm the email arrives with working download links and the right `Reply-To`
- **Uploads and R2, on the preview deploy:**
  - a 49 MB file succeeds with visible progress; a 51 MB file is rejected with "Too large"
  - an 11th file is rejected
  - a disallowed file type is rejected
  - upload with no session, an expired session or a tampered session → 401 or 403
  - a file key from a different session passed to `/api/enquiry` → rejected
  - download link works and saves with the original filename; tampered `sig` or passed `exp` → 403
  - Cloudflare Access prompt appears on `/files/*` if enabled
  - bucket has no public URL, and the 90-day lifecycle rule is present
  - memory stays flat on a 50 MB upload (check function logs for errors)
  - iOS Safari: photo-library upload (HEIC) and upload of a Files-app PDF
- **Responsive:** 320, 375, 414, 768, 1024, 1280, 1440 and 1920 px. Zoom to 200% and 400% (reflow at 320 CSS px). No horizontal scroll.
- **Browsers:** Chrome, Firefox and Safari on macOS; iOS Safari; Android Chrome, on real devices or BrowserStack.
- **Accessibility:**
  - keyboard-only pass
  - VoiceOver on macOS and iOS, and NVDA with Firefox, on nav, FAQ and both forms
  - forced-colours mode
  - `prefers-reduced-motion`
  - contrast spot-checks on the mono labels and dark and action sections
- **SEO:**
  - Crawl with Screaming Frog: titles, descriptions, H1s, canonicals, status codes, `noindex` on thanks pages, sitemap contents, redirects.
  - Rich Results Test and the Schema.org validator on each template.
  - Check `robots.txt`.
  - Confirm preview hosts are `noindex`.
- **Performance:** WebPageTest from London (Moto G, 4G) on the key templates. Confirm the LCP element and that fonts don't cause layout shift.
- **Visual parity:** screenshots of the prototype and the build side by side at 390 px and 1280 px for each page. Any deliberate differences are listed (see the "Flagged visual changes" table).
- **Content sign-off:** `CONTENT-TODO.md` is empty. No placeholder phone numbers, `[brackets]` or "To confirm" text anywhere in `dist/` (checked by a `grep` step in CI).

**After launch:**

- Submit the sitemap to Google Search Console and Bing.
- Check that old-site 301s resolve.
- Review GSC coverage and Core Web Vitals at 4 weeks.

---

## Flagged visual and UX changes

These are the only deliberate changes, and all of them need sign-off:

1. **Projects:** the prototype's single long page becomes an index with cards, plus one page per project that uses the unchanged case-study layout (Decision 7).
2. **New pages** in the existing visual language: a small `/services/` hub and a `/privacy/` page.
3. **Focus rings** turn white or azure on dark and action-blue sections.
4. **FAQ disclosure icon** is drawn with a `<details>` marker styled to match; the look is the same.
5. **Quote file field:** the drop zone keeps its look and its progress bars, which now show real upload progress, and gains a visible "Choose files" native control. Without JS, a short note asks people to email their documents instead.
6. **Visible placeholders are removed:** "To confirm" notes, the pending credential and stat tiles, and the founder and team bracketed text. Those sections are hidden until real content arrives, or shown with only the confirmed items.
7. **Logo (step 6):** the header and footer use the client's supplied logo (outlined door, lettering, "SW" on its own line) in place of the prototype's typeset Barlow Condensed wordmark. The footprint matches the prototype's, about 195 px wide in the header. On light backgrounds, "SW" is graphite instead of white.
8. **Services menu (step 6):** an "All services" link to the new `/services/` hub is added at the bottom of the desktop and mobile service lists.
9. **Letter-spacing (step 7):** the prototype's inline styles wrote letter-spacing as quoted strings, and the Claude Design runtime dropped them. The approved render therefore has no tracking on inline-styled text: hero eyebrows, H1s, record tables, breadcrumbs, section titles and mono labels. Design-system classes (`.jfd-eyebrow`, `.jfd-h2`, chips, status labels, footer labels) do keep their tracking. Production matches the render exactly. The alternative is to apply the design system's intended tracking everywhere.
10. **Process ledger (step 7):** a markup error in the prototype's home page closes the container early, so the Decide/Deliver/Close rows run edge to edge with no gutter. Production keeps them inside the 1240 px container. The section is about 50 px taller at 1280 px because the columns are narrower.
11. **Project pages (step 8, Decision 7 recommended option):** each case study has its own page at `/projects/{slug}/` with the case-study layout unchanged and the project name as H1. The `/projects/` index keeps the prototype's hero, "how to read" section, featured cards and closing section. The cards link to the project pages ("View project →" instead of "View project ↓").
12. **New and trimmed pages (step 8):** `/services/` hub (capability map and service cards; hero lead is new copy awaiting approval), `/privacy/` (draft), and `/404`. On `/about/`, the team section, placeholder stats, testimonials and pending credentials are left out until supplied.
13. **Accessibility adjustments (step 8):** three small labels on action blue are now solid white, because the prototype's pale blue and translucent white measured 4.03–4.33:1 against the 4.5:1 AA minimum. On project pages the stage headings are H2 (they were H3), for heading order.
14. **Links to projects without pages (step 8):** home-page cards for Weston-super-Mare and the Davey Building read "See all projects →" and link to `/projects/` until their case studies exist (Decision 3). The installation page's Mammography Unit block links to its project page ("See the project →").

15. **Forms (step 9):**
    - Contact details that are not yet confirmed (phone, email, office hours) are left out of the contact page, the quote side panel and the success states. The contact page's left column shows only "Based in Plymouth" until they are supplied.
    - The upload box keeps the prototype's look. "or choose files" is the label of a native file input (focusable, opens the picker with Enter or Space) rather than a separate visible browser button.
    - Chosen files show "Ready" straight away. The progress bar fills with real upload progress when the form is sent, then shows "Uploaded". Files that are too large, the wrong type or over the 10-file limit are marked in red and not sent.
    - Each quote route is its own form, shown one at a time. "Before you send" beside the form is unchanged.
    - New states with new wording: "Sending…" on the button, a could-not-send message, and the no-JavaScript upload note (listed in `CONTENT-TODO.md`).
    - Turnstile uses "interaction-only" appearance, so nothing extra shows unless Cloudflare needs the visitor to do something.
    - Not yet compared pixel-for-pixel against the prototype render (checked by eye against the prototype markup values); do this in QA (step 16).
16. **Analytics consent (step 12, Decision 6 = GA4):** a consent banner is added: a graphite bar fixed to the bottom of the page with two buttons of the same size and style, shown until the visitor chooses. A "Cookie settings" link in the footer's legal row reopens it. Both appear only on builds with a measurement ID; without one the site is unchanged. The privacy page's cookie section changes to describe Google Analytics on those builds.

**Analytics notes (step 12).** Decision 6 was made on 2026-10-02: **Google Analytics 4**, in place of the recommended Plausible.

- The measurement ID is the build-time variable `PUBLIC_GA_MEASUREMENT_ID` (set per environment in Cloudflare; leave it unset on Preview to keep test traffic out). With no ID, no analytics code, banner or cookie wording ships.
- Three states, stored in `localStorage`:
  - **No choice yet:** cookie-free measurement. GA4 loads in Consent Mode with analytics storage denied, so page views and events are sent with no cookies and no stored identifier (Google regenerates a random ID on each page). GA4 can count hits and events, but not users, sessions, returning visits or journeys.
  - **"Accept cookies":** full GA4 measurement with cookies.
  - **"Switch off":** nothing is sent to Google and any GA cookies are removed.
- `PUBLIC_GA_BEFORE_CONSENT=off` turns the cookie-free state off, so nothing loads from Google until the visitor accepts. The banner and privacy wording follow the setting.
- **Legal position to confirm before launch:** whether cookie-free pings to Google need consent under UK rules is a legal judgement for JFD, not a technical fact. They still send the visitor's IP address and browser details to Google. If JFD or its adviser isn't comfortable, set `PUBLIC_GA_BEFORE_CONSENT=off`.
- Advertising consent signals are always "denied".
- `track.ts` is about 1 KB gzipped. Instead of `data-track` attributes on every CTA, it recognises `tel:` and `mailto:` links and links styled as buttons (`a.jfd-btn`); `data-track="cta"` marks anything else. Events are those in section 10, with `location` taken from the header, footer or section.
- The CSP allows `*.googletagmanager.com`, `*.google-analytics.com` and `*.analytics.google.com` (section 11's `{analytics}` slots).
- In GA4 itself: leave Google Signals and ads personalisation off, set data retention as JFD prefers, and register `label`, `location`, `route`, `form` and `type` as custom dimensions to report on them. How much of the cookie-free data appears in reports depends on Google's handling of consent-denied hits.

**CI notes (step 13).** Departures from sections 6 and 14:

- **Link check:** `scripts/check-dist.mjs` replaces lychee. It checks every internal link, asset and in-page anchor in `dist/`, the placeholder text, and the per-page JS (10 KB) and CSS (20 KB) gzipped budgets, with no extra tool to install. External links (only `ico.org.uk` at present) are not fetched.
- **Accessibility:** `scripts/a11y.mjs` wraps pa11y-ci, which can't itself separate axe's "needs review" results from confirmed violations. Review items are listed in the log for the manual pass.
- **Stylesheets are inlined** (`build.inlineStylesheets: 'always'`, not `'auto'`). With separate files each page had 4–11 render-blocking CSS requests and simulated LCP was 2.0–2.3 s; inlined, pages carry 5–10 KB of gzipped CSS in the HTML and the home page measures 1.4 s.
- **LCP gate:** CI fails above 2.5 s, not 1.8 s. Against the local HTTP/1.1 preview server, Lighthouse's simulated slow-4G run gives 1.4–2.2 s (performance score 99–100). The 1.8 s target stays, and is measured on the Cloudflare deploy in step 16 (WebPageTest, as section 14 says).
- **Form pages:** pa11y and Lighthouse load each page once, so the quote route forms and success states (hidden until chosen) are covered by the manual accessibility pass, not CI.
- The workflow has not run on GitHub yet: the repository has no remote.

**Server notes (step 10).** Small departures from section 9, none visible on the site:

- Storage keys are `uploads/{yyyy-mm}/{sessionId}/{uuid}-{name}`, with the month fixed in the session token so a session's files stay in one folder.
- A session can send one enquiry: a `uploads/{yyyy-mm}/{sessionId}.sent` marker is written after the email goes, and a second enquiry on the same session gets 401. The lifecycle rule removes the marker with the files.
- The minimum fill time is only checked when the browser script supplied a timestamp. Plain form posts have none, so they rely on the honeypot and the WAF rate limit.
- Download links use the host the enquiry was sent to, so Preview links point at the Preview deployment and bucket.
- `/api/enquiry` refuses posts whose `Origin` is another site.
- The no-JavaScript error pages don't show a phone number or email: the functions can't read `business.ts`, and those facts aren't confirmed yet.
- `RESEND_API_URL` is an optional setting for local testing against a mock endpoint. It must not be set in Cloudflare.

---

## A. Recommended architecture

Build a **static Astro site** that ships no framework JavaScript. Use the prototype's design tokens and `jfd.css` class library unchanged, as plain CSS. Build it from about 25 small Astro components, with typed data files for business facts and services, and content collections for projects and FAQs. JavaScript is limited to three progressive-enhancement modules: nav, forms and tracking, totalling about 6 KB.

Deploy it to **Cloudflare Pages**:

- A small set of **Pages Functions** handles both forms, with server-side validation, honeypot and Turnstile-gated upload sessions.
- Survey and job-sheet files **stream into a private Cloudflare R2 bucket**: up to 50 MB per file, with real progress, deleted after 90 days.
- JFD receives a plain-text Resend email with **signed, expiring download links**, optionally behind Cloudflare Access.
- Secrets and bindings are held only in Cloudflare.
- Security headers go in `_headers`; redirects go in `_redirects` and Cloudflare rules.
- Canonical URL is the apex domain, HTTPS, with trailing slashes.

JSON-LD comes from one business-facts file and only ever outputs confirmed facts. Analytics is cookieless and event-based, added only after approval.

## B. Decisions required before build

1. **Business facts to publish.** Confirm:
   - phone number, enquiry email and office hours
   - legal company name, company number and registered office. UK company websites must display these, and the footer currently says "Just Fire Doors South West Ltd".
   - whether to publish a street address. If yes, the site uses `LocalBusiness`; if no, the Google Business Profile is set up as a service-area business.
   - the service area wording. The prototype says "Plymouth, Devon, Cornwall and wider South West", marked "to confirm". The projects also include Weston-super-Mare in North Somerset.
2. **Credentials and permissions.** Confirm:
   - the BlueSky Certified Installer FDI-146 wording, and permission to use the logo
   - use of the DDS logo
   - use of the **University of Plymouth logo**
   - permission to name the clients and partners: Plymouth Mammography Unit, Tor Bridge High, Mercury Construction, Stoke Damerel Community College, Obedair, Davey Building, Weston-super-Mare schools, Penryn College, Bodmin Hospital and Exmouth. The NHS project slot stays hidden until approved.
3. **Missing content.** Supply the case-study copy for **Weston-super-Mare** and the **Davey Building**, which the home page features but `/projects/` doesn't include, or accept that the home cards link only to existing projects. Also decide on the About page founder and team section: supply the text and photo, or omit the section at launch. Omitting it is recommended.
4. **Domain and accounts.**
   - Which is the primary domain? `justfiredoors.co.uk` is inferred from the placeholder email. **Answered in step 14:** `justfiredoorssw.com`, apex, DNS on Cloudflare (registration stays at Squarespace). The domain only served a Squarespace "Coming Soon" page, so there are no old-site URLs to redirect.
   - Apex or `www`? Apex is recommended.
   - Who controls the registrar and DNS? Moving DNS to Cloudflare is recommended.
   - Is there a current website? If so, list its URLs so they can be 301-redirected.
   - Which inbox should receive enquiries, and who owns the Cloudflare, GitHub and Resend accounts?
5. **Upload retention and access.** Cloudflare R2 has been chosen for uploads. Confirm the defaults:
   - files deleted after **90 days**
   - download links expire after **30 days**
   - limits of 50 MB per file and 10 files per enquiry
   - whether to enable Cloudflare Access on downloads (recommended), and if so, which staff email addresses
   - whether the bucket should use EU jurisdiction
6. **Analytics.** Choose one:
   - **Plausible** (recommended): about £9/month, cookieless, custom events.
   - **Cloudflare Web Analytics**: free, but no event tracking.
   - **GA4**: free, but needs a cookie consent banner.
7. **Projects and URL naming.** Individual project pages at `/projects/{slug}/` are recommended; the alternative is the prototype's single long page. Also confirm the `/projects/` and `/about/` slugs, which match the nav labels; the alternatives are `/case-studies/` and `/why-jfd/`.
8. **Illustrative mock-ups.** The sample job sheet, the quote with £ prices, and the programme and backlog views could:
   - stay at launch with the "Illustrative" caption (recommended), or
   - be replaced with real anonymised JFD documents, or
   - keep the layout with the £ amounts removed.

## C. Implementation sequence

1. **Repository and scaffold.**
   - Create the GitHub repo in the working directory and set `.nvmrc` to Node 22 LTS.
   - Run `npm create astro@latest` with the minimal template and strict TypeScript.
   - Add `@astrojs/sitemap`, `sharp`, `@astrojs/check`, `typescript`, `prettier`, `prettier-plugin-astro`, `html-validate`, `@lhci/cli` and `pa11y-ci`.
   - Set up `astro.config.mjs` (`site`, `trailingSlash: 'always'`, `build.format: 'directory'`, sitemap filter), the npm scripts from section 12, `.env.example` and `README.md`.
2. **Extract the prototype assets.**
   - Export the Claude Design project `4fbcea84-33e9-4f66-8c10-d5aead95e0f4`. Either run `/design-login` interactively and read it with DesignSync, or unpack the bundled HTML: base64-decode each `__bundler/manifest` entry, gunzip it when `compressed` is true, and name it using `__bundler/ext_resources`.
   - Save the photos to `src/assets/images/**` with descriptive kebab-case names, e.g. `bodmin-installer.jpeg`, `weston-doorsets.jpeg`.
   - Convert the logos to sRGB, or get SVG versions.
   - Copy the design-system token CSS and `jfd.css`.
3. **Styles.**
   - Put the tokens, unchanged, in `src/styles/tokens.css`, and add `--focus-ring` and `--focus-ring-on-dark`.
   - Write `base.css` from `jfd.css`: add `lang`, the skip link, `scroll-padding-top`, smooth scroll under reduced motion, and focus tokens; remove unused rules.
   - Write `fonts.css`: eight self-hosted Latin WOFF2 files in `public/fonts/`, plus metric-adjusted fallbacks.
4. **Data layer.**
   - Write `business.ts` with confirmed facts only; unconfirmed fields are `null`.
   - Write `services.ts` and `navigation.ts`.
   - Write `content.config.ts` with the `projects` and `faqs` schemas.
   - Port the three existing case studies and five FAQ sets from the prototype's `renderVals` data, dropping the `note` fields and moving them to `CONTENT-TODO.md`.
5. **SEO layer.**
   - `BaseLayout` and `Seo.astro` with the props API in section 4.
   - `lib/schema.ts` builders: `organization`, `localBusiness` (only if an address exists), `website`, `service`, `breadcrumbList` and `faqPage`.
   - `robots.txt.ts`, and a default OG image at 1200×630.
6. **Global components.** `Wordmark` as SVG, plus the favicon set; `SiteHeader` with `nav.ts` and the no-JS class swap (hash recorded for the CSP); `SiteFooter`; `Breadcrumbs`; `SkipLink`; `Img`.
7. **Section and record components.** Build them in this order, checking each against the prototype at 390 px and 1280 px:
   1. `PageHero`
   2. `JobSheet` / `QuoteSheet` / `ProgrammeView` / `BacklogHandoff` / `FileStack`
   3. `ProofStrip`
   4. `NumberedRows`
   5. `PrincipleBand`
   6. `ProcessLedger`
   7. `SituationGrid`
   8. `ServiceCards`
   9. `FeaturedProject` / `ProjectCard`
   10. `DecisionTriad`
   11. `EvidenceBlock`
   12. `WhyJfd`
   13. `FaqList`
   14. `FinalCta`
   15. `CaseStudy`
   16. `RelatedServices`
8. **Pages.** Build the pages from the step 7 components. Use the temporary gallery (`src/pages/dev/components.astro`) as the reference, and **delete it (and its sitemap exclusion) once the pages are built**. Build in this order:
   1. `/`
   2. `/services/fire-door-remedial-works/`
   3. `/services/fire-door-inspections/`
   4. `/services/fire-door-maintenance/`
   5. `/services/fire-door-installation/`
   6. `/services/`
   7. `/projects/` and `/projects/[slug]/`
   8. `/about/`
   9. `/privacy/` (processors and retention; wording for JFD to approve)
   10. `/404`

   Each page gets its title, description, breadcrumbs and schema, and marks its LCP image as high priority where there is one.

9. **Forms, client side.**
   - `lib/enquiry/fields.ts` and `validate.ts`, plus `tests/validate.test.ts`.
   - `ContactForm` and `QuoteForm` markup: native controls, route radios with `:has()` visibility, honeypot, timestamp.
   - `forms.ts`:
     - hash preselect and inline validation
     - file list, with size and type checks before upload
     - the session → per-file XHR upload with progress → enquiry sequence from section 9
     - success and error states with focus management
     - Turnstile lazy-loading
     - the no-JS files note
   - `/contact/` and `/get-a-quote/` pages, plus the `noindex` thanks pages.
10. **Forms, server side.**
    - Write `src/lib/server/{hmac,turnstile,files,email}.ts`, with tests.
    - Write `functions/api/upload-session.ts`, `functions/api/upload.ts`, `functions/api/enquiry.ts` and `functions/files/[[key]].ts`, following section 9.
    - Add `wrangler.toml` with an `[[r2_buckets]]` binding named `UPLOADS`, pointing at a local or preview bucket.
    - Test locally with `npx wrangler pages dev dist`, using local R2 simulation, the Turnstile test keys and a Resend test inbox.
11. **Headers and redirects.**
    - `public/_headers`: security headers from section 11, cache rules from section 6, and `X-Robots-Tag: noindex` for the `pages.dev` preview host.
    - `public/_redirects`: aliases and old-site 301s.
12. **Analytics** (after Decision 6).
    - `track.ts` with `data-track` attributes on every CTA, `tel:` and `mailto:` link, and form events.
    - Add the provider's script and update the CSP.
13. **CI and maintenance.** Configure pa11y-ci so axe "incomplete" results (arrow glyphs, text over images) don't count as failures; check those by hand instead. Add `.github/workflows/ci.yml` with the steps in section 14, including the placeholder `grep`. Add `dependabot.yml` (npm and GitHub Actions, monthly, grouped).
14. **Cloudflare setup.**
    - Create a Pages project connected to the repo: build `npm run build`, output `dist`, Node version from `.nvmrc`.
    - Set environment variables and secrets separately for Preview and Production.
    - Create the R2 buckets `jfd-enquiry-uploads` and `jfd-enquiry-uploads-preview`:
      - private, with no custom domain and `r2.dev` access turned off
      - lifecycle rule deleting `uploads/` after 90 days
      - bound as `UPLOADS` in each environment
    - Create a Turnstile widget for the domain.
    - Add WAF rate-limit rules on `/api/enquiry`, `/api/upload-session` and `/api/upload`.
    - If Decision 5 approves it: add a Cloudflare Zero Trust Access application on `{domain}/files/*`, allowing only JFD staff emails with one-time email codes.
    - Add the custom domain, "Always Use HTTPS", and the `www` → apex redirect rule.
15. **Email domain.** Verify the sending domain in Resend (SPF, DKIM, DMARC). Send test enquiries with uploaded files to the production inbox. Confirm they land in the inbox, not spam, and that the download links work, including through Access if it's enabled.
16. **QA.** Run the full plan in section 14 on the preview URL. Fix any issues, then sign off visual parity and the flagged changes with JFD.
17. **Content sign-off.** Clear `CONTENT-TODO.md`. Every fact in `business.ts` is confirmed and no placeholders remain.
18. **Launch.**
    - Switch DNS and turn on HSTS.
    - Check the 301s.
    - Submit the sitemap to Google Search Console and Bing.
    - Point the Google Business Profile website link at the site.
    - Run a smoke test of both forms in production.
19. **Four weeks after launch.**
    - Review GSC coverage, queries and Core Web Vitals.
    - Plan phase-2 content only where there is real material behind it: more case studies, then `/locations/plymouth/` and sector pages once the rules in section 3 are met, and Insights articles.

---

## Verification (how to confirm the build meets this plan)

| Check                  | How                                                                                                                                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build, types and tests | `npm run check && npm test && npm run build`                                                                                                                                                                                                                            |
| HTML                   | `npx html-validate "dist/**/*.html"`                                                                                                                                                                                                                                    |
| Accessibility          | `npx pa11y-ci --sitemap http://localhost:4321/sitemap-index.xml`                                                                                                                                                                                                        |
| Performance budgets    | `npx lhci autorun`. Must meet the section 6 budgets.                                                                                                                                                                                                                    |
| Form, locally          | `npx wrangler pages dev dist`, then submit each quote route and the contact form with JS on and off. Upload files up to 50 MB and check they appear in local R2. Check the email's signed links download the right file, and that tampered or expired links return 403. |
| Preview deploy         | Headers checked with `curl -I` (CSP, HSTS, `nosniff`, `X-Robots-Tag` on `pages.dev`). The R2 upload and download checks in section 14 pass against the preview bucket.                                                                                                  |
| Structured data        | Rich Results Test on each template                                                                                                                                                                                                                                      |
| SEO crawl              | Screaming Frog crawl: no 4xx errors, a unique title and description on every page, one H1, self-referencing canonicals                                                                                                                                                  |
| Visual parity          | Side-by-side screenshots against the prototype at 390 px and 1280 px                                                                                                                                                                                                    |
| No placeholders        | `grep -rE "To confirm\|\[X\]\|01752 000 000\|\[Founder" dist/` returns nothing                                                                                                                                                                                          |
