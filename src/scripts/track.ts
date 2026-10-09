/**
 * Analytics (Google Analytics 4), loaded only on builds with a measurement ID.
 *
 * Three states, set by the consent banner (ConsentBanner.astro) and kept in localStorage:
 *   no choice yet  cookie-free measurement: GA4 Consent Mode with analytics storage denied, so
 *                  page views and events are sent with no cookies and no visitor or session
 *                  identity. (With PUBLIC_GA_BEFORE_CONSENT=off, nothing loads in this state.)
 *   accepted       full measurement with GA cookies.
 *   rejected       nothing is sent, and any GA cookies are removed.
 * "Cookie settings" in the footer reopens the banner. Advertising signals are always denied.
 *
 * Events (plan section 10). No personal data is ever sent: labels are button text, never values.
 *   cta_click             { label, location }   links styled as buttons, or [data-track="cta"]
 *   tel_click             { location }
 *   mailto_click          { location }
 *   quote_route_selected  { route }             from forms.ts
 *   form_submit_success   { form, route }       from forms.ts, and on the no-JS thanks pages
 *   form_submit_error     { form, type }        from forms.ts; type: validation | server
 */
type Params = Record<string, string | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const id = document.documentElement.dataset.ga;
const cookieless = document.documentElement.dataset.gaBefore === 'cookieless';
const KEY = 'jfd-analytics-consent';
let active = false;
let loaded = false;

// gtag.js reads the queued `arguments` objects, so this can't be an arrow function.
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer!.push(arguments);
}

const disable = (off: boolean) => {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = off;
};

/** Start measuring: with cookies if the visitor accepted, cookie-free otherwise. */
function start(accepted: boolean) {
  if (!id) return;
  active = true;
  disable(false);
  const storage = accepted ? 'granted' : 'denied';
  if (loaded) return gtag('consent', 'update', { analytics_storage: storage });
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'default', {
    analytics_storage: storage,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('js', new Date());
  gtag('config', id);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);
}

function stop() {
  if (!id) return;
  active = false;
  if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
  disable(true);
  // Remove the GA cookies, on this host and its parent domains.
  const parts = location.hostname.split('.');
  const domains = parts.map((_, i) => parts.slice(i).join('.'));
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) continue;
    for (const domain of ['', ...domains]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

/** Send an event. Does nothing unless analytics is configured and the visitor has accepted. */
export function track(name: string, params: Params = {}) {
  if (active) gtag('event', name, params);
}

function stored(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Where on the page a click happened: header, footer, or the section's id / heading id. */
function locationOf(el: Element): string {
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  const section = el.closest('section');
  return section?.id || section?.getAttribute('aria-labelledby') || 'main';
}

function init() {
  if (!id) return;
  const banner = document.querySelector<HTMLDialogElement>('[data-consent-banner]');
  // Modal: the page behind is inert until the visitor chooses (or presses Escape, which closes
  // it for this page only). Focus goes to the heading, not to either button.
  const open = () => {
    if (!banner || banner.open) return;
    banner.showModal();
    banner.querySelector<HTMLElement>('#consent-title')?.focus();
  };

  const choose = (choice: 'granted' | 'denied') => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
    banner?.close();
    if (choice === 'granted') start(true);
    else stop();
  };
  banner?.querySelectorAll<HTMLElement>('[data-consent]').forEach((button) => {
    button.addEventListener('click', () => choose(button.dataset.consent as 'granted' | 'denied'));
  });
  document.querySelectorAll('[data-consent-open]').forEach((button) => {
    button.addEventListener('click', open);
  });

  const choice = stored();
  if (choice === 'granted') start(true);
  else if (choice !== 'denied') {
    open();
    if (cookieless) start(false);
  }

  document.addEventListener('click', (event) => {
    const el = (event.target as Element | null)?.closest?.('a, button');
    if (!el) return;
    const href = el.getAttribute('href') ?? '';
    if (href.startsWith('tel:')) track('tel_click', { location: locationOf(el) });
    else if (href.startsWith('mailto:')) track('mailto_click', { location: locationOf(el) });
    else if (el.matches('a.jfd-btn, [data-track="cta"]')) {
      const label = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 100);
      track('cta_click', { label, location: locationOf(el) });
    }
  });

  // Thanks pages (reached when the form was posted without the forms script).
  const sent = document.querySelector<HTMLElement>('[data-track-load]');
  if (sent) track(sent.dataset.trackLoad!, { form: sent.dataset.form });
}

init();
