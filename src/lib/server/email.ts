/**
 * The enquiry email: plain text only (so nothing a visitor types can be rendered as HTML), sent
 * through the Resend API. Uploaded files are linked, never attached.
 */
import { quoteRoutes } from '../../data/quote-routes.ts';
import { fieldsFor, type FormId } from '../enquiry/fields.ts';
import { formatSize } from '../enquiry/uploads.ts';
import { RETENTION_DAYS, type Env } from './env.ts';

const RESEND_URL = 'https://api.resend.com/emails';

export interface EmailFile {
  name: string;
  size: number;
  url: string;
}

export interface EnquiryEmail {
  form: FormId;
  route?: string;
  /** Validated values (src/lib/enquiry/validate.ts). */
  values: Record<string, string>;
  files: EmailFile[];
  /** Site path the form was sent from. */
  page: string;
  submittedAt: Date;
  /** Sent as a plain form post, without the Turnstile check. */
  noJs: boolean;
  linkTtlDays: number;
}

/** One line, no control characters: safe for a subject. */
const oneLine = (text: string) =>
  text
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, 150);

/** Stricter than the form check: this value goes into a Reply-To header. */
const isHeaderSafeEmail = (value: string) =>
  value.length <= 254 &&
  /^[^\s@<>,;:"()[\]\\]+@[^\s@<>,;:"()[\]\\]+\.[^\s@<>,;:"()[\]\\]+$/.test(value);

/** The enquirer's email address, if they gave a usable one. */
export function replyTo(values: Record<string, string>): string | undefined {
  return [values.email, values.contact].find((v) => v && isHeaderSafeEmail(v));
}

const londonTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
  timeStyle: 'short',
  timeZone: 'Europe/London',
});

export function buildEmail(enquiry: EnquiryEmail): { subject: string; text: string } {
  const { form, route, values, files } = enquiry;
  const title =
    form === 'quote'
      ? (quoteRoutes.find((r) => r.id === route)?.title ?? 'Quote request')
      : 'Contact form';
  const who = values.org || values.name || 'Website enquiry';
  const subject = oneLine(`${enquiry.noJs ? '[no-JS] ' : ''}[JFD enquiry] ${title} — ${who}`);

  const lines = [`New website enquiry: ${title}`, ''];
  for (const field of fieldsFor(form, route) ?? []) {
    const value = values[field.id];
    if (!value) continue;
    // Long answers go on their own lines, indented, so they can't pass for another field.
    if (field.kind === 'area') {
      lines.push(`${field.label}:`, ...value.split(/\r?\n/).map((l) => `    ${l}`), '');
    } else lines.push(`${field.label}: ${oneLine(value)}`);
  }

  while (lines.at(-1) === '') lines.pop();
  lines.push('', '---', '');
  if (files.length) {
    lines.push(`Files (${files.length}):`);
    for (const file of files) {
      lines.push(`- ${oneLine(file.name)} (${formatSize(file.size)})`, `  ${file.url}`);
    }
    lines.push(
      '',
      `These links expire after ${enquiry.linkTtlDays} days. The files are deleted from website ` +
        `storage ${RETENTION_DAYS} days after upload, so save anything you need to keep.`,
    );
  } else lines.push('Files: none');

  lines.push(
    '',
    `Sent: ${londonTime.format(enquiry.submittedAt)} (UK time)`,
    `Page: ${oneLine(enquiry.page)}`,
  );
  if (enquiry.noJs) {
    lines.push(
      '',
      'This enquiry was sent without JavaScript, so it skipped the automated spam check and',
      'could not include files. Treat unexpected messages with care.',
    );
  }
  if (replyTo(values)) lines.push('', 'Reply to this email to answer the enquirer directly.');

  return { subject, text: lines.join('\n') };
}

/** Send through Resend. Resolves false on any failure; never throws and never logs content. */
export async function sendEmail(
  env: Env,
  message: { subject: string; text: string; replyTo?: string },
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.FORM_TO_EMAIL || !env.FORM_FROM_EMAIL) {
    console.error('enquiry email: RESEND_API_KEY, FORM_TO_EMAIL or FORM_FROM_EMAIL is not set');
    return false;
  }
  try {
    const response = await fetch(env.RESEND_API_URL || RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FORM_FROM_EMAIL,
        to: env.FORM_TO_EMAIL.split(',').map((address) => address.trim()),
        subject: message.subject,
        text: message.text,
        reply_to: message.replyTo,
      }),
    });
    if (!response.ok) console.error(`enquiry email: provider returned ${response.status}`);
    return response.ok;
  } catch {
    console.error('enquiry email: provider request failed');
    return false;
  }
}
