import type { APIRoute } from 'astro';

/**
 * robots.txt. Preview hosts (*.pages.dev) are additionally sent `X-Robots-Tag: noindex`
 * from public/_headers (step 11).
 */
export const GET: APIRoute = ({ site }) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /files/',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
