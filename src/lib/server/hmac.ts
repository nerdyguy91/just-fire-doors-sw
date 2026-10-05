/**
 * HMAC-SHA256 signing for upload sessions and download links (Web Crypto, so the same code runs
 * in Workers and in `node --test`). Verification uses crypto.subtle.verify, which compares in
 * constant time.
 *
 * Session tokens and file links are signed with the same secret but different prefixes, so a
 * signature for one can never be replayed as the other.
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(text)) return null;
  try {
    const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

const importKey = (secret: string) =>
  crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);

export async function sign(secret: string, data: string): Promise<string> {
  const signature = await crypto.subtle.sign('HMAC', await importKey(secret), encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

export async function verify(secret: string, data: string, signature: string): Promise<boolean> {
  const bytes = fromBase64Url(signature);
  if (!bytes) return false;
  return crypto.subtle.verify('HMAC', await importKey(secret), bytes, encoder.encode(data));
}

/* Upload sessions --------------------------------------------------------------------------- */

export interface Session {
  /** Session id: the folder its uploads are stored under. */
  sid: string;
  /** Month the session started (yyyy-mm): the first part of its storage path. */
  ym: string;
  /** Most files the session may upload. */
  max: number;
  /** Expiry, Unix milliseconds. */
  exp: number;
}

export async function createSessionToken(secret: string, session: Session): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify(session)));
  return `${payload}.${await sign(secret, `session:${payload}`)}`;
}

/** The session, or null when the token is malformed, tampered with or expired. */
export async function readSessionToken(
  secret: string,
  token: unknown,
  now = Date.now(),
): Promise<Session | null> {
  if (typeof token !== 'string') return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined) return null;
  if (!(await verify(secret, `session:${payload}`, signature))) return null;
  try {
    const bytes = fromBase64Url(payload);
    const session = JSON.parse(decoder.decode(bytes!)) as Session;
    return session.exp > now ? session : null;
  } catch {
    return null;
  }
}

/* Download links ---------------------------------------------------------------------------- */

/** Signature for a download link to `key` that expires at `exp` (Unix seconds). */
export const signFileLink = (secret: string, key: string, exp: number) =>
  sign(secret, `file:${key}:${exp}`);

export async function verifyFileLink(
  secret: string,
  key: string,
  exp: unknown,
  signature: unknown,
  now = Date.now(),
): Promise<boolean> {
  if (typeof exp !== 'string' || typeof signature !== 'string' || !/^\d{1,12}$/.test(exp)) {
    return false;
  }
  // Verify first, then check expiry, so timing doesn't reveal which check failed.
  const valid = await verify(secret, `file:${key}:${exp}`, signature);
  return valid && Number(exp) * 1000 > now;
}
