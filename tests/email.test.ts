import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildEmail, replyTo } from '../src/lib/server/email.ts';

const base = {
  page: '/get-a-quote/',
  submittedAt: new Date(Date.UTC(2026, 9, 2, 11, 30)),
  noJs: false,
  linkTtlDays: 30,
};

test('quote email: subject, labelled fields, file links', () => {
  const { subject, text } = buildEmail({
    ...base,
    form: 'quote',
    route: 'survey',
    values: {
      name: 'Sam Tester',
      org: 'Estates Team',
      email: 'sam@example.org',
      where: 'Block B',
      deadline: 'Before term starts\nNo later than 1 September',
    },
    files: [{ name: 'Survey.pdf', size: 4404019, url: 'https://example.org/files/k?exp=1&sig=s' }],
  });
  assert.equal(subject, '[JFD enquiry] I already have a report or survey — Estates Team');
  assert.match(text, /^Name: Sam Tester$/m);
  assert.match(text, /^Where is the work\?: Block B$/m);
  assert.match(
    text,
    /^Is there a deadline or priority we should know about\?:\n    Before term starts\n    No later than 1 September$/m,
  );
  assert.match(
    text,
    /^- Survey\.pdf \(4\.2 MB\)\n  https:\/\/example\.org\/files\/k\?exp=1&sig=s$/m,
  );
  assert.match(text, /expire after 30 days/);
  assert.match(text, /deleted from website storage 90 days after upload/);
  assert.match(text, /^Sent: Friday,? 2 October 2026 at 12:30 \(UK time\)$/m);
  assert.match(text, /^Page: \/get-a-quote\/$/m);
});

test('contact email, no files, no-JS marker', () => {
  const { subject, text } = buildEmail({
    ...base,
    form: 'contact',
    noJs: true,
    values: { name: 'Sam', tel: '01752 123456' },
    files: [],
  });
  assert.equal(subject, '[no-JS] [JFD enquiry] Contact form — Sam');
  assert.match(text, /^Files: none$/m);
  assert.match(text, /sent without JavaScript/);
  assert.doesNotMatch(text, /Reply to this email/);
});

test('typed values cannot inject lines into the subject or short fields', () => {
  const { subject, text } = buildEmail({
    ...base,
    form: 'contact',
    values: { name: 'Sam', org: 'Evil\r\nBcc: x@y.z', tel: '1\nEmail: fake@x.y' },
    files: [],
  });
  assert.ok(!/[\r\n]/.test(subject));
  assert.match(text, /^Organisation: Evil Bcc: x@y\.z$/m);
  assert.doesNotMatch(text, /^Email: fake/m);
});

test('replyTo only returns a header-safe address', () => {
  assert.equal(replyTo({ email: 'sam@example.org' }), 'sam@example.org');
  assert.equal(replyTo({ contact: 'sam@example.org' }), 'sam@example.org');
  assert.equal(replyTo({ contact: '01752 123456' }), undefined);
  assert.equal(replyTo({ email: 'a@b.c,evil@x.y' }), undefined);
  assert.equal(replyTo({ email: 'Sam <a@b.c>' }), undefined);
  assert.equal(replyTo({}), undefined);
});
