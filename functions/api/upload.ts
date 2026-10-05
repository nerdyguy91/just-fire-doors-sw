/**
 * PUT /api/upload?session=…   body: one file   →  { key, name, size }
 * Headers: X-Filename (URI-encoded), Content-Type, Content-Length.
 *
 * Streams the file into the private R2 bucket. The body is never buffered: FixedLengthStream
 * gives R2 the length up front, so memory stays flat for a 50 MB file.
 */
import { settings, signingSecret, type Context } from '../../src/lib/server/env.ts';
import { checkUpload, objectKey, sessionPrefix } from '../../src/lib/server/files.ts';
import { readSessionToken } from '../../src/lib/server/hmac.ts';
import { fail, json } from '../../src/lib/server/respond.ts';

declare const FixedLengthStream: new (length: number) => TransformStream<Uint8Array, Uint8Array>;

export async function onRequestPut({ request, env }: Context): Promise<Response> {
  const secret = signingSecret(env);
  if (!secret) return fail(500, 'config');

  const session = await readSessionToken(secret, new URL(request.url).searchParams.get('session'));
  if (!session) return fail(401, 'session');

  const lengthHeader = request.headers.get('Content-Length') ?? '';
  if (!/^\d+$/.test(lengthHeader)) return fail(411, 'length-required');
  const size = Number(lengthHeader);

  let name: string;
  try {
    name = decodeURIComponent(request.headers.get('X-Filename') ?? '').slice(0, 255);
  } catch {
    return fail(400, 'bad-filename');
  }
  const type = request.headers.get('Content-Type') ?? '';

  const { maxFileBytes } = settings(env);
  const check = checkUpload({ name, size, type }, maxFileBytes);
  if (check === 'too-large') return fail(413, 'too-large');
  if (check === 'type') return fail(415, 'type');
  if (check === 'empty' || !request.body) return fail(400, 'empty');

  // Count what this session has already stored. One more than the limit is enough to know.
  const stored = await env.UPLOADS.list({ prefix: sessionPrefix(session), limit: session.max + 1 });
  if (stored.objects.length >= session.max) return fail(409, 'too-many');

  const key = objectKey(session, crypto.randomUUID(), name);
  try {
    await env.UPLOADS.put(key, request.body.pipeThrough(new FixedLengthStream(size)), {
      httpMetadata: { contentType: type.split(';')[0].trim() || 'application/octet-stream' },
      // Metadata values must be ASCII, so the original name is stored URI-encoded.
      customMetadata: { originalName: encodeURIComponent(name), sessionId: session.sid },
    });
  } catch {
    // The body was shorter or longer than Content-Length, or the connection dropped.
    console.error('upload: storing the file failed');
    return fail(400, 'upload-failed');
  }
  return json({ key, name, size });
}
