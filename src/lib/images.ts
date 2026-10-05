/**
 * Shared settings for <Img>, and the matching preload for an LCP image that sits late in the
 * HTML (the browser otherwise finds it only after parsing the inlined CSS and header).
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

export const DEFAULT_WIDTHS = [360, 640, 960, 1280];
export const IMAGE_QUALITY = 50;

/** Widths actually generated for a source: never upscale. */
export function usableWidths(src: ImageMetadata, widths = DEFAULT_WIDTHS): number[] {
  const usable = widths.filter((w) => w <= src.width);
  return usable.length ? usable : [src.width];
}

/** `imagesrcset` for an AVIF preload, matching the first <source> that <Img> renders. */
export async function avifPreloadSrcset(src: ImageMetadata, widths = DEFAULT_WIDTHS) {
  const image = await getImage({
    src,
    format: 'avif',
    widths: usableWidths(src, widths),
    quality: IMAGE_QUALITY,
  });
  return image.srcSet.attribute;
}
