/**
 * Accessibility check: pa11y-ci (axe, WCAG 2 AA) on every URL in the sitemap of a running site.
 *
 *   node scripts/a11y.mjs [origin]     default origin: http://localhost:4321 (`npm run preview`)
 *
 * axe reports some results as "needs review" when it can't decide (text over images, glyphs with
 * no measurable background such as the → arrows). pa11y lists those as errors. They are printed
 * here for a manual check but only confirmed violations fail the run (plan step 13).
 */
import { spawnSync } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const origin = (process.argv[2] ?? 'http://localhost:4321').replace(/\/$/, '');

// pa11y-ci exits as soon as it finishes, which cuts off a large report sent down a pipe.
// Writing its output straight to a file avoids that.
const dir = mkdtempSync(join(tmpdir(), 'a11y-'));
const file = join(dir, 'report.json');
const fd = openSync(file, 'w');
const run = spawnSync(
  'npx',
  [
    'pa11y-ci',
    '--json',
    '--sitemap',
    `${origin}/sitemap-0.xml`,
    '--sitemap-find',
    '^https?://[^/]+',
    '--sitemap-replace',
    origin,
  ],
  { encoding: 'utf8', stdio: ['ignore', fd, 'pipe'] },
);
closeSync(fd);
const output = readFileSync(file, 'utf8');
rmSync(dir, { recursive: true, force: true });

let report;
try {
  report = JSON.parse(output);
} catch {
  console.error(run.stderr || output || 'pa11y-ci produced no report. Is the site running?');
  process.exit(1);
}

const path = (url) => new URL(url).pathname;
const violations = [];
const review = new Map();
for (const [url, issues] of Object.entries(report.results)) {
  for (const issue of issues) {
    // A page that failed to load is reported as an Error object with no code.
    if (!issue.code) violations.push(`${path(url)}: ${issue.message}`);
    else if (issue.runnerExtras?.needsFurtherReview) {
      const key = `${issue.code}: ${issue.context?.replace(/\s*data-astro-cid-\w+(="")?/g, '')}`;
      review.set(key, (review.get(key) ?? new Set()).add(path(url)));
    } else {
      violations.push(`${path(url)}: [${issue.code}] ${issue.message}\n    ${issue.selector}`);
    }
  }
}

console.log(`Checked ${report.total} pages on ${origin}.`);
if (review.size) {
  console.log(`\n${review.size} item(s) axe could not decide; check these by hand:`);
  for (const [key, pages] of review) console.log(`  ${key}\n    on ${[...pages].join(', ')}`);
}
if (violations.length) {
  console.error(`\n${violations.length} accessibility violation(s):\n  ${violations.join('\n  ')}`);
  process.exit(1);
}
console.log('\nNo confirmed violations.');
