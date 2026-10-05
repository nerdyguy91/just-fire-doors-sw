/**
 * Content collections.
 *
 * projects  src/content/projects/*.md    One file per case study; the file name is the URL slug.
 *                                         Frontmatter mirrors the prototype's JfdCaseStudy props.
 * faqs      src/content/faqs/*.yaml      One file per page FAQ set; rendered as <details> and as
 *                                         FAQPage JSON-LD from the same data.
 *
 * Only publishable content belongs here. Pending facts, "to confirm" notes and placeholders
 * are tracked in CONTENT-TODO.md, never in content.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { serviceIds } from './data/services';

const labelValue = z.object({ label: z.string(), value: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Display order on /projects/ ("Project 01", "Project 02"… is derived from this). */
      order: z.number().int().positive(),
      /** e.g. "Specialist healthcare environment" */
      useCase: z.string(),
      subhead: z.string(),
      sector: z.string(),
      /** Only when stated in project content. */
      location: z.string().optional(),
      tags: z.array(z.string()).min(1),
      hero: z.object({
        image: image(),
        alt: z.string().min(1),
        position: z.string().default('50% 50%'),
        caption: z.string(),
      }),
      /** Overrides for the /projects/ index card. Falls back to hero/subhead. */
      card: z
        .object({
          /** Eyebrow, e.g. "Healthcare · Plymouth". */
          label: z.string().optional(),
          summary: z.string().optional(),
          meta: z.string().optional(),
          alt: z.string().optional(),
          position: z.string().optional(),
        })
        .default({}),
      facts: z.array(labelValue),
      /** Short Environment / Constraint / JFD role rows (Why JFD page). */
      summary: z.array(labelValue).default([]),
      situation: z.array(z.string()).min(1),
      stages: z
        .array(
          z.object({
            stage: z.enum(['decide', 'deliver', 'close']),
            /** "brief" renders the smaller "Requirement received" treatment. */
            weight: z.enum(['brief']).optional(),
            /** Overrides the small label beside the stage name. */
            weightLabel: z.string().optional(),
            title: z.string(),
            lines: z.array(z.string()).min(1),
            callouts: z.array(labelValue).optional(),
            timeline: z.array(z.object({ title: z.string(), when: z.string() })).optional(),
            shots: z
              .array(
                z.object({
                  image: image(),
                  alt: z.string().min(1),
                  label: z.string(),
                  position: z.string().default('50% 50%'),
                }),
              )
              .optional(),
          }),
        )
        .min(1),
      outcome: z.string(),
      outcomeDetail: z.string(),
      /** Services used; rendered as related-service links. */
      services: z.array(z.enum(serviceIds)).min(1),
      draft: z.boolean().default(false),
    }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/faqs' }),
  schema: z.object({
    title: z.string(),
    items: z
      .array(
        z.object({
          q: z.string(),
          a: z.array(z.string()).min(1),
          link: z
            .object({
              label: z.string(),
              /** Site path ("/…/") or in-page anchor ("#…"). */
              href: z.string().regex(/^(\/|#)/),
            })
            .optional(),
        }),
      )
      .min(1),
  }),
});

export const collections = { projects, faqs };
