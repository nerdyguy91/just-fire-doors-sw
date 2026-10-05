/**
 * Proof points reused across pages (proof strip, home credibility block, quote page).
 * Figures are stated as fact in the approved prototype. Placeholder stats ("[X] projects") are
 * not ported (CONTENT-TODO.md). Client logo use needs permission (plan Decision 2).
 */
import type { ImageMetadata } from 'astro';
import uopLogo from '../assets/images/logos/university-of-plymouth.png';

export interface Stat {
  value: string;
  label: string;
}

export const proofStats: Stat[] = [
  { value: '~150', label: 'doors across two schools' },
  { value: '~35', label: 'laboratory doorsets, University of Plymouth' },
];

export interface ClientLogo {
  src: ImageMetadata;
  alt: string;
}

export const clientLogos: ClientLogo[] = [{ src: uopLogo, alt: 'University of Plymouth' }];
