/**
 * Business facts: the single source for the footer, contact details, tel:/mailto: links and
 * JSON-LD. Never invent values here.
 *
 * - `null` means not yet confirmed by JFD. UI and schema must render nothing for a null field.
 * - Values are either confirmed or stated as fact in the approved prototype copy (source noted).
 * - Anything still awaiting sign-off is listed in CONTENT-TODO.md.
 */
import type { ImageMetadata } from 'astro';
import bskyLogo from '../assets/images/logos/bsc-fire-door-installation.jpg';
import ddsLogo from '../assets/images/logos/door-data-systems.jpeg';

export interface Phone {
  /** As displayed, with non-breaking spaces, e.g. "01752\u00A0123\u00A0456". */
  display: string;
  /** E.164 for tel: links and schema, e.g. "+441752123456". */
  e164: string;
}

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode: string;
  addressCountry: 'GB';
}

export interface Credential {
  /** Stable id used by components (badges, logo rows). Remove an entry to remove it site-wide. */
  id: 'bluesky' | 'carpenters' | 'dds';
  /** Short category shown above the name, e.g. "Third-party certification". */
  type: string;
  name: string;
  /** Plain-English sentence on what it demonstrates. */
  proves: string;
  /** How it can be verified, e.g. "Cert. FDI-146". */
  verify: string;
  logo?: { src: ImageMetadata; alt: string };
}

export interface Business {
  /** Trading name. */
  name: string;
  shortName: string;
  tagline: string;
  /** Registered company name. Must be shown on the site once confirmed (Companies Act). */
  legalName: string | null;
  companyNumber: string | null;
  registeredOffice: PostalAddress | null;
  /** Public trading address. null = service-area business (address not published). */
  address: PostalAddress | null;
  phone: Phone | null;
  email: string | null;
  /** Office hours as displayed, e.g. "Mon–Fri, 8am–5pm". */
  hours: string | null;
  serviceArea: {
    /** Where JFD is based. */
    base: string;
    region: string;
    /** Areas shown in copy. Output as schema areaServed only when `confirmed` is true. */
    areas: string[];
    confirmed: boolean;
  };
  /** Profile URLs for schema sameAs (Google Business Profile, LinkedIn, etc.). */
  sameAs: string[];
  credentials: Credential[];
}

export const business: Business = {
  name: 'Just Fire Doors SW',
  shortName: 'JFD',
  // Prototype footer tagline.
  tagline: 'Fire door safety. Kept simple.',

  // Confirmed by JFD at content sign-off, 2026-10-06.
  legalName: 'Just Fire Doors SW Ltd',
  companyNumber: '16088943',
  registeredOffice: {
    streetAddress: '8 Murhill Lane',
    addressLocality: 'Plymouth',
    postalCode: 'PL9 7FN',
    addressCountry: 'GB',
  },
  address: {
    streetAddress: 'Scott Rd',
    addressLocality: 'Plymouth',
    postalCode: 'PL2 2PQ',
    addressCountry: 'GB',
  },

  // Non-breaking space keeps the number on one line (html-validate tel-non-breaking).
  phone: { display: '07456\u00A0506960', e164: '+447456506960' },
  email: 'dec@justfiredoorssw.com',
  hours: 'Mon–Fri, 8am–5pm',

  serviceArea: {
    // Stated as fact throughout the prototype copy ("JFD is based in Plymouth").
    base: 'Plymouth',
    region: 'South West',
    // Confirmed by JFD at content sign-off, 2026-10-06.
    areas: ['Plymouth', 'Devon', 'Cornwall', 'Wider South West'],
    confirmed: true,
  },

  sameAs: [],

  // Stated as fact in the prototype (Why JFD "Credentials" section). Placeholder credentials
  // ("[Accreditation]", "[X] years", etc.) are not ported. Wording and logo rights: Decision 2.
  // Certificate FDI-146 expired 14/08/2026. JFD asked to keep it in place while the renewal comes
  // through (content sign-off, 2026-10-06). Update `verify` when the new certificate arrives.
  credentials: [
    {
      id: 'bluesky',
      type: 'Third-party certification',
      name: 'BlueSky Certified Installer — fire door installation & fire stopping of penetrations',
      proves:
        'JFD’s fire door installation and fire stopping work is independently certified, not self-declared.',
      verify: 'Cert. FDI-146',
      logo: { src: bskyLogo, alt: 'BlueSky Certified Installer — Fire Door Installation, FDI-146' },
    },
    {
      id: 'carpenters',
      type: 'Installer qualification',
      name: 'Qualified carpenters with fire-door-specific training',
      proves:
        'The people fitting and repairing your doors are trade-qualified, with additional training specific to fire doors.',
      verify: 'Details on request',
    },
    {
      id: 'dds',
      type: 'Evidence system',
      name: 'Door Data Systems (DDS)',
      proves:
        'Checks, photos and parts are recorded against each door, so completion can be traced afterwards.',
      verify: 'Sample record on request',
      logo: { src: ddsLogo, alt: 'Door Data Systems — door-level evidence records' },
    },
  ],
};

/** Look up a credential by id; undefined once it has been removed. */
export const getCredential = (id: Credential['id']) =>
  business.credentials.find((c) => c.id === id);
