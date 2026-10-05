/**
 * Upload rules shared by the browser (checked before anything is sent) and the upload function
 * (functions/api/upload.ts, step 10). Limits are the plan's defaults (Decision 5); the server
 * reads its own limits from UPLOAD_MAX_FILE_MB and UPLOAD_MAX_FILES, which must match.
 */
export const uploadLimits = {
  maxFileBytes: 50 * 1024 * 1024,
  maxFiles: 10,
};

/** Allowed extensions and the MIME types browsers report for them. */
export const allowedUploads: Record<string, string[]> = {
  pdf: ['application/pdf'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  csv: ['text/csv', 'application/csv', 'text/plain', 'application/vnd.ms-excel'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  heic: ['image/heic', 'image/heif'],
};

/** Value for <input type="file" accept>. */
export const acceptAttribute = Object.keys(allowedUploads)
  .map((ext) => `.${ext}`)
  .join(',');

/** Lower-case extension without the dot, or '' when the name has none. */
export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export type UploadCheck = 'ok' | 'empty' | 'too-large' | 'type';

/**
 * Check one file. The extension must be on the allowlist. The MIME type must match it too, unless
 * the browser didn't supply one (common for HEIC and CSV), in which case the extension decides.
 */
export function checkUpload(
  file: { name: string; size: number; type?: string },
  maxBytes = uploadLimits.maxFileBytes,
): UploadCheck {
  const mimes = allowedUploads[fileExtension(file.name)];
  if (!mimes) return 'type';
  const mime = (file.type ?? '').split(';')[0].trim().toLowerCase();
  if (mime && mime !== 'application/octet-stream' && !mimes.includes(mime)) return 'type';
  if (file.size <= 0) return 'empty';
  if (file.size > maxBytes) return 'too-large';
  return 'ok';
}

/** "4.2 MB" / "86 KB", as in the prototype's file rows. */
export function formatSize(bytes: number): string {
  return bytes > 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** File-type badge text: "PDF", "XLSX", or "FILE" when there is no extension. */
export function fileBadge(name: string): string {
  return fileExtension(name).toUpperCase().slice(0, 4) || 'FILE';
}
