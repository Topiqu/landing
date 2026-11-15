// Copies the published demo articles and the company files they were written from into the landing.
// Usage: bun run scripts/sync-examples.ts <dir with heatwise/, mlynek/, dubina/ from the demo seed export>
// The notes in app/data/notes/ are written by hand and are not touched here.
import { join } from 'node:path'
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'

import { EXAMPLES, type Example } from '../shared/examples'

const root = process.argv[2]
if (!root) throw new Error('Pass the directory with the exported demo blogs')

type Exported = {
  article: {
    title: string
    excerpt: string
    content: string
    slug: string
    imageUrl: string
    imageCredit: { credit?: Record<string, string> } | null
    readingTime: number
    publishedAt: string
    sources: string[]
  }
  translations: { translations: { language: string; title: string; excerpt: string; content: string; slug: string }[] }
}

// Titles for the "more articles" lists, so a page does not load every article just to name it.
const titles: Record<string, Record<string, { cs: string; en: string }>> = {}

const syncArticle = async (example: Example, slug: string) => {
  const { article, translations } = JSON.parse(
    await readFile(join(root, example.id, 'export', `${slug}.json`), 'utf8'),
  ) as Exported
  const en = translations.translations.find((translation) => translation.language === 'en')
  if (!en) throw new Error(`${example.id}/${slug}: no English translation`)
  const credit = article.imageCredit?.credit
  const shared = {
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
    cover: {
      url: article.imageUrl,
      author: credit?.author ?? null,
      license: credit?.license ?? null,
      sourceUrl: credit?.sourceUrl ?? null,
    },
    sources: article.sources,
  }
  const snapshot = {
    cs: {
      ...shared,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      url: `https://${example.domain}/cs/clanky/${article.slug}`,
    },
    en: {
      ...shared,
      title: en.title,
      excerpt: en.excerpt,
      content: en.content,
      url: `https://${example.domain}/en/articles/${en.slug}`,
    },
  }
  titles[example.id]![slug] = { cs: article.title, en: en.title }
  await writeFile(join('app/data/examples', example.id, `${slug}.json`), `${JSON.stringify(snapshot, null, 2)}\n`)
}

for (const example of EXAMPLES) {
  titles[example.id] = {}
  await mkdir(join('app/data/examples', example.id), { recursive: true })
  for (const slug of example.articles) await syncArticle(example, slug)

  for (const [from, to] of [
    [join(root, example.id), join('public/examples', example.id)],
    [join(root, example.id, 'en'), join('public/examples', example.id, 'en')],
  ] as const) {
    await mkdir(to, { recursive: true })
    for (const file of (await readdir(from)).filter((name) => name.endsWith('.md')))
      await copyFile(join(from, file), join(to, file))
  }
  console.log(example.id, 'synced')
}
await writeFile('app/data/examples/index.json', `${JSON.stringify(titles, null, 2)}\n`)
