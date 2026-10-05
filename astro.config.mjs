// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical origin: the apex domain (plan Decision 4).
const site = process.env.PUBLIC_SITE_URL ?? 'https://justfiredoorssw.com';

// Pages that must never appear in the sitemap.
const excluded = ['/contact/thanks/', '/get-a-quote/thanks/', '/404/'];

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Inline every stylesheet into the page: 6–13 KB gzipped per page, and no render-blocking
    // CSS requests (with separate files, LCP missed the 1.8 s budget). The CSP allows inline
    // styles; scripts are never inlined (see assetsInlineLimit below).
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Never inline scripts or assets as data: URIs. Keeps the CSP hash-free except for the one
      // documented head script (src/lib/inline-scripts.ts), and lets assets cache separately.
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !excluded.some((path) => new URL(page).pathname === path),
    }),
  ],
});
