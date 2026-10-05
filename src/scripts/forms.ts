/**
 * Enquiry forms enhancement (contact and get-a-quote). Progressive: without JS both forms post to
 * /api/enquiry and the quote router works with CSS (see QuoteForm.astro).
 *
 * - Quote router: shows the chosen route's form, and opens a route from the URL hash
 *   (#survey, #backlog, #inspection, #maintenance, #not-sure, or the prototype's #route-a…e).
 * - Validation with the rules shared with the server (src/lib/enquiry/validate.ts): inline
 *   errors, an error summary, focus on the first field to fix.
 * - Files: chosen or dropped files are listed, with size and type checks before anything is sent.
 * - Sending (plan section 9): upload session (Turnstile-verified) → each file by XHR with real
 *   progress → the enquiry as JSON. Then the in-page success state, with focus on its heading.
 * - Turnstile loads when a form is first focused.
 * - Analytics events (src/scripts/track.ts): sent only if the visitor accepted analytics.
 */
import { checkUpload, fileBadge, formatSize, uploadLimits } from '../lib/enquiry/uploads';
import { errorSummary, validateEnquiry, type FormId } from '../lib/enquiry/validate';
import { fileTone } from '../lib/tones';
import { track } from './track';

const API = { session: '/api/upload-session', upload: '/api/upload' };
/** Server sessions last 30 minutes; start a fresh one after 25. */
const SESSION_REUSE_MS = 25 * 60 * 1000;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_WAIT_MS = 15000;

interface Turnstile {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(widget: string): void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

type FileState = 'ready' | 'rejected' | 'uploading' | 'uploaded' | 'failed';

interface PickedFile {
  file: File;
  row: HTMLElement;
  state: FileState;
  /** Storage key, once uploaded. */
  key?: string;
}

interface Enquiry {
  form: HTMLFormElement;
  kind: FormId;
  route?: string;
  /** True after the first attempt to send: errors then update as the visitor types. */
  tried: boolean;
  busy: boolean;
  files: PickedFile[];
  session?: { token: string; at: number };
  widget?: string;
  token?: string;
  waiting: ((token: string) => void)[];
}

interface Sent {
  values: Record<string, string>;
  files: string[];
}

const fileStatus: Record<FileState, string> = {
  ready: 'Ready',
  rejected: 'Not accepted',
  uploading: 'Uploading…',
  uploaded: 'Uploaded',
  failed: 'Failed',
};
const rejection = {
  'too-large': 'Too large',
  type: 'File type not accepted',
  empty: 'Empty file',
  'too-many': 'Too many files',
};

/* ---------------------------------------------------------------------------------------------
 * Validation display
 * ------------------------------------------------------------------------------------------- */

function setAlert(enquiry: Enquiry, text: string | null) {
  const alert = enquiry.form.querySelector<HTMLElement>('[data-form-alert]');
  if (!alert) return;
  alert.textContent = text ?? '';
  alert.hidden = !text;
}

function showErrors(enquiry: Enquiry, errors: Record<string, string>) {
  let count = 0;
  enquiry.form.querySelectorAll<HTMLElement>('[data-field]').forEach((wrapper) => {
    const control = wrapper.querySelector<HTMLElement>('.field__control');
    const line = wrapper.querySelector<HTMLElement>('[data-error]');
    if (!control || !line) return;
    const message = errors[wrapper.dataset.field ?? ''];
    if (message) count += 1;

    line.querySelector('[data-error-text]')!.textContent = message ?? '';
    line.hidden = !message;
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');

    const described = (control.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .filter((id) => id && id !== line.id);
    if (message) described.push(line.id);
    if (described.length) control.setAttribute('aria-describedby', described.join(' '));
    else control.removeAttribute('aria-describedby');
  });
  setAlert(enquiry, count ? errorSummary(enquiry.kind, count) : null);
  return count;
}

function focusFirstInvalid(form: HTMLFormElement) {
  form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
}

function readValues(form: HTMLFormElement): Record<string, string> {
  const values: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') values[key] = value;
  });
  return values;
}

/* ---------------------------------------------------------------------------------------------
 * Files
 * ------------------------------------------------------------------------------------------- */

function setFileState(picked: PickedFile, state: FileState, label = fileStatus[state]) {
  picked.state = state;
  picked.row.dataset.state = state;
  picked.row.querySelector('[data-file-status]')!.textContent = label;
  setFileProgress(picked, state === 'uploading' ? 0 : 1);
}

function setFileProgress(picked: PickedFile, fraction: number) {
  const bar = picked.row.querySelector<HTMLElement>('[data-file-bar]')!;
  bar.style.width = `${Math.round(fraction * 100)}%`;
}

function addFiles(enquiry: Enquiry, field: HTMLElement, list: FileList | null | undefined) {
  const template = field.querySelector('template');
  const rows = field.querySelector<HTMLElement>('[data-file-list]');
  if (!template || !rows || enquiry.busy) return;

  for (const file of Array.from(list ?? [])) {
    const row = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const badge = fileBadge(file.name);
    const ext = row.querySelector<HTMLElement>('[data-file-ext]')!;
    ext.textContent = badge;
    ext.style.background = fileTone(badge);
    row.querySelector('[data-file-name]')!.textContent = file.name;
    row.querySelector('[data-file-size]')!.textContent = formatSize(file.size);

    const picked: PickedFile = { file, row, state: 'ready' };
    const check = checkUpload(file);
    const accepted = enquiry.files.filter((f) => f.state !== 'rejected').length;
    if (check !== 'ok') setFileState(picked, 'rejected', rejection[check]);
    else if (accepted >= uploadLimits.maxFiles) {
      setFileState(picked, 'rejected', rejection['too-many']);
    } else setFileState(picked, 'ready');

    const remove = row.querySelector<HTMLButtonElement>('[data-file-remove]')!;
    remove.setAttribute('aria-label', `Remove ${file.name}`);
    remove.addEventListener('click', () => {
      if (enquiry.busy) return;
      enquiry.files = enquiry.files.filter((f) => f !== picked);
      row.remove();
      field.querySelector<HTMLInputElement>('input[type="file"]')?.focus();
    });

    enquiry.files.push(picked);
    rows.append(row);
  }
}

function setupUploads(enquiry: Enquiry) {
  enquiry.form.querySelectorAll<HTMLElement>('[data-upload]').forEach((field) => {
    const input = field.querySelector<HTMLInputElement>('input[type="file"]');
    const zone = field.querySelector<HTMLElement>('[data-dropzone]');
    if (!input || !zone) return;

    input.addEventListener('change', () => {
      addFiles(enquiry, field, input.files);
      // The list above is the record of what was chosen; clear the input so the same file can
      // be chosen again after removing it.
      input.value = '';
    });
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('is-drag');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-drag'));
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('is-drag');
      addFiles(enquiry, field, event.dataTransfer?.files);
    });
  });
}

function uploadFile(session: string, picked: PickedFile) {
  setFileState(picked, 'uploading');
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fail = () => {
      setFileState(picked, 'failed');
      reject(new Error('upload'));
    };
    xhr.open('PUT', `${API.upload}?session=${encodeURIComponent(session)}`);
    xhr.responseType = 'json';
    // Header values must be ASCII; the function decodes the name.
    xhr.setRequestHeader('X-Filename', encodeURIComponent(picked.file.name));
    xhr.setRequestHeader('Content-Type', picked.file.type || 'application/octet-stream');
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setFileProgress(picked, event.loaded / event.total);
    };
    xhr.onload = () => {
      const key = xhr.response?.key;
      if (xhr.status !== 200 || typeof key !== 'string') return fail();
      picked.key = key;
      setFileState(picked, 'uploaded');
      resolve();
    };
    xhr.onerror = fail;
    xhr.onabort = fail;
    xhr.send(picked.file);
  });
}

/* ---------------------------------------------------------------------------------------------
 * Turnstile
 * ------------------------------------------------------------------------------------------- */

let turnstileScript: Promise<void> | undefined;

function loadTurnstile() {
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('turnstile'));
    document.head.append(script);
  });
  return turnstileScript;
}

const siteKey = (enquiry: Enquiry) =>
  enquiry.form.querySelector<HTMLElement>('[data-turnstile]')?.dataset.sitekey;

function mountTurnstile(enquiry: Enquiry) {
  const box = enquiry.form.querySelector<HTMLElement>('[data-turnstile]');
  const sitekey = siteKey(enquiry);
  if (!box || !sitekey || box.dataset.mounted) return;
  box.dataset.mounted = 'true';
  loadTurnstile()
    .then(() => {
      enquiry.widget = window.turnstile?.render(box, {
        sitekey,
        appearance: 'interaction-only',
        callback: (token: string) => {
          enquiry.token = token;
          enquiry.waiting.splice(0).forEach((resolve) => resolve(token));
        },
        'expired-callback': () => (enquiry.token = undefined),
        'error-callback': () => (enquiry.token = undefined),
      });
    })
    // Blocked or offline: the server refuses the session and the visitor sees the send error.
    .catch(() => {});
}

/** A fresh Turnstile token, or '' when there is no site key (local dev) or the check timed out. */
function turnstileToken(enquiry: Enquiry): Promise<string> {
  if (!siteKey(enquiry)) return Promise.resolve('');
  mountTurnstile(enquiry);
  const used = () => {
    enquiry.token = undefined;
    if (enquiry.widget !== undefined) window.turnstile?.reset(enquiry.widget);
  };
  if (enquiry.token) {
    const token = enquiry.token;
    used();
    return Promise.resolve(token);
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(''), TURNSTILE_WAIT_MS);
    enquiry.waiting.push((token) => {
      clearTimeout(timer);
      used();
      resolve(token);
    });
  });
}

/* ---------------------------------------------------------------------------------------------
 * Sending
 * ------------------------------------------------------------------------------------------- */

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(body),
});

async function openSession(enquiry: Enquiry, fileCount: number) {
  const current = enquiry.session;
  if (current && Date.now() - current.at < SESSION_REUSE_MS) return current.token;

  // Files uploaded under an earlier session can't be attached to a new one.
  enquiry.files.forEach((f) => delete f.key);
  const check = await turnstileToken(enquiry);
  const response = await fetch(API.session, json({ turnstileToken: check, fileCount }));
  const token = response.ok ? (await response.json()).token : undefined;
  if (typeof token !== 'string') throw new Error('session');
  enquiry.session = { token, at: Date.now() };
  return token;
}

function setBusy(enquiry: Enquiry, busy: boolean) {
  enquiry.busy = busy;
  const button = enquiry.form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!button) return;
  button.dataset.label ??= button.textContent ?? '';
  button.textContent = busy ? 'Sending…' : button.dataset.label;
  button.setAttribute('aria-disabled', String(busy));
}

function resetEnquiry(enquiry: Enquiry) {
  enquiry.form.reset();
  enquiry.files.forEach((f) => f.row.remove());
  enquiry.files = [];
  enquiry.tried = false;
  enquiry.session = undefined;
  showErrors(enquiry, {});
  stamp(enquiry.form);
}

async function send(enquiry: Enquiry, onSent: (sent: Sent) => void) {
  const raw = readValues(enquiry.form);
  const { values, errors } = validateEnquiry(enquiry.kind, enquiry.route, raw);
  enquiry.tried = true;
  const event = { form: enquiry.kind, route: enquiry.route };
  if (showErrors(enquiry, errors)) {
    track('form_submit_error', { ...event, type: 'validation' });
    return focusFirstInvalid(enquiry.form);
  }

  setBusy(enquiry, true);
  try {
    const files = enquiry.files.filter((f) => f.state !== 'rejected');
    const session = await openSession(enquiry, files.length);
    for (const picked of files) {
      if (!picked.key) await uploadFile(session, picked);
    }
    const response = await fetch(
      enquiry.form.action,
      json({
        form: enquiry.kind,
        route: enquiry.route,
        fields: values,
        session,
        files: files.map((f) => f.key),
        website: raw.website ?? '',
        ts: raw.ts ?? '',
        page: location.pathname,
      }),
    );
    if (response.status === 422) {
      // The server uses the same rules, so this is rare (a stale page, say).
      const body = await response.json().catch(() => null);
      if (body?.errors && showErrors(enquiry, body.errors)) return focusFirstInvalid(enquiry.form);
    }
    if (!response.ok) throw new Error('enquiry');

    const sent = { values, files: files.map((f) => f.file.name) };
    resetEnquiry(enquiry);
    onSent(sent);
    track('form_submit_success', event);
  } catch {
    track('form_submit_error', { ...event, type: 'server' });
    setAlert(enquiry, enquiry.form.dataset.errorMessage ?? '');
    enquiry.form.querySelector('[data-form-alert]')?.scrollIntoView({ block: 'center' });
  } finally {
    setBusy(enquiry, false);
  }
}

/** Record when the form was ready, for the server's minimum fill time check. */
function stamp(form: HTMLFormElement) {
  const ts = form.elements.namedItem('ts');
  if (ts instanceof HTMLInputElement) ts.value = String(Date.now());
}

function setupForm(form: HTMLFormElement, onSent: (sent: Sent) => void) {
  const enquiry: Enquiry = {
    form,
    kind: form.dataset.enquiry as FormId,
    route: form.dataset.route,
    tried: false,
    busy: false,
    files: [],
    waiting: [],
  };
  // Validation messages come from the shared rules, not the browser's own bubbles.
  form.noValidate = true;
  stamp(form);
  setupUploads(enquiry);

  form.addEventListener('focusin', () => mountTurnstile(enquiry), { once: true });
  form.addEventListener('input', () => {
    if (!enquiry.tried) return;
    showErrors(enquiry, validateEnquiry(enquiry.kind, enquiry.route, readValues(form)).errors);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!enquiry.busy) void send(enquiry, onSent);
  });
}

function reveal(success: HTMLElement) {
  success.hidden = false;
  success.querySelector<HTMLElement>('[data-success-heading]')?.focus({ preventScroll: true });
  success.scrollIntoView({ block: 'start' });
}

/* ---------------------------------------------------------------------------------------------
 * Contact form
 * ------------------------------------------------------------------------------------------- */

function setupContact(form: HTMLFormElement) {
  const success = form.parentElement?.querySelector<HTMLElement>('[data-success]');
  if (!success) return;
  setupForm(form, () => {
    form.hidden = true;
    reveal(success);
  });
  success.querySelector('[data-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLElement>('.field__control')?.focus();
  });
}

/* ---------------------------------------------------------------------------------------------
 * Quote router
 * ------------------------------------------------------------------------------------------- */

function setupRouter(router: HTMLElement) {
  const radios = Array.from(router.querySelectorAll<HTMLInputElement>('input[name="route"]'));
  const panels = Array.from(router.querySelectorAll<HTMLElement>('[data-route-panel]'));
  const success = router.querySelector<HTMLElement>('[data-success]');
  const activePanel = () => panels.find((p) => p.classList.contains('is-active'));

  const sync = () => {
    const route = radios.find((r) => r.checked)?.value;
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.routePanel === route));
    router.classList.toggle('has-route', Boolean(route));
    if (route && success) {
      success.hidden = true;
      router.classList.remove('is-sent');
    }
    return route;
  };
  /** Keep the URL in step with the chosen route, so links to a route (#survey…) always act. */
  const setHash = (route?: string) =>
    history.replaceState(null, '', route ? `#${route}` : location.pathname + location.search);

  const openFromHash = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    const radio = radios.find((r) => r.value === hash || r.dataset.legacy === hash);
    if (!radio) return;
    radio.checked = true;
    sync();
    activePanel()?.scrollIntoView({ block: 'start' });
  };

  // Scroll to the form when a card is chosen by pointer. Arrow keys move through the cards
  // without scrolling away from them.
  let byPointer = false;
  router.addEventListener('pointerdown', () => (byPointer = true));
  router.addEventListener('keydown', () => (byPointer = false));
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      setHash(sync());
      track('quote_route_selected', { route: radio.value });
    });
    // A click on a card (including the one already chosen) arrives before `change`.
    radio.addEventListener('click', () => {
      sync();
      if (byPointer) activePanel()?.scrollIntoView({ block: 'start' });
    });
  });

  panels.forEach((panel) => {
    const form = panel.querySelector<HTMLFormElement>('form[data-enquiry]');
    if (!form || !success) return;
    setupForm(form, ({ values, files }) => {
      const receipt: Record<string, string> = {
        route: form.dataset.routeTitle ?? '',
        from: [values.name, values.org].filter(Boolean).join(', ') || '—',
        reply: values.email || values.tel || values.contact || '—',
        where: values.where || 'Not given',
        files: files.length ? files.join(', ') : 'None — that’s fine',
      };
      success.querySelectorAll<HTMLElement>('[data-receipt]').forEach((cell) => {
        cell.textContent = receipt[cell.dataset.receipt ?? ''] ?? '';
      });
      radios.forEach((r) => (r.checked = false));
      setHash(sync());
      router.classList.add('is-sent');
      reveal(success);
    });
  });

  success?.querySelector('[data-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    router.classList.remove('is-sent');
    radios[0]?.focus({ preventScroll: true });
    router.scrollIntoView({ block: 'start' });
  });

  window.addEventListener('hashchange', openFromHash);
  sync();
  openFromHash();
}

document
  .querySelectorAll<HTMLFormElement>('form[data-enquiry="contact"]')
  .forEach((form) => setupContact(form));
document.querySelectorAll<HTMLElement>('[data-router]').forEach((router) => setupRouter(router));
