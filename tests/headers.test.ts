import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { noJsSwap } from '../src/lib/inline-scripts.ts';

const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
const csp = headers.match(/^\s*Content-Security-Policy: (.+)$/m)?.[1] ?? '';
const directive = (name: string) =>
  csp
    .split(';')
    .map((d) => d.trim())
    .find((d) => d.startsWith(`${name} `)) ?? '';

test('CSP allows the inline head script by its current hash', () => {
  const hash = createHash('sha256').update(noJsSwap).digest('base64');
  assert.ok(
    directive('script-src').includes(`'sha256-${hash}'`),
    'update the hash in public/_headers',
  );
});

test('CSP keeps scripts hash-only and locks down the rest', () => {
  assert.ok(!directive('script-src').includes('unsafe'));
  assert.equal(directive('default-src'), "default-src 'self'");
  assert.equal(directive('frame-ancestors'), "frame-ancestors 'none'");
  assert.equal(directive('object-src'), "object-src 'none'");
  assert.equal(directive('form-action'), "form-action 'self'");
  assert.equal(directive('base-uri'), "base-uri 'self'");
});

test('no rule line exceeds the Pages limit of 2,000 characters', () => {
  for (const line of headers.split('\n')) assert.ok(line.length <= 2000);
});
