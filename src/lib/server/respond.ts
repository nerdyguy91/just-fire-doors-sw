/**
 * Response helpers for the Pages Functions. Function responses don't pass through
 * public/_headers, so each one sets its own caching and indexing headers.
 */
const common = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
  'X-Content-Type-Options': 'nosniff',
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...common, 'Content-Type': 'application/json; charset=utf-8' },
  });

/** JSON error: { ok: false, error }. */
export const fail = (status: number, error: string, extra: Record<string, unknown> = {}) =>
  json({ ok: false, error, ...extra }, status);

export const seeOther = (location: string) =>
  new Response(null, { status: 303, headers: { ...common, Location: location } });

export const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

/**
 * Minimal standalone page for visitors without JavaScript (validation problems, or the enquiry
 * couldn't be sent). `problems` are listed; `back` is the form's path.
 */
export function messagePage(options: {
  status: number;
  heading: string;
  intro: string;
  problems?: string[];
  back: string;
}): Response {
  const { status, heading, intro, problems = [], back } = options;
  const list = problems.length
    ? `<ul>${problems.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`
    : '';
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(heading)} | Just Fire Doors</title>
<style>
body{margin:0;background:#f4f6f8;color:#23282c;font:17px/1.6 system-ui,sans-serif}
main{max-width:640px;margin:0 auto;padding:56px 24px}
h1{font-size:32px;line-height:1.15;margin:0 0 16px}
a{color:#0e6faf}
li{margin-bottom:6px}
</style>
</head>
<body>
<main>
<h1>${escapeHtml(heading)}</h1>
<p>${escapeHtml(intro)}</p>
${list}
<p>Use your browser’s Back button to return to the form: what you typed should still be there.</p>
<p><a href="${escapeHtml(back)}">Go back to the form</a></p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      ...common,
      'Content-Type': 'text/html; charset=utf-8',
      // This page has one inline <style> and nothing else to load.
      'Content-Security-Policy':
        "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}
