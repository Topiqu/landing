import { annotate, markedParagraphs } from '~~/shared/utils/annotate'
import { exampleById, type ExampleLocale, type ExampleNote } from '~~/shared/examples'

import titles from '~/data/examples/index.json'

export type ExampleSnapshot = {
  title: string
  excerpt: string
  content: string
  url: string
  publishedAt: string
  readingTime: number
  cover: { url: string; author: string | null; license: string | null; sourceUrl: string | null }
  sources: string[]
}

// One chunk per article and per set of notes, loaded only when its tab or page is shown.
const snapshots = import.meta.glob<Record<ExampleLocale, ExampleSnapshot>>('../data/examples/*/*.json', {
  import: 'default',
})
const notes = import.meta.glob<Record<ExampleLocale, ExampleNote[]>>('../data/notes/*/*.json', { import: 'default' })

/** The article with its notes marked; `featured` keeps only the homepage's notes and their paragraphs. */
export const loadExample = async (id: string, article: string, locale: ExampleLocale, featured = false) => {
  const example = exampleById(id)
  const loadSnapshot = snapshots[`../data/examples/${id}/${article}.json`]
  const loadNotes = notes[`../data/notes/${id}/${article}.json`]
  if (!example?.articles.includes(article) || !loadSnapshot || !loadNotes) return null
  const [snapshot, all] = await Promise.all([
    loadSnapshot().then((file) => file[locale]),
    loadNotes().then((file) => file[locale]),
  ])
  const picked = featured ? example.featured.flatMap((index) => all[index] ?? []) : all
  const html = annotate(
    snapshot.content,
    picked.map(({ quote }) => quote),
  )
  return {
    example,
    article,
    snapshot: { ...snapshot, content: featured ? markedParagraphs(html) : html },
    notes: picked,
  }
}

export type LoadedExample = NonNullable<Awaited<ReturnType<typeof loadExample>>>

const titlesBySlug = titles as Record<string, Record<string, Record<ExampleLocale, string>>>

/** The company's other articles, in the order of `Example.articles`. */
export const otherArticles = (id: string, article: string, locale: ExampleLocale) =>
  (exampleById(id)?.articles ?? [])
    .filter((slug) => slug !== article)
    .map((slug) => ({ slug, title: titlesBySlug[id]![slug]![locale] }))
