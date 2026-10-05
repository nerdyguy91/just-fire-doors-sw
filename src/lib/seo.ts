/**
 * Site-wide SEO settings and helpers used by BaseLayout / Seo.astro.
 */
import { business } from '../data/business';

export interface Breadcrumb {
  name: string;
  /** Site path with trailing slash, e.g. "/services/". */
  path: string;
}

export interface OgImage {
  /** Site path (under public/) or absolute URL. */
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const siteMeta = {
  name: business.name,
  lang: 'en-GB',
  ogLocale: 'en_GB',
  defaultOgImage: {
    src: '/og/default.jpg',
    width: 1200,
    height: 630,
    alt: 'Just Fire Doors SW: fire-door actions, properly closed.',
  } satisfies OgImage,
  /**
   * Raster logo for Organization schema (Google needs at least 112×112 px).
   * Generated from src/assets/brand/logo-on-light.svg on a white background.
   */
  logo: { src: '/brand/logo.png', width: 1200, height: 408 } as {
    src: string;
    width: number;
    height: number;
  } | null,
};

/** Absolute URL for a site path. */
export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).href;
}

/** Normalise a path to the site's trailing-slash convention (files like /robots.txt are left alone). */
export function withTrailingSlash(path: string): string {
  if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return path;
  return `${path}/`;
}

/**
 * Warn at build time when metadata drifts outside sensible limits. Warnings, not errors, so a
 * long but deliberate title never blocks a deploy; CI output makes them visible.
 */
export function checkMeta(path: string, title: string, description: string): void {
  const problems: string[] = [];
  if (title.length > 65) problems.push(`title is ${title.length} chars (aim for 65 or fewer)`);
  if (description.length < 70 || description.length > 170) {
    problems.push(`description is ${description.length} chars (aim for 70–170)`);
  }
  if (problems.length) console.warn(`[seo] ${path}: ${problems.join('; ')}`);
}
