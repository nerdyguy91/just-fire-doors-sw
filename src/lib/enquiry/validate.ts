/**
 * Enquiry validation, shared by the browser (src/scripts/forms.ts) and the server function
 * (functions/api/enquiry.ts, step 10) so both give the same messages.
 *
 * Rules (plan section 9):
 *   - name is required
 *   - at least one of email or telephone is required (the "not sure" quote route has a single
 *     combined contact field instead)
 *   - email format is checked
 *   - every field has a length cap
 *   - only the fields of the chosen form and route are accepted; anything else is dropped
 *
 * Messages are the prototype's. The length and route messages are new (the prototype had no caps).
 */
import { fieldsFor, maxLength, type FormId } from './fields.ts';

export type { FormId };

export interface ValidationResult {
  /** Trimmed values for the accepted fields only. Empty fields are left out. */
  values: Record<string, string>;
  /** Field id → message, in field order. Empty when valid. */
  errors: Record<string, string>;
}

const messages = {
  contact: {
    name: 'Enter your name so we know who we’re speaking to.',
    reply: 'Enter an email address we can use to contact you — or a telephone number instead.',
  },
  quote: {
    name: 'Please tell us your name.',
    reply: 'Please give us an email or a telephone number — one is enough.',
  },
  combined: 'Please give us an email or telephone number so we can reply.',
  email: 'That email address doesn’t look quite right.',
  route: 'Choose what you need help with.',
  tooLong: (max: number) => `Please shorten this to ${max} characters or fewer.`,
};

/** Deliberately loose, as in the prototype: something@something.something */
export const looksLikeEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

export function validateEnquiry(
  form: unknown,
  route: unknown,
  raw: Record<string, unknown>,
): ValidationResult {
  const fields = fieldsFor(form, route);
  if (!fields) return { values: {}, errors: { route: messages.route } };
  const copy = messages[form as FormId];

  const values: Record<string, string> = {};
  const tooLong: Record<string, string> = {};
  for (const field of fields) {
    const input = raw[field.id];
    let value = typeof input === 'string' ? input.trim() : '';
    // A choice that isn't one of the options is treated as not answered.
    if (field.options && !field.options.includes(value)) value = '';
    if (!value) continue;
    values[field.id] = value;
    const max = maxLength(field);
    if (max && value.length > max) tooLong[field.id] = messages.tooLong(max);
  }

  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.id];
    if (field.id === 'name' && !value) errors.name = copy.name;
    else if (field.id === 'contact' && !value) errors.contact = messages.combined;
    else if (field.id === 'email') {
      // The message for the pair sits on the email field, as in the prototype.
      if (!value && !values.tel) errors.email = copy.reply;
      else if (value && !looksLikeEmail(value)) errors.email = messages.email;
    }
    if (!errors[field.id] && tooLong[field.id]) errors[field.id] = tooLong[field.id];
  }

  return { values, errors };
}

/** Text for the error summary above the form. */
export function errorSummary(form: FormId, count: number): string {
  const things = count === 1 ? 'One thing needs' : `${count} things need`;
  if (form === 'contact') {
    return `${things} fixing before we can send this. Everything you’ve typed is still here.`;
  }
  const where = count === 1 ? 'field' : 'fields';
  return `${things} fixing before we can send this — see the highlighted ${where}.`;
}
