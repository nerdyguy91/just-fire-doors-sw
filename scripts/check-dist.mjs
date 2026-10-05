/**
 * Checks on the built site (run after `npm run build`; part of `npm run ci`).
 *
 *   1. No placeholder text shipped (plan section 14, content sign-off).
 *   2. Every internal link, asset and in-page anchor resolves to something in dist/.
 *   3. Per-page budgets (plan section 6): own JS ≤ 10 KB and CSS ≤ 20 KB, gzipped.
 *
 * Exits non-zero with a list of problems.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const PLACEHOLDERS = /To confirm|\[X\]|01752 000 000|\[Founder|\[Confirmed|\[Accreditation/;
const BUDGET = { js: 10 * 1024, css: 20 * 1024 };

if (!existsSync(dist)) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const pages = walk(dist).filter((f) => f.endsWith('.html'));
const html = new Map(pages.map((f) => [f, readFileSync(f, 'utf8')]));
const gz = (content) => gzipSync(content).length;
const problems = [];
const report = (file, message) => problems.push(`${relative(dist, file)}: ${message}`);

/** dist file for a site path, or null. */
function resolve(path) {
  const clean = decodeURIComponent(path);
  const candidates = clean.endsWith('/')
    ? [join(dist, clean, 'index.html')]
    : [join(dist, clean), join(dist, clean, 'index.html'), join(dist, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/** Pages Functions routes count as valid targets (functions/api/enquiry.ts → /api/enquiry). */
const isFunctionRoute = (path) => existsSync(join(root, 'functions', `${path}.ts`));

const hasId = (content, id) =>
  new RegExp(`\\sid="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(content);

for (const [file, content] of html) {
  // 1. Placeholders
  const placeholder = content.match(PLACEHOLDERS);
  if (placeholder) report(file, `placeholder text "${placeholder[0]}"`);

  // 2. Links, assets and anchors
  const pagePath = `/${posix.dirname(relative(dist, file).split('\\').join('/'))}/`.replace(
    '/./',
    '/',
  );
  const urls = new Set();
  for (const [, , value] of content.matchAll(/\s(href|src|action|poster)="([^"]*)"/g))
    urls.add(value);
  for (const [, value] of content.matchAll(/\ssrcset="([^"]*)"/g)) {
    value.split(',').forEach((entry) => urls.add(entry.trim().split(/\s+/)[0]));
  }
  for (const raw of urls) {
    const url = raw.replace(/&amp;/g, '&');
    if (!url || /^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [beforeHash, hash] = url.split('#');
    const path = beforeHash.split('?')[0];
    const absolute = path ? posix.resolve(pagePath, path) + (path.endsWith('/') ? '/' : '') : null;
    if (absolute && isFunctionRoute(absolute)) continue;
    const target = absolute ? resolve(absolute.replace(/\/\/$/, '/')) : file;
    if (!target) {
      report(file, `broken link ${url}`);
      continue;
    }
    if (hash && target.endsWith('.html') && !hasId(html.get(target) ?? '', hash)) {
      report(file, `anchor not found ${url}`);
    }
  }

  // 3. Budgets
  const seen = new Set();
  const scriptSize = (path) => {
    const target = resolve(path);
    if (!target || seen.has(target)) return 0;
    seen.add(target);
    const source = readFileSync(target, 'utf8');
    const imports = [...source.matchAll(/(?:import|from)\s*["'](\.{1,2}\/[^"']+)["']/g)].map(
      ([, spec]) => posix.resolve(posix.dirname(path), spec),
    );
    return gz(source) + imports.reduce((sum, spec) => sum + scriptSize(spec), 0);
  };
  const js = [...content.matchAll(/<script[^>]*\ssrc="(\/[^"]+)"/g)].reduce(
    (sum, [, src]) => sum + scriptSize(src),
    0,
  );
  const linked = [...content.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(\/[^"]+)"/g)].reduce(
    (sum, [, href]) => sum + (resolve(href) ? gz(readFileSync(resolve(href))) : 0),
    0,
  );
  const inline = [...content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map(([, css]) => css)
    .join('');
  const css = linked + (inline ? gz(inline) : 0);
  if (js > BUDGET.js) report(file, `JS is ${js} bytes gzipped (budget ${BUDGET.js})`);
  if (css > BUDGET.css) report(file, `CSS is ${css} bytes gzipped (budget ${BUDGET.css})`);
  if (process.argv.includes('--sizes')) {
    console.log(
      `${relative(dist, file).padEnd(62)} js ${String(js).padStart(5)}  css ${String(css).padStart(5)}`,
    );
  }
}

if (problems.length) {
  console.error(
    `${problems.length} problem(s) in dist/:\n${problems.map((p) => `  ${p}`).join('\n')}`,
  );
  process.exit(1);
}
console.log(`dist/ OK: ${pages.length} pages, no placeholders, links resolve, budgets met.`);
