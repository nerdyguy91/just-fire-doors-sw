/**
 * Types and settings for the Cloudflare Pages Functions (functions/). Only the parts of the
 * Workers runtime the functions use are declared here, so no types package is needed.
 */
import { uploadLimits } from '../enquiry/uploads.ts';

export interface StoredObject {
  size: number;
  httpMetadata?: { contentType?: string };
  customMetadata?: Record<string, string>;
}
export interface StoredObjectBody extends StoredObject {
  body: ReadableStream;
}
/** The R2 bucket binding (private bucket for enquiry uploads). */
export interface Bucket {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | string,
    options?: {
      httpMetadata?: { contentType?: string };
      customMetadata?: Record<string, string>;
    },
  ): Promise<unknown>;
  get(key: string): Promise<StoredObjectBody | null>;
  head(key: string): Promise<StoredObject | null>;
  list(options: { prefix: string; limit?: number }): Promise<{ objects: { key: string }[] }>;
}

export interface Env {
  UPLOADS: Bucket;
  FORM_TO_EMAIL?: string;
  FORM_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
  /** Local testing only: send email to a mock endpoint instead of Resend. */
  RESEND_API_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
  FILE_LINK_SECRET?: string;
  FILE_LINK_TTL_DAYS?: string;
  UPLOAD_MAX_FILE_MB?: string;
  UPLOAD_MAX_FILES?: string;
}

export interface Context {
  request: Request;
  env: Env;
  params: Record<string, string | string[] | undefined>;
}

/** Upload sessions last 30 minutes (plan section 9). */
export const SESSION_TTL_MS = 30 * 60 * 1000;
/** Uploaded files are deleted by the bucket's lifecycle rule after this many days. */
export const RETENTION_DAYS = 90;

const positive = (value: string | undefined, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function settings(env: Env) {
  return {
    maxFileBytes: positive(env.UPLOAD_MAX_FILE_MB, uploadLimits.maxFileBytes / 1048576) * 1048576,
    maxFiles: Math.min(
      Math.floor(positive(env.UPLOAD_MAX_FILES, uploadLimits.maxFiles)),
      uploadLimits.maxFiles,
    ),
    linkTtlDays: positive(env.FILE_LINK_TTL_DAYS, 30),
  };
}

/** The signing secret, or null when it is missing or too short to be safe. */
export const signingSecret = (env: Env) =>
  env.FILE_LINK_SECRET && env.FILE_LINK_SECRET.length >= 32 ? env.FILE_LINK_SECRET : null;
