/**
 * Enquiry form fields: the single definition used by the form markup (ContactForm, QuoteForm),
 * the browser validation (src/scripts/forms.ts) and the server function (functions/api/enquiry.ts,
 * step 10). Labels, hints and options are the prototype's (docs/prototype/pages/contact.dc.html
 * and get-a-quote.dc.html).
 *
 * Imports use explicit .ts extensions so `node --test` can load this module without a build.
 */
import type { QuoteRouteId } from '../../data/quote-routes.ts';

export type FormId = 'contact' | 'quote';

export type FieldKind = 'text' | 'email' | 'tel' | 'area' | 'select' | 'seg' | 'upload';

export interface FieldDef {
  /** Form control name, unique within its form. */
  id: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  /** Email / telephone pair: at least one of the two is required. */
  contact?: boolean;
  /** Choices for `select` and `seg`. */
  options?: string[];
  hint?: string;
  placeholder?: string;
  autocomplete?: string;
  /** Spans the full width of the field grid. */
  wide?: boolean;
  /** Upload only: the large drop zone. */
  primary?: boolean;
}

export interface FieldSection {
  title: string;
  note?: string;
  fields: FieldDef[];
}

/** Length caps by field kind (characters). */
const maxLengths: Partial<Record<FieldKind, number>> = {
  text: 200,
  email: 254,
  tel: 40,
  area: 4000,
};
export const maxLength = (field: FieldDef) => maxLengths[field.kind];

export const contactFields: FieldDef[] = [
  { id: 'name', label: 'Name', kind: 'text', autocomplete: 'name', required: true },
  { id: 'org', label: 'Organisation', kind: 'text', autocomplete: 'organization' },
  { id: 'email', label: 'Email', kind: 'email', autocomplete: 'email', contact: true },
  { id: 'tel', label: 'Telephone', kind: 'tel', autocomplete: 'tel', contact: true },
  { id: 'site', label: 'Site / location', kind: 'text', autocomplete: 'off', wide: true },
  {
    id: 'topic',
    label: 'What would you like to discuss?',
    kind: 'select',
    wide: true,
    options: [
      'A fire-door project',
      'An existing JFD project',
      'Supplier or contractor enquiry',
      'General question',
      'Something else',
    ],
  },
  {
    id: 'msg',
    label: 'Tell us briefly what you’re dealing with',
    kind: 'area',
    wide: true,
    hint: 'Don’t worry if you don’t know exactly what service you need.',
  },
];

const details: FieldSection = {
  title: 'Your details',
  note: 'We need your name and one way to reply. The rest helps but isn’t essential.',
  fields: [
    { id: 'name', label: 'Name', kind: 'text', autocomplete: 'name', required: true },
    { id: 'org', label: 'Organisation', kind: 'text', autocomplete: 'organization' },
    { id: 'email', label: 'Email', kind: 'email', autocomplete: 'email', contact: true },
    { id: 'tel', label: 'Telephone', kind: 'tel', autocomplete: 'tel', contact: true },
  ],
};

const ifKnow = 'If you know.';

export const quoteSections: Record<QuoteRouteId, FieldSection[]> = {
  survey: [
    {
      title: 'Upload your report or survey',
      fields: [
        {
          id: 'docs',
          kind: 'upload',
          primary: true,
          label: 'Your report or survey',
          hint: 'PDF, spreadsheet or other relevant project document. Several files are fine.',
          wide: true,
        },
        {
          id: 'photos',
          kind: 'upload',
          label: 'Photos or supporting documents',
          hint: 'Optional.',
          wide: true,
        },
      ],
    },
    details,
    {
      title: 'About the work',
      fields: [
        {
          id: 'where',
          label: 'Where is the work?',
          kind: 'text',
          placeholder: 'Site / location',
          wide: true,
        },
        { id: 'sites', label: 'How many sites are involved?', hint: ifKnow, kind: 'text' },
        {
          id: 'doors',
          label: 'Roughly how many doors or actions are involved?',
          hint: ifKnow,
          kind: 'text',
        },
        {
          id: 'deadline',
          label: 'Is there a deadline or priority we should know about?',
          kind: 'area',
          wide: true,
        },
        { id: 'else', label: 'Anything else we should know?', kind: 'area', wide: true },
      ],
    },
  ],
  backlog: [
    {
      title: 'Got a list, report or survey?',
      fields: [
        {
          id: 'docs',
          kind: 'upload',
          primary: true,
          label: 'Your list, report or survey',
          hint: 'Optional. Send what you have rather than rebuilding the information for us.',
          wide: true,
        },
      ],
    },
    details,
    {
      title: 'About the work',
      fields: [
        { id: 'where', label: 'Where is the work?', kind: 'text', placeholder: 'Site / location' },
        {
          id: 'actions',
          label: 'Roughly how many outstanding actions are involved?',
          hint: ifKnow,
          kind: 'text',
        },
        { id: 'deadline', label: 'Is there a deadline or priority?', kind: 'area', wide: true },
        {
          id: 'control',
          label: 'What would you most like to get under control?',
          kind: 'area',
          wide: true,
        },
      ],
    },
  ],
  inspection: [
    details,
    {
      title: 'The building or estate',
      fields: [
        {
          id: 'where',
          label: 'Where is the building or estate?',
          kind: 'text',
          placeholder: 'Site / location',
          wide: true,
        },
        { id: 'sites', label: 'How many sites are involved?', hint: 'If relevant.', kind: 'text' },
        {
          id: 'doors',
          label: 'Roughly how many fire doors are involved?',
          hint: ifKnow,
          kind: 'text',
        },
        {
          id: 'btype',
          label: 'What type of building is it?',
          kind: 'text',
          placeholder: 'e.g. school, health centre, offices',
          wide: true,
        },
        {
          id: 'prompt',
          label: 'What has prompted the inspection?',
          hint: 'For example: an upcoming programme, existing concerns, a survey requirement or a need to understand the current condition of the doors.',
          kind: 'area',
          wide: true,
        },
        {
          id: 'records',
          kind: 'upload',
          label: 'Do you already have any relevant records?',
          hint: 'Optional.',
          wide: true,
        },
        {
          id: 'deadline',
          label: 'Is there a deadline we should know about?',
          kind: 'area',
          wide: true,
        },
      ],
    },
  ],
  maintenance: [
    details,
    {
      title: 'Your estate today',
      fields: [
        { id: 'sites', label: 'How many sites are involved?', kind: 'text' },
        { id: 'where', label: 'Where are they?', kind: 'text', placeholder: 'Locations' },
        {
          id: 'doors',
          label: 'Roughly how many fire doors are involved?',
          hint: ifKnow,
          kind: 'text',
          wide: true,
        },
        {
          id: 'today',
          label: 'How are inspections and maintenance handled today?',
          kind: 'area',
          wide: true,
        },
        {
          id: 'backlog',
          label: 'Is there already an outstanding remedial list?',
          kind: 'seg',
          options: ['Yes', 'No', 'Not sure'],
          wide: true,
        },
      ],
    },
    {
      title: 'What you want to improve',
      fields: [
        { id: 'improve', label: 'What would you like to improve?', kind: 'area', wide: true },
        {
          id: 'why',
          label: 'What’s making you look at fire-door maintenance now?',
          kind: 'area',
          wide: true,
        },
        {
          id: 'docs',
          kind: 'upload',
          label: 'Got any useful documents?',
          hint: 'Optional.',
          wide: true,
        },
      ],
    },
  ],
  'not-sure': [
    {
      title: 'A little context',
      fields: [
        { id: 'name', label: 'Name', kind: 'text', autocomplete: 'name', required: true },
        { id: 'org', label: 'Organisation', kind: 'text', autocomplete: 'organization' },
        {
          // One combined field on this route, in place of the email / telephone pair.
          id: 'contact',
          label: 'Email or telephone',
          kind: 'text',
          autocomplete: 'email',
          required: true,
          wide: true,
        },
        {
          id: 'where',
          label: 'Where is the issue?',
          kind: 'text',
          placeholder: 'Site / location',
          wide: true,
        },
        { id: 'what', label: 'Tell us briefly what’s happening', kind: 'area', wide: true },
        {
          id: 'docs',
          kind: 'upload',
          label: 'Got a photo, report or other document?',
          hint: 'Optional.',
          wide: true,
        },
      ],
    },
  ],
};

export const isQuoteRoute = (route: unknown): route is QuoteRouteId =>
  typeof route === 'string' && Object.hasOwn(quoteSections, route);

/**
 * The value fields (everything except uploads) a form accepts, or null for an unknown form or
 * route. Uploads are sent separately and referenced by file key.
 */
export function fieldsFor(form: unknown, route?: unknown): FieldDef[] | null {
  if (form === 'contact') return contactFields;
  if (form !== 'quote' || !isQuoteRoute(route)) return null;
  return quoteSections[route].flatMap((s) => s.fields).filter((f) => f.kind !== 'upload');
}
