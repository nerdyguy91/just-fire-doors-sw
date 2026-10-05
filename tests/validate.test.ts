import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contactFields, fieldsFor, quoteSections } from '../src/lib/enquiry/fields.ts';
import { errorSummary, validateEnquiry } from '../src/lib/enquiry/validate.ts';

test('contact: name and one way to reply are enough', () => {
  const byEmail = validateEnquiry('contact', undefined, { name: 'Sam', email: 'sam@example.org' });
  assert.deepEqual(byEmail.errors, {});
  assert.deepEqual(byEmail.values, { name: 'Sam', email: 'sam@example.org' });

  const byPhone = validateEnquiry('contact', undefined, { name: 'Sam', tel: '01752 123456' });
  assert.deepEqual(byPhone.errors, {});
});

test('contact: missing name and missing reply route are reported in field order', () => {
  const { errors } = validateEnquiry('contact', undefined, { msg: 'Hello' });
  assert.deepEqual(Object.keys(errors), ['name', 'email']);
  assert.equal(errors.name, 'Enter your name so we know who we’re speaking to.');
  assert.equal(
    errors.email,
    'Enter an email address we can use to contact you — or a telephone number instead.',
  );
});

test('email format is checked, even when a telephone number is given', () => {
  const { errors } = validateEnquiry('contact', undefined, {
    name: 'Sam',
    email: 'not-an-email',
    tel: '01752 123456',
  });
  assert.deepEqual(errors, { email: 'That email address doesn’t look quite right.' });
});

test('values are trimmed and whitespace-only counts as empty', () => {
  const { values, errors } = validateEnquiry('contact', undefined, {
    name: '  Sam  ',
    email: '   ',
    tel: ' 01752 123456 ',
  });
  assert.deepEqual(errors, {});
  assert.deepEqual(values, { name: 'Sam', tel: '01752 123456' });
});

test('fields that do not belong to the form are dropped', () => {
  const { values } = validateEnquiry('contact', undefined, {
    name: 'Sam',
    tel: '1',
    where: 'Plymouth',
    website: 'spam',
    __proto__: 'x',
  });
  assert.deepEqual(values, { name: 'Sam', tel: '1' });
});

test('non-string input is ignored', () => {
  const { errors } = validateEnquiry('contact', undefined, { name: ['Sam'], email: { a: 1 } });
  assert.deepEqual(Object.keys(errors), ['name', 'email']);
});

test('a choice outside the options is treated as not answered', () => {
  const ok = validateEnquiry('contact', undefined, {
    name: 'Sam',
    tel: '1',
    topic: 'General question',
  });
  assert.equal(ok.values.topic, 'General question');
  const bad = validateEnquiry('contact', undefined, { name: 'Sam', tel: '1', topic: 'Other' });
  assert.equal(bad.values.topic, undefined);
  assert.deepEqual(bad.errors, {});
});

test('length caps apply to every text field', () => {
  const { errors } = validateEnquiry('contact', undefined, {
    name: 'a'.repeat(201),
    tel: '1',
    msg: 'b'.repeat(4001),
  });
  assert.equal(errors.name, 'Please shorten this to 200 characters or fewer.');
  assert.equal(errors.msg, 'Please shorten this to 4000 characters or fewer.');
});

test('quote: uses the quote wording', () => {
  const { errors } = validateEnquiry('quote', 'survey', {});
  assert.deepEqual(errors, {
    name: 'Please tell us your name.',
    email: 'Please give us an email or a telephone number — one is enough.',
  });
});

test('quote: only the chosen route’s fields are accepted', () => {
  const { values, errors } = validateEnquiry('quote', 'backlog', {
    name: 'Sam',
    email: 'sam@example.org',
    actions: '214',
    btype: 'school',
    backlog: 'Yes',
  });
  assert.deepEqual(errors, {});
  assert.deepEqual(values, { name: 'Sam', email: 'sam@example.org', actions: '214' });
});

test('quote: the "not sure" route needs the combined contact field', () => {
  const missing = validateEnquiry('quote', 'not-sure', { name: 'Sam', email: 'sam@example.org' });
  assert.deepEqual(missing.errors, {
    contact: 'Please give us an email or telephone number so we can reply.',
  });
  const ok = validateEnquiry('quote', 'not-sure', { name: 'Sam', contact: '01752 123456' });
  assert.deepEqual(ok.errors, {});
});

test('quote: maintenance backlog answer must be one of the options', () => {
  const { values } = validateEnquiry('quote', 'maintenance', {
    name: 'Sam',
    tel: '1',
    backlog: 'Not sure',
  });
  assert.equal(values.backlog, 'Not sure');
});

test('an unknown form or route is rejected', () => {
  assert.deepEqual(Object.keys(validateEnquiry('quote', 'route-z', { name: 'Sam' }).errors), [
    'route',
  ]);
  assert.deepEqual(Object.keys(validateEnquiry('quote', undefined, {}).errors), ['route']);
  assert.deepEqual(Object.keys(validateEnquiry('newsletter', undefined, {}).errors), ['route']);
  assert.deepEqual(Object.keys(validateEnquiry('quote', 'constructor', {}).errors), ['route']);
});

test('uploads are not value fields', () => {
  for (const route of Object.keys(quoteSections)) {
    const fields = fieldsFor('quote', route)!;
    assert.ok(fields.every((f) => f.kind !== 'upload'));
    assert.ok(fields.some((f) => f.id === 'name' && f.required));
  }
  assert.equal(fieldsFor('contact'), contactFields);
});

test('field ids are unique within each form', () => {
  const unique = (ids: string[]) => new Set(ids).size === ids.length;
  assert.ok(unique(contactFields.map((f) => f.id)));
  for (const sections of Object.values(quoteSections)) {
    assert.ok(unique(sections.flatMap((s) => s.fields.map((f) => f.id))));
  }
});

test('error summary wording', () => {
  assert.equal(
    errorSummary('contact', 1),
    'One thing needs fixing before we can send this. Everything you’ve typed is still here.',
  );
  assert.equal(
    errorSummary('contact', 2),
    '2 things need fixing before we can send this. Everything you’ve typed is still here.',
  );
  assert.equal(
    errorSummary('quote', 1),
    'One thing needs fixing before we can send this — see the highlighted field.',
  );
  assert.equal(
    errorSummary('quote', 2),
    '2 things need fixing before we can send this — see the highlighted fields.',
  );
});
