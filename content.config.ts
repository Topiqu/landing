import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const sitemapSchema = z
  .object({
    loc: z.string(),
    changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).optional(),
  })
  .optional()

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number(),
        sitemap: sitemapSchema,
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
        sitemap: sitemapSchema,
      }),
    }),
  },
})
