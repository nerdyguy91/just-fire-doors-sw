/**
 * Site URL paths. Always absolute, always with a trailing slash (astro.config trailingSlash).
 * Import these instead of hard-coding URLs so a slug change happens in one place.
 */
export const paths = {
  home: '/',
  services: '/services/',
  remedialWorks: '/services/fire-door-remedial-works/',
  inspections: '/services/fire-door-inspections/',
  maintenance: '/services/fire-door-maintenance/',
  installation: '/services/fire-door-installation/',
  projects: '/projects/',
  about: '/about/',
  contact: '/contact/',
  quote: '/get-a-quote/',
  privacy: '/privacy/',
} as const;

export type SitePath = (typeof paths)[keyof typeof paths];

/** Project detail page path. */
export const projectPath = (slug: string) => `${paths.projects}${slug}/`;
