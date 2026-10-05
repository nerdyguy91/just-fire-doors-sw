/**
 * End-to-end test of the four Pages Functions against an in-memory bucket, with Turnstile and
 * Resend stubbed at fetch.
 */
import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { onRequestPost as enquiry } from '../functions/api/enquiry.ts';
import { onRequestPost as uploadSession } from '../functions/api/upload-session.ts';
import { onRequestPut as upload } from '../functions/api/upload.ts';
import { onRequestGet as download } from '../functions/files/[[key]].ts';
import type { Bucket, Env } from '../src/lib/server/env.ts';

const ORIGIN = 'https://preview.example';

// Workers global used by the upload function.
(globalThis as Record<string, unknown>).FixedLengthStream = class extends TransformStream {
  constructor(length: number) {
    let seen = 0;
    super({
      transform(chunk, controller) {
        seen += chunk.byteLength;
        controller.enqueue(chunk);
      },
      flush(controller) {
        if (seen !== length) controller.error(new Error('length mismatch'));
      },
    });
  }
};

interface Stored {
  bytes: Uint8Array<ArrayBuffer>;
  httpMetadata?: { contentType?: string };
  customMetadata?: Record<string, string>;
}
function memoryBucket() {
  const objects = new Map<string, Stored>();
  const bucket: Bucket = {
    async put(key, value, options) {
      const bytes = new Uint8Array(await new Response(value).arrayBuffer());
      objects.set(key, { bytes, ...options });
    },
    async get(key) {
      const o = objects.get(key);
      return o ? { size: o.bytes.length, ...o, body: new Response(o.bytes).body! } : null;
    },
    async head(key) {
      const o = objects.get(key);
      return o ? { size: o.bytes.length, ...o } : null;
    },
    async list({ prefix, limit = 1000 }) {
      const keys = [...objects.keys()].filter((k) => k.startsWith(prefix)).slice(0, limit);
      return { objects: keys.map((key) => ({ key })) };
    },
  };
  return { bucket, objects };
}

let env: Env;
let objects: Map<string, Stored>;
let emails: { from: string; to: string[]; subject: string; text: string; reply_to?: string }[];
let turnstileOk: boolean;
let resendStatus: number;

beforeEach(() => {
  const memory = memoryBucket();
  objects = memory.objects;
  emails = [];
  turnstileOk = true;
  resendStatus = 200;
  env = {
    UPLOADS: memory.bucket,
    FORM_TO_EMAIL: 'inbox@example.org',
    FORM_FROM_EMAIL: 'forms@example.org',
    RESEND_API_KEY: 're_test',
    TURNSTILE_SECRET_KEY: 'ts_secret',
    FILE_LINK_SECRET: 's'.repeat(64),
    UPLOAD_MAX_FILES: '3',
    UPLOAD_MAX_FILE_MB: '1',
  };
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('turnstile')) {
      const body = init!.body as URLSearchParams;
      assert.equal(body.get('secret'), 'ts_secret');
      return Response.json({ success: turnstileOk && body.get('response') === 'good-token' });
    }
    if (url.includes('resend')) {
      assert.equal((init!.headers as Record<string, string>).Authorization, 'Bearer re_test');
      if (resendStatus === 200) emails.push(JSON.parse(init!.body as string));
      return new Response('{}', { status: resendStatus });
    }
    throw new Error(`unexpected fetch: ${url}`);
  }) as typeof fetch;
});

const ctx = (request: Request, params = {}) => ({ request, env, params });
const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(ORIGIN + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

async function openSession(): Promise<string> {
  const response = await uploadSession(
    ctx(post('/api/upload-session', { turnstileToken: 'good-token', fileCount: 1 })),
  );
  assert.equal(response.status, 200);
  return ((await response.json()) as { token: string }).token;
}

function put(
  session: string,
  name: string,
  bytes: Uint8Array,
  type = 'application/pdf',
  length = bytes.length,
) {
  return upload(
    ctx(
      new Request(`${ORIGIN}/api/upload?session=${encodeURIComponent(session)}`, {
        method: 'PUT',
        headers: {
          'X-Filename': encodeURIComponent(name),
          'Content-Type': type,
          'Content-Length': String(length),
        },
        body: bytes,
        duplex: 'half',
      } as RequestInit),
    ),
  );
}

const pdf = new TextEncoder().encode('%PDF-1.4 test file');
const old = () => String(Date.now() - 10_000);

test('full JavaScript path: session, upload, enquiry, email, download', async () => {
  const session = await openSession();
  const uploaded = await put(session, 'Fire door survey — Block B.pdf', pdf);
  assert.equal(uploaded.status, 200);
  const { key } = (await uploaded.json()) as { key: string };
  assert.match(
    key,
    /^uploads\/\d{4}-\d{2}\/[a-f0-9-]{36}\/[a-f0-9-]{36}-fire-door-survey-block-b\.pdf$/,
  );

  const response = await enquiry(
    ctx(
      post('/api/enquiry', {
        form: 'quote',
        route: 'survey',
        fields: {
          name: 'Sam',
          org: 'Estates',
          email: 'sam@example.org',
          where: 'Block B',
          hack: 'x',
        },
        session,
        files: [key],
        website: '',
        ts: old(),
        page: '/get-a-quote/',
      }),
    ),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });

  assert.equal(emails.length, 1);
  const [email] = emails;
  assert.equal(email.from, 'forms@example.org');
  assert.deepEqual(email.to, ['inbox@example.org']);
  assert.equal(email.reply_to, 'sam@example.org');
  assert.equal(email.subject, '[JFD enquiry] I already have a survey or job sheet — Estates');
  assert.doesNotMatch(email.text, /hack/);
  assert.match(email.text, /- Fire door survey — Block B\.pdf \(1 KB\)/);

  const link = email.text.match(/https:\/\/\S+/)![0];
  assert.ok(link.startsWith(`${ORIGIN}/files/${key}?exp=`));
  const params = { key: new URL(link).pathname.slice('/files/'.length).split('/') };
  const file = await download(ctx(new Request(link), params));
  assert.equal(file.status, 200);
  assert.equal(await file.text(), '%PDF-1.4 test file');
  assert.equal(file.headers.get('Content-Type'), 'application/pdf');
  assert.equal(file.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(file.headers.get('Cache-Control'), 'private, no-store');
  assert.match(
    file.headers.get('Content-Disposition')!,
    /^attachment; filename="fire-door-survey-block-b\.pdf"; filename\*=UTF-8''Fire%20door%20survey%20%E2%80%94%20Block%20B\.pdf$/,
  );

  // Tampered and expired links
  const tampered = link.replace(/sig=.{4}/, 'sig=AAAA');
  assert.equal((await download(ctx(new Request(tampered), params))).status, 403);
  const expired = link.replace(/exp=\d+/, 'exp=1000');
  assert.equal((await download(ctx(new Request(expired), params))).status, 403);
  assert.equal((await download(ctx(new Request(`${ORIGIN}/files/${key}`), params))).status, 403);

  // The session has sent its enquiry: it can't send another.
  const again = await enquiry(
    ctx(
      post('/api/enquiry', {
        form: 'contact',
        fields: { name: 'S', tel: '1' },
        session,
        files: [],
        ts: old(),
      }),
    ),
  );
  assert.equal(again.status, 401);
  assert.equal(emails.length, 1);
});

test('upload-session: Turnstile failure, bad body, oversized body, missing secret', async () => {
  const bad = await uploadSession(ctx(post('/api/upload-session', { turnstileToken: 'bad' })));
  assert.equal(bad.status, 403);
  assert.equal((await uploadSession(ctx(post('/api/upload-session', {})))).status, 403);
  assert.equal((await uploadSession(ctx(post('/api/upload-session', 'not json')))).status, 400);
  const big = { turnstileToken: 'good-token', pad: 'x'.repeat(3000) };
  assert.equal((await uploadSession(ctx(post('/api/upload-session', big)))).status, 413);
  env.FILE_LINK_SECRET = 'short';
  const none = await uploadSession(
    ctx(post('/api/upload-session', { turnstileToken: 'good-token' })),
  );
  assert.equal(none.status, 500);
});

test('upload: session, type, size and count checks', async () => {
  assert.equal((await put('', 'a.pdf', pdf)).status, 401);
  assert.equal((await put('garbage.token', 'a.pdf', pdf)).status, 401);
  const session = await openSession();
  assert.equal((await put(`${session}x`, 'a.pdf', pdf)).status, 401);

  assert.equal((await put(session, 'tool.exe', pdf, 'application/octet-stream')).status, 415);
  assert.equal((await put(session, 'page.pdf', pdf, 'text/html')).status, 415);
  assert.equal(
    (await put(session, 'big.pdf', pdf, 'application/pdf', 1024 * 1024 + 1)).status,
    413,
  );
  assert.equal((await put(session, 'lie.pdf', pdf, 'application/pdf', pdf.length + 5)).status, 400);
  assert.equal(objects.size, 0);

  for (const name of ['1.pdf', '2.pdf', '3.pdf'])
    assert.equal((await put(session, name, pdf)).status, 200);
  assert.equal((await put(session, '4.pdf', pdf)).status, 409);
  assert.equal(objects.size, 3);
});

test('enquiry: files must belong to the session and exist', async () => {
  const mine = await openSession();
  const theirs = await openSession();
  const { key } = (await (await put(theirs, 'a.pdf', pdf)).json()) as { key: string };
  const send = (session: string, files: unknown) =>
    enquiry(
      ctx(
        post('/api/enquiry', {
          form: 'contact',
          fields: { name: 'S', tel: '1' },
          session,
          files,
          ts: old(),
        }),
      ),
    );

  assert.equal((await send(mine, [key])).status, 400);
  assert.equal((await send(theirs, [key.replace('a.pdf', 'missing.pdf')])).status, 400);
  assert.equal((await send(theirs, [key, key])).status, 400);
  assert.equal((await send(theirs, ['a', 'b', 'c', 'd'])).status, 400);
  assert.equal((await send('nope', [])).status, 401);
  assert.equal(emails.length, 0);
  assert.equal((await send(theirs, [key])).status, 200);
});

test('enquiry: validation errors use the shared messages', async () => {
  const session = await openSession();
  const response = await enquiry(
    ctx(
      post('/api/enquiry', {
        form: 'quote',
        route: 'not-sure',
        fields: {},
        session,
        files: [],
        ts: old(),
      }),
    ),
  );
  assert.equal(response.status, 422);
  assert.deepEqual(((await response.json()) as { errors: unknown }).errors, {
    name: 'Please tell us your name.',
    contact: 'Please give us an email or telephone number so we can reply.',
  });
  assert.equal(emails.length, 0);
});

test('enquiry: honeypot and too-fast submissions get a fake success', async () => {
  const session = await openSession();
  const body = { form: 'contact', fields: { name: 'S', tel: '1' }, session, files: [] };
  const trapped = await enquiry(
    ctx(post('/api/enquiry', { ...body, website: 'http://spam', ts: old() })),
  );
  assert.deepEqual([trapped.status, await trapped.json()], [200, { ok: true }]);
  const fast = await enquiry(ctx(post('/api/enquiry', { ...body, ts: String(Date.now() - 500) })));
  assert.equal(fast.status, 200);
  assert.equal(emails.length, 0);
});

test('enquiry: provider failure returns 502 and leaves the session usable', async () => {
  const session = await openSession();
  const body = { form: 'contact', fields: { name: 'S', tel: '1' }, session, files: [], ts: old() };
  resendStatus = 500;
  assert.equal((await enquiry(ctx(post('/api/enquiry', body)))).status, 502);
  resendStatus = 200;
  assert.equal((await enquiry(ctx(post('/api/enquiry', body)))).status, 200);
  assert.equal(emails.length, 1);
});

test('enquiry: other origins, content types and oversized bodies are refused', async () => {
  const body = { form: 'contact', fields: { name: 'S', tel: '1' } };
  assert.equal(
    (await enquiry(ctx(post('/api/enquiry', body, { Origin: 'https://evil.example' })))).status,
    403,
  );
  assert.equal(
    (await enquiry(ctx(post('/api/enquiry', body, { 'Content-Type': 'text/plain' })))).status,
    415,
  );
  assert.equal((await enquiry(ctx(post('/api/enquiry', { pad: 'x'.repeat(70_000) })))).status, 413);
  assert.equal((await enquiry(ctx(post('/api/enquiry', '{')))).status, 400);
});

const formPost = (fields: Record<string, string>) =>
  post('/api/enquiry', new URLSearchParams(fields).toString(), {
    'Content-Type': 'application/x-www-form-urlencoded',
  });

test('no-JavaScript path: redirect to thanks, marked email, no session needed', async () => {
  const response = await enquiry(
    ctx(
      formPost({
        form: 'quote',
        route: 'backlog',
        name: 'Sam',
        tel: '01752 123456',
        actions: '214',
        website: '',
        ts: '',
      }),
    ),
  );
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('Location'), '/get-a-quote/thanks/');
  assert.equal(emails.length, 1);
  assert.ok(emails[0].subject.startsWith('[no-JS] [JFD enquiry] I have outstanding remedial work'));
  assert.equal(emails[0].reply_to, undefined);
  assert.match(emails[0].text, /Roughly how many outstanding actions are involved\?: 214/);

  const contact = await enquiry(
    ctx(formPost({ form: 'contact', name: 'Sam', email: 'sam@example.org' })),
  );
  assert.equal(contact.headers.get('Location'), '/contact/thanks/');
});

test('no-JavaScript path: error page lists the problems, escaped', async () => {
  const response = await enquiry(ctx(formPost({ form: 'contact', name: '', email: 'nope' })));
  assert.equal(response.status, 422);
  assert.match(response.headers.get('Content-Type')!, /^text\/html/);
  const html = await response.text();
  assert.match(html, /<li>Enter your name so we know who we’re speaking to\.<\/li>/);
  assert.match(html, /<li>That email address doesn’t look quite right\.<\/li>/);
  assert.match(html, /<a href="\/contact\/">/);

  const honeypot = await enquiry(
    ctx(formPost({ form: 'contact', name: 'S', tel: '1', website: 'x' })),
  );
  assert.equal(honeypot.status, 303);
  resendStatus = 500;
  const failed = await enquiry(ctx(formPost({ form: 'contact', name: 'S', tel: '1' })));
  assert.equal(failed.status, 502);
  assert.equal(emails.length, 0);
});

test('download: refuses keys outside uploads/ and missing files', async () => {
  const { signFileLink } = await import('../src/lib/server/hmac.ts');
  const exp = Math.floor(Date.now() / 1000) + 60;
  const outside = 'secrets/2026-10/x/a.pdf';
  const sig = await signFileLink(env.FILE_LINK_SECRET!, outside, exp);
  const r = await download(
    ctx(new Request(`${ORIGIN}/files/${outside}?exp=${exp}&sig=${sig}`), {
      key: outside.split('/'),
    }),
  );
  assert.equal(r.status, 403);

  const gone = 'uploads/2026-10/0b0e7a52-6c1e-4b7e-9d43-1f2a3b4c5d6e/x-a.pdf';
  const sig2 = await signFileLink(env.FILE_LINK_SECRET!, gone, exp);
  const r2 = await download(
    ctx(new Request(`${ORIGIN}/files/${gone}?exp=${exp}&sig=${sig2}`), { key: gone.split('/') }),
  );
  assert.equal(r2.status, 404);
});
