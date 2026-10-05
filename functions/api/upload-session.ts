/**
 * POST /api/upload-session  { turnstileToken, fileCount }  →  { token }
 *
 * Verifies Turnstile once, then issues a signed, 30-minute session that /api/upload and
 * /api/enquiry accept. Sent for every JavaScript submission, with or without files.
 */
import { SESSION_TTL_MS, settings, signingSecret, type Context } from '../../src/lib/server/env.ts';
import { yearMonth } from '../../src/lib/server/files.ts';
import { createSessionToken } from '../../src/lib/server/hmac.ts';
import { fail, json } from '../../src/lib/server/respond.ts';
import { verifyTurnstile } from '../../src/lib/server/turnstile.ts';

const MAX_BODY = 2048;

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const secret = signingSecret(env);
  if (!secret) {
    console.error('upload-session: FILE_LINK_SECRET is not set or is shorter than 32 characters');
    return fail(500, 'config');
  }

  const text = await request.text();
  if (text.length > MAX_BODY) return fail(413, 'too-large');
  let body: { turnstileToken?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, 'bad-request');
  }

  const ip = request.headers.get('CF-Connecting-IP');
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, body?.turnstileToken, ip))) {
    return fail(403, 'turnstile');
  }

  const now = new Date();
  const token = await createSessionToken(secret, {
    sid: crypto.randomUUID(),
    ym: yearMonth(now),
    max: settings(env).maxFiles,
    exp: now.getTime() + SESSION_TTL_MS,
  });
  return json({ token });
}
