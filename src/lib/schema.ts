/**
 * JSON-LD builders. Every node is built from src/data (business facts, services) and content
 * collections, and a field is only output when its value is confirmed (non-null). Never add
 * Review, AggregateRating, foundingDate, employee counts or unconfirmed credentials.
 *
 * Nodes link to each other by @id, and BaseLayout wraps them in a single @graph.
 */
import { business } from '../data/business';
import type { Service } from '../data/services';
import { absoluteUrl, siteMeta, type Breadcrumb } from './seo';

export type JsonLdNode = Record<string, unknown>;

const ids = (site: URL) => ({
  org: absoluteUrl('/#organization', site),
  website: absoluteUrl('/#website', site),
  business: absoluteUrl('/#localbusiness', site),
});

/** Drop keys whose value is null, undefined or an empty array. */
function compact<T extends JsonLdNode>(node: T): T {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
    ),
  ) as T;
}

function postalAddress(a: NonNullable<typeof business.address>): JsonLdNode {
  return { '@type': 'PostalAddress', ...a };
}

/** Confirmed service areas only. */
function areaServed(): JsonLdNode[] | null {
  if (!business.serviceArea.confirmed) return null;
  return business.serviceArea.areas.map((name) => ({ '@type': 'Place', name }));
}

/** Organization: output on every page. */
export function organization(site: URL): JsonLdNode {
  return compact({
    '@type': 'Organization',
    '@id': ids(site).org,
    name: business.name,
    legalName: business.legalName,
    url: absoluteUrl('/', site),
    logo: siteMeta.logo
      ? {
          '@type': 'ImageObject',
          url: absoluteUrl(siteMeta.logo.src, site),
          width: siteMeta.logo.width,
          height: siteMeta.logo.height,
        }
      : null,
    telephone: business.phone?.e164 ?? null,
    email: business.email,
    address: business.registeredOffice ? postalAddress(business.registeredOffice) : null,
    areaServed: areaServed(),
    sameAs: business.sameAs,
  });
}

/**
 * LocalBusiness (GeneralContractor): home and contact pages, and only when a public trading
 * address is confirmed. Returns null otherwise (service-area business).
 */
export function localBusiness(site: URL): JsonLdNode | null {
  if (!business.address) return null;
  return compact({
    '@type': 'GeneralContractor',
    '@id': ids(site).business,
    name: business.name,
    url: absoluteUrl('/', site),
    parentOrganization: { '@id': ids(site).org },
    address: postalAddress(business.address),
    telephone: business.phone?.e164 ?? null,
    email: business.email,
    areaServed: areaServed(),
    image: absoluteUrl(siteMeta.defaultOgImage.src, site),
  });
}

/** WebSite: home page only. No SearchAction (the site has no search). */
export function website(site: URL): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ids(site).website,
    url: absoluteUrl('/', site),
    name: business.name,
    inLanguage: siteMeta.lang,
    publisher: { '@id': ids(site).org },
  };
}

/** Service: each service page. */
export function service(site: URL, s: Service, description: string): JsonLdNode {
  return compact({
    '@type': 'Service',
    '@id': absoluteUrl(`${s.path}#service`, site),
    name: s.title,
    serviceType: s.serviceType,
    description,
    url: absoluteUrl(s.path, site),
    provider: { '@id': ids(site).org },
    areaServed: areaServed(),
  });
}

/** BreadcrumbList: every page except home. Same data as the visible breadcrumb trail. */
export function breadcrumbList(site: URL, items: Breadcrumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, site),
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string[];
}

/** FAQPage: only on pages that render the same FAQs visibly (FaqList). */
export function faqPage(site: URL, path: string, items: FaqItem[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': absoluteUrl(`${path}#faq`, site),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a.join('\n\n') },
    })),
  };
}

/** Serialise for a <script type="application/ld+json"> block, safe against "</script>". */
export function serialiseGraph(nodes: JsonLdNode[]): string {
  const graph = { '@context': 'https://schema.org', '@graph': nodes };
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
