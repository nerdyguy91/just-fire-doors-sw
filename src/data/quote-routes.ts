/**
 * Quote router options on /get-a-quote/. Copy is from the prototype's route cards
 * and route forms (docs/prototype/pages/get-a-quote.dc.html). Each route's form fields are in
 * src/lib/enquiry/fields.ts.
 *
 * The prototype deep-linked with #route-a…#route-e. Those hashes map to the named ids via `legacy`.
 */
import { paths } from './paths.ts';

export const quoteRouteIds = [
  'survey',
  'backlog',
  'inspection',
  'maintenance',
  'not-sure',
] as const;
export type QuoteRouteId = (typeof quoteRouteIds)[number];

export interface QuoteRoute {
  id: QuoteRouteId;
  /** Prototype hash letter: #route-{legacy}. */
  legacy: 'a' | 'b' | 'c' | 'd' | 'e';
  title: string;
  line: string;
  cta: string;
  /** Step 2: the route's form. */
  heading: string;
  intro: string[];
  bullets?: string[];
  /** "Before you send" panel beside the form. */
  reassure: string[];
  submit: string;
  footnote: string;
}

export const quoteRoutes: QuoteRoute[] = [
  {
    id: 'survey',
    legacy: 'a',
    title: 'I already have a survey or job sheet',
    line: 'You know what needs attention and want help turning it into a clear scope and completed work.',
    cta: 'Send what I have',
    heading: 'Send us what you already have.',
    intro: [
      'Upload your fire-door survey, inspection report, remedial schedule or job sheet. Give us a little context about the site and we’ll review the requirement with you.',
    ],
    reassure: [
      'You don’t need to copy information out of your survey or job sheet and type it all in again.',
      'Send us the document you’re already working from.',
    ],
    submit: 'Send my job sheet',
    footnote: 'No document to hand? You can still send this — just tell us about the work.',
  },
  {
    id: 'backlog',
    legacy: 'b',
    title: 'I have outstanding remedial work or a backlog',
    line: 'You’ve got actions that need pricing, organising or getting off the list.',
    cta: 'Get the list moving',
    heading: 'Let’s get the list moving.',
    intro: [
      'If you’ve already got outstanding fire-door actions, send us the list if you have it. That could be:',
    ],
    bullets: [
      'one site',
      'an ageing backlog',
      'a defined batch of remedials',
      'work that has been sitting open too long',
      'a package your existing contractor doesn’t currently have capacity for',
    ],
    reassure: [
      'You don’t need to explain why your current arrangements haven’t cleared the list.',
      'Just show us the work that needs moving.',
    ],
    submit: 'Send my remedial list',
    footnote: 'Don’t know the exact number of actions? That’s fine.',
  },
  {
    id: 'inspection',
    legacy: 'c',
    title: 'I need an inspection or survey first',
    line: 'You need to understand the condition of your fire doors and what action is required.',
    cta: 'Request an inspection',
    heading: 'Tell us what needs inspecting.',
    intro: [
      'If you don’t yet have a clear picture of the condition of your fire doors or the work required, tell us about the building or estate and what has prompted the inspection.',
    ],
    reassure: ['You don’t need to know which type of survey to request before speaking to us.'],
    submit: 'Request an inspection',
    footnote: 'Rough numbers are fine. We’ll scope it with you.',
  },
  {
    id: 'maintenance',
    legacy: 'd',
    title: 'I want to discuss planned maintenance',
    line: 'You want to move away from reactive fire-door work and towards a more manageable ongoing programme.',
    cta: 'Discuss maintenance',
    heading: 'Tell us how you’re managing fire doors today.',
    intro: [
      'You might be starting a maintenance programme from scratch. Or you may already have inspections, repairs and remedial work happening but want a clearer way of keeping the estate under control.',
    ],
    reassure: [
      'Give us a picture of where things stand now.',
      'You don’t need to design the programme — that’s the conversation.',
    ],
    submit: 'Discuss maintenance',
    footnote: 'A rough picture is plenty to start the conversation.',
  },
  {
    id: 'not-sure',
    legacy: 'e',
    title: 'I’m not sure where to start',
    line: 'That’s fine. Tell us what you’re dealing with and we’ll help establish the right next step.',
    cta: 'Tell us what’s happening',
    heading: 'That’s fine. Tell us what you know.',
    intro: [
      'You don’t need to diagnose the problem before speaking to us. Give us a little context and we’ll help point you towards the right next step.',
    ],
    reassure: ['You don’t need to diagnose the problem before speaking to us.'],
    submit: 'Send my enquiry',
    footnote: 'Nothing more.',
  },
];

/** Link to the quote page, optionally preselecting a route. */
export const quoteHref = (route?: QuoteRouteId) =>
  route ? `${paths.quote}#${route}` : paths.quote;
