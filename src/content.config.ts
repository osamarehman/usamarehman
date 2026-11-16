import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      client: z.string(),
      title: z.string(),
      headlineMetric: z.string(),
      subtitle: z.string(),
      type: z.string(),
      stack: z.array(z.string()).default([]),
      summary: z.string(),
      challenge: z.string().optional(),
      architecture: z.string().optional(),
      outcome: z.string().optional(),
      metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      coverCaption: z.string().optional(),
      gallery: z
        .array(z.object({ image: image(), alt: z.string(), caption: z.string() }))
        .default([]),
      kind: z
        .enum(['migration', 'product', 'portal', 'pipeline', 'configurator', 'editor'])
        .default('editor'),
      featured: z.boolean().default(false),
      category: z.enum(['client', 'product']).default('client'),
      status: z.string().optional(),
      links: z
        .array(z.object({ label: z.string(), href: z.string() }))
        .default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
