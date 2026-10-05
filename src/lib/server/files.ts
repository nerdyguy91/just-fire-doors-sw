/**
 * Storage keys and filenames for uploaded files. The type and size rules are shared with the
 * browser (src/lib/enquiry/uploads.ts).
 *
 * Key format: uploads/{yyyy-mm}/{sessionId}/{uuid}-{name}
 */
import { fileExtension } from '../enquiry/uploads.ts';
import type { Session } from './hmac.ts';

export { checkUpload } from '../enquiry/uploads.ts';

/** ASCII kebab-case filename, at most 100 characters, keeping the extension. */
export function sanitiseFilename(name: string): string {
  const raw = fileExtension(name);
  const ext = /^[a-z0-9]{1,10}$/.test(raw) ? raw : '';
  const stem = (ext ? name.slice(0, name.lastIndexOf('.')) : name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7e]/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = ext ? `.${ext}` : '';
  return `${(stem || 'file').slice(0, 100 - suffix.length).replace(/-+$/, '')}${suffix}`;
}

export const yearMonth = (date: Date) => date.toISOString().slice(0, 7);

/** Folder holding everything one session uploaded. */
export const sessionPrefix = (session: Pick<Session, 'sid' | 'ym'>) =>
  `uploads/${session.ym}/${session.sid}/`;

/** Marker written once a session has sent its enquiry. Under uploads/, so it expires with them. */
export const sessionMarker = (session: Pick<Session, 'sid' | 'ym'>) =>
  `uploads/${session.ym}/${session.sid}.sent`;

export const objectKey = (session: Pick<Session, 'sid' | 'ym'>, uuid: string, name: string) =>
  `${sessionPrefix(session)}${uuid}-${sanitiseFilename(name)}`;

/** True when `key` is a file directly inside the session's folder. */
export function keyBelongsToSession(key: unknown, session: Pick<Session, 'sid' | 'ym'>): boolean {
  if (typeof key !== 'string') return false;
  const prefix = sessionPrefix(session);
  const rest = key.slice(prefix.length);
  return key.startsWith(prefix) && /^[a-z0-9.-]+$/.test(rest) && !rest.includes('..');
}

/** Shape of any valid upload key, for the download function. */
export const isUploadKey = (key: string) =>
  /^uploads\/\d{4}-\d{2}\/[a-f0-9-]{36}\/[a-z0-9.-]+$/.test(key) && !key.includes('..');

/** Content-Disposition for a download, safe for any original filename. */
export function contentDisposition(originalName: string): string {
  const fallback = sanitiseFilename(originalName);
  const encoded = encodeURIComponent(originalName).replace(/['()*]/g, (c) => {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  });
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
