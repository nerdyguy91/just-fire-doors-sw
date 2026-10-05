/**
 * GET /files/{key}?exp={unix seconds}&sig={signature}
 *
 * Download for the links in the enquiry email. The bucket is private; this is the only way to
 * read a file, and only with an unexpired, correctly signed link. Always served as a download.
 */
import { signingSecret, type Context } from '../../src/lib/server/env.ts';
import { contentDisposition, isUploadKey } from '../../src/lib/server/files.ts';
import { verifyFileLink } from '../../src/lib/server/hmac.ts';

const refuse = (status: number, message: string) =>
  new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });

export async function onRequestGet({ request, env, params }: Context): Promise<Response> {
  const secret = signingSecret(env);
  if (!secret) return refuse(500, 'Downloads are not configured.');

  const segments = params.key;
  const key = Array.isArray(segments) ? segments.join('/') : (segments ?? '');
  const query = new URL(request.url).searchParams;
  const allowed =
    isUploadKey(key) && (await verifyFileLink(secret, key, query.get('exp'), query.get('sig')));
  if (!allowed) return refuse(403, 'This download link is not valid or has expired.');

  const object = await env.UPLOADS.get(key);
  if (!object) return refuse(404, 'This file is no longer available.');

  let name = key.slice(key.lastIndexOf('/') + 1);
  try {
    name = decodeURIComponent(object.customMetadata?.originalName ?? '') || name;
  } catch {
    // Keep the stored name.
  }
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Content-Length': String(object.size),
      'Content-Disposition': contentDisposition(name),
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
