/**
 * The four services. Used by the header menu, footer, home service cards, /services/ hub,
 * related-service links and Service JSON-LD. Page body copy lives in each service page.
 *
 * Order follows the prototype (header menu, home cards 01–04, footer).
 * Copy sources: home `services`, header menu labels, footer labels, Why JFD `capMap`.
 */
import type { ImageMetadata } from 'astro';
import { paths } from './paths';
import type { QuoteRouteId } from './quote-routes';
import inspectionsImg from '../assets/images/photos/exmouth-bsc-label.jpeg';
import remedialImg from '../assets/images/photos/council-hinges.jpeg';
import maintenanceImg from '../assets/images/photos/pub-closer.jpeg';
import installationImg from '../assets/images/photos/penryn-doorset.jpeg';

export type ServiceId = 'inspections' | 'remedial-works' | 'maintenance' | 'installation';

export interface Service {
  id: ServiceId;
  path: string;
  /** Page H1 and full name (header menu label). */
  title: string;
  /** Footer label. */
  shortTitle: string;
  /** Capability-map verb and sentence-case name (Why JFD). */
  verb: string;
  mapTitle: string;
  /** Capability-map summary (Why JFD, /services/ hub). */
  summary: string;
  /** Home service card body. */
  cardBody: string;
  card: {
    image: ImageMetadata;
    alt: string;
    /** CSS object-position used by the prototype crop. */
    position: string;
  };
  /** schema.org Service.serviceType */
  serviceType: string;
  /** Quote route the page's primary CTA preselects. */
  quoteRoute: QuoteRouteId;
}

export const services: Service[] = [
  {
    id: 'inspections',
    path: paths.inspections,
    title: 'Fire Door Inspections & Surveys',
    shortTitle: 'Inspections & Surveys',
    verb: 'Inspect',
    mapTitle: 'Fire door inspections & surveys',
    summary: 'Understanding the condition of your doors and what needs attention.',
    cardBody:
      'Inspections of doors, frames and associated components, with reporting to identify remedial actions and inform the next stage of work.',
    card: {
      image: inspectionsImg,
      alt: 'BlueSky certification label fitted to a fire door frame, Exmouth primary school',
      position: '50% 62%',
    },
    serviceType: 'Fire door inspection',
    quoteRoute: 'inspection',
  },
  {
    id: 'remedial-works',
    path: paths.remedialWorks,
    title: 'Fire Door Repairs & Remedial Works',
    shortTitle: 'Repairs & Remedial Works',
    verb: 'Repair',
    mapTitle: 'Repairs & remedial works',
    summary: 'Turning identified defects into clear actions and completed work.',
    cardBody:
      'Practical remedial work to address identified issues including door closers, hinges, seals, gaps, alignment and other defects where appropriate.',
    card: {
      image: remedialImg,
      alt: 'Remedial work to hinges on a fire door leaf edge, local council project',
      position: '70% 30%',
    },
    serviceType: 'Fire door remedial works',
    quoteRoute: 'backlog',
  },
  {
    id: 'maintenance',
    path: paths.maintenance,
    title: 'Fire Door Maintenance',
    shortTitle: 'Maintenance',
    verb: 'Maintain',
    mapTitle: 'Fire door maintenance',
    summary: 'Keeping problems manageable rather than repeatedly catching up with them.',
    cardBody:
      'Scheduled and planned maintenance to help keep fire doors functioning correctly and reduce the build-up of outstanding issues.',
    card: {
      image: maintenanceImg,
      alt: 'Panelled fire door with overhead closer during a maintenance visit',
      position: '60% 30%',
    },
    serviceType: 'Fire door maintenance',
    quoteRoute: 'maintenance',
  },
  {
    id: 'installation',
    path: paths.installation,
    title: 'Fire Door Replacement & Installation',
    shortTitle: 'Replacement & Installation',
    verb: 'Replace',
    mapTitle: 'Replacement & installation',
    summary: 'Supplying and installing new doorsets where replacement is the right action.',
    cardBody:
      'Supply and installation where replacement is required, delivered to the relevant specification and project requirements.',
    card: {
      image: installationImg,
      alt: 'Replacement oak doorset with glazed screen, Penryn College',
      position: '40% 45%',
    },
    serviceType: 'Fire door installation',
    quoteRoute: 'survey',
  },
];

export const serviceIds = services.map((s) => s.id) as [ServiceId, ...ServiceId[]];

export function getService(id: ServiceId): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}
