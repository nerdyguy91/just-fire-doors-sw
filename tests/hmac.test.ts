import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createSessionToken,
  readSessionToken,
  sign,
  signFileLink,
  verify,
  verifyFileLink,
} from '../src/lib/server/hmac.ts';

const secret = 'a'.repeat(64);
const now = Date.UTC(2026, 9, 2, 12);
const session = {
  sid: '0b0e7a52-6c1e-4b7e-9d43-1f2a3b4c5d6e',
  ym: '2026-10',
  max: 10,
  exp: now + 60_000,
};

test('sign and verify', async () => {
  const signature = await sign(secret, 'hello');
  assert.match(signature, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(await verify(secret, 'hello', signature), true);
  assert.equal(await verify(secret, 'hello!', signature), false);
  assert.equal(await verify('b'.repeat(64), 'hello', signature), false);
  assert.equal(await verify(secret, 'hello', 'not base64 !!'), false);
  assert.equal(await verify(secret, 'hello', ''), false);
});

test('session token: valid, tampered, expired, malformed', async () => {
  const token = await createSessionToken(secret, session);
  assert.deepEqual(await readSessionToken(secret, token, now), session);

  const [payload, signature] = token.split('.');
  const forged = btoa(JSON.stringify({ ...session, max: 999 })).replace(/=+$/, '');
  assert.equal(await readSessionToken(secret, `${forged}.${signature}`, now), null);
  assert.equal(await readSessionToken(secret, `${payload}.${signature}x`, now), null);
  assert.equal(await readSessionToken(secret, `${payload}.${signature}.extra`, now), null);
  assert.equal(await readSessionToken('b'.repeat(64), token, now), null);
  assert.equal(await readSessionToken(secret, token, session.exp), null);
  assert.equal(await readSessionToken(secret, token, session.exp + 1), null);
  for (const bad of ['', 'abc', '.', 'a.b', null, undefined, 42, {}]) {
    assert.equal(await readSessionToken(secret, bad, now), null);
  }
});

test('file link: valid, tampered, expired', async () => {
  const key = `uploads/2026-10/${session.sid}/abc-survey.pdf`;
  const exp = Math.floor(now / 1000) + 3600;
  const sig = await signFileLink(secret, key, exp);
  assert.equal(await verifyFileLink(secret, key, String(exp), sig, now), true);
  assert.equal(await verifyFileLink(secret, `${key}x`, String(exp), sig, now), false);
  assert.equal(await verifyFileLink(secret, key, String(exp + 1), sig, now), false);
  assert.equal(await verifyFileLink(secret, key, String(exp), `${sig}x`, now), false);
  assert.equal(await verifyFileLink(secret, key, String(exp), sig, exp * 1000), false);
  assert.equal(await verifyFileLink(secret, key, null, sig, now), false);
  assert.equal(await verifyFileLink(secret, key, String(exp), null, now), false);
  assert.equal(await verifyFileLink(secret, key, '1e99', sig, now), false);
});

test('a session signature cannot be used as a file link, or the reverse', async () => {
  const token = await createSessionToken(secret, session);
  const [payload, signature] = token.split('.');
  assert.equal(await verify(secret, `file:${payload}`, signature), false);
  const sig = await signFileLink(secret, 'k', 1);
  assert.equal(await readSessionToken(secret, `k:1.${sig}`, now), null);
});
