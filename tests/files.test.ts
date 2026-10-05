import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  contentDisposition,
  isUploadKey,
  keyBelongsToSession,
  objectKey,
  sanitiseFilename,
  sessionMarker,
  sessionPrefix,
  yearMonth,
} from '../src/lib/server/files.ts';

const session = { sid: '0b0e7a52-6c1e-4b7e-9d43-1f2a3b4c5d6e', ym: '2026-10' };
const uuid = '11111111-2222-4333-8444-555555555555';

test('sanitiseFilename', () => {
  assert.equal(sanitiseFilename('Fire door survey — Block B.PDF'), 'fire-door-survey-block-b.pdf');
  assert.equal(sanitiseFilename('Café plan (v2).xlsx'), 'cafe-plan-v2.xlsx');
  assert.equal(sanitiseFilename('../../etc/passwd'), 'etc-passwd');
  assert.equal(sanitiseFilename('日本語.pdf'), 'file.pdf');
  assert.equal(sanitiseFilename(''), 'file');
  assert.equal(sanitiseFilename('a b\r\nc".jpg'), 'a-b-c.jpg');
  const long = sanitiseFilename(`${'x'.repeat(300)}.docx`);
  assert.equal(long.length, 100);
  assert.ok(long.endsWith('.docx'));
});

test('keys', () => {
  assert.equal(yearMonth(new Date(Date.UTC(2026, 9, 2))), '2026-10');
  assert.equal(sessionPrefix(session), `uploads/2026-10/${session.sid}/`);
  const key = objectKey(session, uuid, 'Job sheet JS-1042.pdf');
  assert.equal(key, `uploads/2026-10/${session.sid}/${uuid}-job-sheet-js-1042.pdf`);
  assert.ok(isUploadKey(key));
  assert.ok(keyBelongsToSession(key, session));
  assert.ok(!isUploadKey(sessionMarker(session)));
});

test('keys from another session or outside the folder are refused', () => {
  const other = { sid: 'ffffffff-6c1e-4b7e-9d43-1f2a3b4c5d6e', ym: '2026-10' };
  const key = objectKey(other, uuid, 'a.pdf');
  assert.ok(!keyBelongsToSession(key, session));
  assert.ok(!keyBelongsToSession(`${sessionPrefix(session)}../${other.sid}/a.pdf`, session));
  assert.ok(!keyBelongsToSession(`${sessionPrefix(session)}sub/a.pdf`, session));
  assert.ok(!keyBelongsToSession(sessionPrefix(session), session));
  assert.ok(!keyBelongsToSession(objectKey({ ...session, ym: '2026-09' }, uuid, 'a.pdf'), session));
  assert.ok(!keyBelongsToSession(42, session));
  assert.ok(!isUploadKey('uploads/2026-10/../secrets/a.pdf'));
  assert.ok(!isUploadKey('other/2026-10/x/a.pdf'));
  assert.ok(!isUploadKey(`uploads/2026-10/${session.sid}/a/b.pdf`));
});

test('contentDisposition is header-safe', () => {
  const header = contentDisposition('Fire door "survey"\r\nX: y — B.pdf');
  assert.ok(!/[\r\n]/.test(header));
  assert.ok(
    header.startsWith('attachment; filename="fire-door-survey-x-y-b.pdf"; filename*=UTF-8\'\''),
  );
  assert.ok(/^[\x20-\x7e]+$/.test(header));
});
