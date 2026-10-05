/**
 * Analytics settings (plan Decision 6: Google Analytics 4), read at build time.
 *
 *   PUBLIC_GA_MEASUREMENT_ID   G-XXXXXXXXXX. While unset, the site ships no analytics code, no
 *                              consent banner and no cookie wording.
 *   PUBLIC_GA_BEFORE_CONSENT   What happens before the visitor chooses in the banner:
 *                              "cookieless" (default) sends cookie-free GA4 pings (Consent Mode
 *                              with analytics storage denied); "off" loads nothing until accepted.
 */
const raw = import.meta.env.PUBLIC_GA_MEASUREMENT_ID?.trim();
const valid = raw ? /^G-[A-Z0-9]{4,20}$/.test(raw) : false;
if (raw && !valid) {
  console.warn('[analytics] PUBLIC_GA_MEASUREMENT_ID is not a GA4 ID (G-XXXXXXXXXX): ignored');
}

/** GA4 measurement ID, or null when analytics is off. */
export const gaId: string | null = valid ? raw : null;

/** Cookie-free measurement before the visitor has chosen. */
export const gaCookieless = import.meta.env.PUBLIC_GA_BEFORE_CONSENT?.trim() !== 'off';
