import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const scenarios = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    series: z.string().default('strelecky-klub'),
    order: z.number(),
    category: z.enum([
      'uvod',
      'system',
      'clenstvi',
      'aplikace',
      'zavodnik',
      'pristup',
      'overovani',
    ]),
    roles: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    deepenLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
    prev: z.string().optional(),
    next: z.string().optional(),
  }),
});

export const collections = { articles, scenarios };
