# Content to do

Everything the site needs from Just Fire Doors before launch, collected from the prototype's "to confirm" notes and placeholders. Nothing on this list is published: unconfirmed facts are `null` in `src/data/business.ts` or left out of content.

When an item is done, update the data or content file and tick it here. **Launch is blocked until every "Launch blocker" is ticked** (plan section 14, content sign-off). Decision numbers refer to `docs/architecture-plan.md`, section B.

## Launch blockers

### Business facts (Decision 1), `src/data/business.ts`

- [x] Telephone number. The prototype placeholder is `01752 000 000`. ~~07456 506960~~ (2026-10-06). JFD asked for no phone number on the site, so `phone` is `null` and every phone element is hidden (2026-10-08)
- [x] Customer enquiry email. The prototype shows `hello@justfiredoors.co.uk`, marked "to confirm". **info@justfiredoorssw.com** (2026-10-08; was dec@justfiredoorssw.com, 2026-10-06)
- [x] Office hours. The prototype shows `[Confirmed office hours]`. **Mon–Fri, 8am–5pm** (2026-10-06)
- [x] Registered company name. The prototype footer says "Just Fire Doors South West Ltd". **Just Fire Doors SW Ltd** (2026-10-06)
- [x] Company number and registered office address. UK company websites must show these. **16088943**, 8 Murhill Lane, Plymouth PL9 7FN (2026-10-06)
- [x] Public trading address: yes or no. If no, the Google Business Profile is set up as a service-area business. **Yes**: Scott Rd, Plymouth PL2 2PQ (used in LocalBusiness schema) (2026-10-06)
- [x] Service area. The prototype proposes Plymouth, Devon, Cornwall and the wider South West, and this wording appears in page copy. Confirm it, then set `serviceArea.confirmed: true`. Confirmed as proposed (2026-10-06)
- [x] Google Business Profile and LinkedIn URLs, if they exist, for `sameAs`. No Google Business Profile yet. The LinkedIn link supplied is Declan Stamp's personal profile, so it is not used as the company's `sameAs` (2026-10-06)

### Credentials and permissions (Decision 2)

- [x] **BlueSky certificate FDI-146. The prototype notes it expired on 14/08/2026.** Supply the renewed certificate, or remove the BlueSky badge and claims before launch. JFD asked to keep the badge in place while the renewal comes through; update `verify` when it arrives (2026-10-06)
- [x] Confirm the BlueSky credential wording: "BlueSky Certified Installer — fire door installation & fire stopping of penetrations". Confirmed (2026-10-06)
- [x] Permission to use the BlueSky logo. Ask for an SVG version too. Granted (2026-10-06)
- [x] Permission to use the Door Data Systems logo. Only a 200 px version exists, so ask for an SVG. Granted (2026-10-06)
- [x] Permission to use the University of Plymouth logo. Granted (2026-10-06)
- [x] Permission to name each client or partner: Plymouth Mammography Unit, Tor Bridge High, Mercury Construction, Stoke Damerel Community College, Obedair, University of Plymouth (Davey Building), the Weston-super-Mare schools and education trust, Penryn College, Bodmin Hospital, Exmouth primary school, and "local council". Granted (2026-10-06)
- [x] University Hospitals Plymouth NHS Trust: stays hidden until approved. The prototype says "slot reserved, pending approval". Approved (2026-10-06). Nothing to show until there is project content for it

### Missing project copy (Decision 3)

- [x] **Weston-super-Mare schools (about 150 doors).** The home page features it, but there's no case study. Supply the case-study copy, or the home card links to `/projects/` only. Not needed: the home card keeps linking to `/projects/` (2026-10-06)
- [x] **University of Plymouth, Davey Building (about 35 doorsets).** Same as above. Not needed, as above (2026-10-06)

### Forms and privacy

- [x] Enquiry destination inbox (Decision 4). **dec@justfiredoorssw.com**, set as the `FORM_TO_EMAIL` secret in Cloudflare (2026-10-06)
- [x] Privacy notice wording approved by JFD, including processors (Cloudflare, Resend, analytics) and 90-day file retention (Decision 5). Approved (2026-10-06)
- [x] Upload limits and retention confirmed (Decision 5). Approved (2026-10-06)

### Brand

- [x] Original vector logo (SVG, AI or EPS) from the logo designer. The site currently uses a trace of the supplied JPEG (see `docs/brand/README.md`). Not needed: keep the trace (2026-10-06)

## Fact-check before publication

These answers are approved prototype copy and are in the content files, but the prototype flagged them for checking.

- [ ] **Inspections**, “How often should fire doors be inspected?”: regulatory answer to be fact-checked before publication
- [ ] **Inspections**, “Can JFD inspect multiple sites?”: wording / operating limits with JFD
- [ ] **Remedial works**, “What happens if further problems are found during the work?”: exact variation / approval process before publishing
- [ ] **Remedial works**, “What evidence do we receive after repairs are completed?”: exact evidence and handover format for the final page
- [ ] **Maintenance**, “How often should fire doors be maintained?”: regulatory wording to be fact-checked
- [ ] **Maintenance**, “Can fire doors be repaired during a maintenance visit?”: exact JFD operating process
- [ ] **Maintenance**, “Can JFD maintain fire doors across multiple sites?”: operating geography and multi-site capacity
- [ ] **Maintenance**, “What records do we receive after maintenance work?”: exact JFD output before publication
- [ ] **Installation**, “Can JFD supply as well as install replacement fire doors?”: exact product ranges and certification schemes for the final page copy
- [ ] **Installation**, “What documentation do we receive after installation?”: exact handover format and records before publication
- [ ] **Installation**, “What happens if additional issues are discovered during installation?”: exact JFD variation process
- [ ] **About (Why JFD)**, “What areas does JFD cover?”: precise operating area before publication
- [ ] **About (Why JFD)**, “Do you work across multiple sites?”: multi-site capacity
- [ ] **About (Why JFD)**, “What accreditations does JFD hold?”: full list of confirmed accreditations and plain-English explanations
- [ ] **About (Why JFD)**, “What records do we receive when work is complete?”: confirmed handover / app / certification detail
- [ ] **About (Why JFD)**, “What types of organisations does JFD work with?”: expand once sector / client evidence is confirmed

### Page copy flagged in the prototype

These apply when the pages are built in step 8.

- [ ] **Home**: the hero report panel is a placeholder ("anonymised JFD record to supply"). See Decision 8.
- [ ] **Inspections**: exact inspection methodology and terminology.
- [ ] **Inspections**: report fields, photographs, priority/status system and handover format.
- [ ] **Inspections**: multi-site programme management, reporting format, mobilisation capability.
- [ ] **Inspections**: pricing (starting price, minimum charge or typical band). Leave it out until JFD commits.
- [ ] **Remedial works**: quotation structure and decision process.
- [ ] **Remedial works**: component and retrofit capabilities.
- [ ] **Remedial works**: programme management, sequencing, progress reporting, QA checks, site responsibility, occupied-site working.
- [ ] **Remedial works**: evidence fields, photos, certification, QA process and handover format.
- [ ] **Maintenance**: service model and component capability.
- [ ] **Maintenance**: scheduling, reporting, approval and progress visibility.
- [ ] **Maintenance**: multi-site scheduling, reporting and regional mobilisation.
- [ ] **Maintenance**: records, photographic evidence, QA and handover format.
- [ ] **Installation**: supply capability, installer schemes, product certification, specialist doorset range.
- [ ] **Installation**: live-site working procedures, sequencing and disruption controls.
- [ ] **Installation**: programme, progress updates, project contact, quality checks, door-level sign-off.
- [ ] **Installation**: variations, approvals and unexpected opening conditions.
- [ ] **Installation**: handover documentation and evidence format; price bands if available.
- [ ] **About**: regional mobilisation, response capability, coverage, direct project contact.
- [ ] **About**: door-level fields, before/after evidence, QA, certification and handover process.
- [ ] **Contact**: preferred route for existing customers, or a named operational contact.
- [ ] **Get a quote**: response-time wording. Make no turnaround promises until JFD commits to a standard.
- [ ] **Get a quote**: exact review and follow-up process.
- [ ] **Get a quote**, optional: "Your documents go to the team reviewing the work, not a generic sales inbox." Use only if true.

### New or hedged copy to approve (step 8)

- [ ] **/services/ hub**, hero lead (new copy): “Inspection, repair, maintenance and replacement for estates and facilities teams across the South West, with clear evidence of what’s been completed.”
- [x] **/privacy/**: draft privacy notice. Needs JFD (and ideally legal) approval, plus company details in `business.ts`. It assumes 90-day upload retention and no analytics; update it if Decisions 5 or 6 change. Approved (2026-10-06)
- [ ] **Installation**, evidence list title (prototype copy): “Depending on JFD’s final confirmed process, the handover may include”. Simplify once the handover process is confirmed.
- [ ] **About, credentials footnote** and **remedial works FAQ** (prototype copy): “JFD’s current materials state that…”. Reword as a direct statement once confirmed.
- [ ] **Home**, Weston-super-Mare and Davey Building cards link to “See all projects →” until their case studies exist (Decision 3).

### New or adapted copy to approve (step 9, forms)

The prototype had no wording for these states, so they are new.

- [ ] **Both forms**, could-not-send message: “Sorry, we couldn’t send that just now. Everything you’ve typed is still here. Please try again.” Once a phone number or email is confirmed it adds “If it still isn’t working, call … or email ….”
- [ ] **Both forms**, submit button while sending: “Sending…”.
- [ ] **Both forms**, over-long answer: “Please shorten this to 200 characters or fewer.” (4000 for long answers).
- [ ] **Get a quote**, file statuses: “Ready”, “Uploading…”, “Uploaded”, “Failed”, “Too large” (prototype), “File type not accepted”, “Empty file”, “Too many files”.
- [ ] **Get a quote**, note shown in place of the upload box when JavaScript is off: “Send the form and we’ll arrange how to get your documents to us when we reply.” Once the email is confirmed it becomes the planned “Send the form, then email your documents to … and quote your name.”
- [ ] **Get a quote**, side panel: “Rather talk first? Contact JFD →” stands in for the phone number until it is confirmed.
- [ ] **Thanks pages** (`/contact/thanks/`, `/get-a-quote/thanks/`): page titles, descriptions and the “Send another message →” / “Send something else →” links. Body copy is the prototype’s success wording.
- [ ] **Contact**: the telephone, email and office-hours blocks, the “Call the team” photo label, “or call …” and “If the form isn’t working, call or email us directly.” are hidden until the phone and email are confirmed.
- [x] Confirm the accepted upload types: PDF, XLS, XLSX, CSV, DOC, DOCX, JPG, PNG, HEIC (Decision 5). Approved (2026-10-06)

### Analytics (Decision 6: Google Analytics 4, step 12)

- [ ] GA4 measurement ID (`G-XXXXXXXXXX`), set as `PUBLIC_GA_MEASUREMENT_ID` in Cloudflare for Production. Until then no analytics runs and no banner shows.
- [ ] **Confirm the cookie-free measurement is acceptable.** Before a visitor chooses, the site sends cookie-free Google Analytics pings. Whether that needs consent under UK rules is a legal judgement for JFD or its adviser. If in doubt, set `PUBLIC_GA_BEFORE_CONSENT=off` (nothing loads until accepted).
- [ ] Consent banner wording to approve: “Analytics cookies. We count visits with Google Analytics, without cookies. Accept analytics cookies to give us more detail, or switch analytics off.” Buttons: “Accept cookies”, “Switch off”. Footer link: “Cookie settings”.
- [ ] Privacy notice, “Cookies and analytics” section: draft Google Analytics wording (cookie names, two-year lifetime, processing by Google, possible transfer outside the UK). Needs JFD and ideally legal approval with the rest of the notice.
- [ ] Confirm GA4 settings: Google Signals and ads personalisation off; data retention period.

## Proof, stats and people

These appear in the prototype only as placeholders and are **not ported**. Add them only when supplied.

- [ ] Accreditation lines "Accreditation 2", surveyor qualification, and manufacturer/product training.
- [ ] Team experience in years; count of fire doors inspected, repaired or installed; count of completed projects.
- [ ] Testimonials: client name, role and organisation, with permission. Never marked up as reviews.
- [ ] About page team section: founder or director name, background, year founded, team size and roles, professional development, founder photo. The plan recommends leaving this section out at launch unless it's supplied.
- [ ] **Do not use the "100% success rate" claim** unless JFD can define and evidence it (prototype instruction).
- [ ] Confirm the claim "a high proportion of work comes from returning customers and referrals" (Why JFD). It is shown as fact in the prototype.

## Illustrative mock-ups (Decision 8)

These show as "Illustrative" until they're replaced with real, anonymised JFD documents, or approved to stay.

- [ ] Home hero report (JFD-1042)
- [ ] Remedial works quotation (Q-2291) and the Why JFD mini quote. £ prices removed at client feedback (2026-10-06)
- [ ] Remedial works, maintenance, installation and Why JFD programme / progress views
- [ ] Remedial works backlog handoff (214 open actions)
- [ ] Inspections report layout and door record

## Projects: pending details

Published case studies leave these out until they're supplied.

### Plymouth Mammography Unit (`src/content/projects/plymouth-mammography-unit.md`)

- [ ] Facts to add: Doorsets, Project year, Programme, Client / contractor
- [ ] Missing close stage: Door-level close-out record (Reserved for the DDS record or handover document once supplied. Hidden on the live page until then.)
- [ ] Number of doorsets, project date and programme
- [ ] Client / principal contractor and live-site status
- [ ] Close-out evidence (DDS record or handover)
- [ ] Testimonial

### Tor Bridge High (`src/content/projects/tor-bridge-high.md`)

- [ ] Facts to add: Doors / doorsets, Project year, Programme dates
- [ ] Missing close stage: Completion confirmation and records (Reserved for confirmation the programme finished before students returned, plus completion records.)
- [ ] Door count and exact programme
- [ ] Confirmation the deadline was achieved (then upgrade the outcome line)
- [ ] Sequencing / progress evidence and completion records
- [ ] Testimonial

### Stoke Damerel Community College (`src/content/projects/stoke-damerel-community-college.md`)

- [ ] Facts to add: Doors / doorsets, Programme, Occupied during works
- [ ] Door / doorset count, programme and project trigger
- [ ] Occupied status during works
- [ ] Exact compliance / QA process and close-out evidence
- [ ] Testimonial
