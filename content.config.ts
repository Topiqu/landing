import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number(),
      }),
    }),
    changelog: defineCollection({
      type: 'page',
      source: 'changelog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        version: z.string(),
        type: z.enum(['new', 'improved', 'fixed', 'deprecated', 'breaking', 'security']),
        areas: z.array(z.string()),
        breaking: z.boolean().default(false),
        featured: z.boolean().default(false),
      }),
    }),
  },
})
