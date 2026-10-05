/**
 * POST /api/enquiry
 *
 * JavaScript path: JSON { form, route, fields, session, files, website, ts, page }
 *   → 200 { ok: true } | 422 { ok: false, errors } | 4xx/5xx { ok: false, error }
 * No-JavaScript path: a plain form post (urlencoded; no files, no Turnstile)
 *   → 303 to the thanks page, or a small HTML page listing what to fix.
 *
 * Validates with the rules the browser uses, then emails the enquiry as plain text with signed,
 * expiring links to any uploaded files. Personal data is never logged.
 */
import { validateEnquiry } from '../../src/lib/enquiry/validate.ts';
import { buildEmail, replyTo, sendEmail, type EmailFile } from '../../src/lib/server/email.ts';
import { settings, signingSecret, type Context } from '../../src/lib/server/env.ts';
import { keyBelongsToSession, sessionMarker } from '../../src/lib/server/files.ts';
import { readSessionToken, signFileLink } from '../../src/lib/server/hmac.ts';
import { fail, json, messagePage, seeOther } from '../../src/lib/server/respond.ts';

const MAX_BODY = 64 * 1024;
/** A form sent sooner than this after it was ready was not filled in by a person. */
const MIN_FILL_MS = 3000;

const text = (value: unknown) => (typeof value === 'string' ? value : '');

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const url = new URL(request.url);
  const contentType = (request.headers.get('Content-Type') ?? '').split(';')[0].trim();
  const isJson = contentType === 'application/json';
  if (!isJson && contentType !== 'application/x-www-form-urlencoded') {
    return fail(415, 'content-type');
  }

  // Browsers send Origin on form posts and fetches: refuse other sites posting here.
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return fail(403, 'origin');

  const body = await request.text();
  if (body.length > MAX_BODY) return fail(413, 'too-large');

  let data: Record<string, unknown>;
  let fields: Record<string, unknown>;
  if (isJson) {
    try {
      data = JSON.parse(body);
    } catch {
      return fail(400, 'bad-request');
    }
    if (!data || typeof data !== 'object') return fail(400, 'bad-request');
    fields = data.fields && typeof data.fields === 'object' ? (data.fields as typeof fields) : {};
  } else {
    data = Object.fromEntries(new URLSearchParams(body));
    fields = data;
  }

  const form = data.form === 'contact' ? 'contact' : 'quote';
  const formPath = form === 'contact' ? '/contact/' : '/get-a-quote/';
  const done = () => (isJson ? json({ ok: true }) : seeOther(`${formPath}thanks/`));

  // Spam traps: answer as if it worked, send nothing. The fill-time check needs the timestamp
  // the browser script sets, so plain form posts (no timestamp) skip it.
  const elapsed = Date.now() - Number(text(data.ts) || NaN);
  if (text(data.website) || (elapsed >= 0 && elapsed < MIN_FILL_MS)) return done();

  const secret = signingSecret(env);
  const { maxFiles, linkTtlDays } = settings(env);
  const files: EmailFile[] = [];
  let usedSession: string | undefined;

  if (isJson) {
    if (!secret) {
      console.error('enquiry: FILE_LINK_SECRET is not set or is shorter than 32 characters');
      return fail(500, 'config');
    }
    const session = await readSessionToken(secret, data.session);
    // A session carries one Turnstile check, so it can send one enquiry.
    if (!session || (await env.UPLOADS.head(sessionMarker(session)))) return fail(401, 'session');
    usedSession = sessionMarker(session);

    const keys = Array.isArray(data.files) ? data.files : [];
    if (keys.length > Math.min(session.max, maxFiles) || new Set(keys).size !== keys.length) {
      return fail(400, 'files');
    }
    const exp = Math.floor(Date.now() / 1000) + linkTtlDays * 86400;
    for (const key of keys) {
      // Only files this session uploaded, and only ones that really exist.
      if (!keyBelongsToSession(key, session)) return fail(400, 'files');
      const stored = await env.UPLOADS.head(key);
      if (!stored) return fail(400, 'files');
      let name = key.slice(key.lastIndexOf('/') + 1);
      try {
        name = decodeURIComponent(stored.customMetadata?.originalName ?? '') || name;
      } catch {
        // Keep the stored name.
      }
      const sig = await signFileLink(secret, key, exp);
      files.push({
        name,
        size: stored.size,
        url: `${url.origin}/files/${key}?exp=${exp}&sig=${sig}`,
      });
    }
  }

  const { values, errors } = validateEnquiry(form, data.route, fields);
  if (Object.keys(errors).length) {
    return isJson
      ? fail(422, 'validation', { errors })
      : messagePage({
          status: 422,
          heading: 'A few things need fixing',
          intro: 'We couldn’t send your enquiry yet:',
          problems: Object.values(errors),
          back: formPath,
        });
  }

  const page = text(data.page).startsWith('/') ? text(data.page).slice(0, 200) : formPath;
  const email = buildEmail({
    form,
    route: text(data.route) || undefined,
    values,
    files,
    page,
    submittedAt: new Date(),
    noJs: !isJson,
    linkTtlDays,
  });

  // On failure, uploaded files stay in the bucket until the lifecycle rule removes them.
  if (!(await sendEmail(env, { ...email, replyTo: replyTo(values) }))) {
    return isJson
      ? fail(502, 'send')
      : messagePage({
          status: 502,
          heading: 'Sorry, we couldn’t send that',
          intro:
            'Something went wrong on our side and your enquiry was not sent. Please try again.',
          back: formPath,
        });
  }
  if (usedSession) await env.UPLOADS.put(usedSession, '').catch(() => {});
  return done();
}
