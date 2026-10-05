/**
 * Header enhancement (progressive: without JS the Services item is a link to /services/ and the
 * mobile nav shows expanded).
 *
 * - Services disclosure (desktop): button toggles #svc-menu. Escape closes and returns focus;
 *   clicking outside or tabbing out closes.
 * - Mobile menu: button toggles the mobile nav panel.
 * - Header shrink: an IntersectionObserver on a sentinel 40px down the page toggles .is-scrolled.
 */

function setupDisclosure(button: HTMLButtonElement, panel: HTMLElement, container: HTMLElement) {
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    // CSS keys off .is-open under html.js so the panel is hidden from first paint.
    panel.classList.toggle('is-open', open);
  };

  button.addEventListener('click', () => setOpen(!isOpen()));

  container.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !container.contains(event.target as Node)) setOpen(false);
  });

  container.addEventListener('focusout', (event) => {
    const next = event.relatedTarget as Node | null;
    if (isOpen() && next && !container.contains(next)) setOpen(false);
  });

  return setOpen;
}

function init() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const svcButton = header.querySelector<HTMLButtonElement>('[data-svc-toggle]');
  const svcMenu = header.querySelector<HTMLElement>('#svc-menu');
  const svcItem = header.querySelector<HTMLElement>('[data-svc]');
  if (svcButton && svcMenu && svcItem) setupDisclosure(svcButton, svcMenu, svcItem);

  const mobileButton = header.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
  const mobileNav = header.querySelector<HTMLElement>('#mob-menu');
  if (mobileButton && mobileNav) {
    const setOpen = setupDisclosure(mobileButton, mobileNav, header);
    setOpen(false);
    // Close after choosing an in-page destination (e.g. the quote CTA with a hash).
    mobileNav.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('a')) setOpen(false);
    });
  }

  const sentinel = document.querySelector('[data-header-sentinel]');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }
}

init();
