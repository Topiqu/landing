import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

import { annotate, findQuote, markedParagraphs } from '../shared/utils/annotate'
import { EXAMPLES, NOTE_KINDS, type ExampleLocale, type ExampleNote } from '../shared/examples'

const read = <T>(path: string) => JSON.parse(readFileSync(path, 'utf8')) as T
const snapshot = (id: string, article: string) =>
  read<Record<ExampleLocale, { content: string }>>(`app/data/examples/${id}/${article}.json`)
const notes = (id: string, article: string) =>
  read<Record<ExampleLocale, ExampleNote[]>>(`app/data/notes/${id}/${article}.json`)

describe('examples', () => {
  for (const example of EXAMPLES)
    for (const article of example.articles)
      for (const locale of ['cs', 'en'] as const)
        test(`${example.id}/${article} (${locale}): every note quotes the article in reading order`, () => {
          const { content } = snapshot(example.id, article)[locale]
          let previous = -1
          for (const note of notes(example.id, article)[locale]) {
            const at = findQuote(content, note.quote)
            expect({ quote: note.quote, found: at >= 0, inOrder: at > previous }).toEqual({
              quote: note.quote,
              found: true,
              inOrder: true,
            })
            previous = at
            expect(NOTE_KINDS).toContain(note.kind)
            expect(note.text.length).toBeGreaterThan(0)
            if (note.file) expect(existsSync(`public/examples/${example.id}/${note.file}`)).toBe(true)
            if (note.file && locale === 'en')
              expect(existsSync(`public/examples/${example.id}/en/${note.file}`)).toBe(true)
          }
        })

  test('every company has notes in both languages and the homepage notes exist', () => {
    for (const example of EXAMPLES)
      for (const locale of ['cs', 'en'] as const) {
        for (const article of example.articles) expect(notes(example.id, article)[locale].length).toBeGreaterThan(0)
        const home = notes(example.id, example.articles[0]!)[locale]
        for (const index of example.featured) expect(home[index]).toBeDefined()
      }
  })

  test('marks every quote once and keeps the rest of the paragraph', () => {
    const html = '<p>Cena <strong>236 000 Kč</strong> platí od 1. 3. 2026 a obsahuje DPH.</p>'
    const out = annotate(html, ['platí od 1. 3. 2026', 'chybí'])
    expect(out).toBe(
      '<p>Cena <strong>236 000 Kč</strong> <mark class="example-mark" data-note="1" id="quote-1">platí od 1. 3. 2026</mark> a obsahuje DPH.</p>',
    )
  })

  test('never matches across tags, so a mark cannot break the markup', () => {
    expect(findQuote('<p>Cena <strong>236 000 Kč</strong> platí</p>', 'Cena 236 000 Kč')).toBe(-1)
  })

  test('keeps only the marked paragraphs for the homepage', () => {
    const html = annotate('<h2>A</h2><p>Jedna věta.</p><p>Druhá věta.</p><ul><li>Třetí věta.</li></ul>', [
      'Druhá',
      'Třetí',
    ])
    expect(markedParagraphs(html)).toBe(
      '<p><mark class="example-mark" data-note="1" id="quote-1">Druhá</mark> věta.</p><p><mark class="example-mark" data-note="2" id="quote-2">Třetí</mark> věta.</p>',
    )
  })

  test('drops polls the landing cannot render and lazy-loads pictures', () => {
    const out = annotate('<div data-type="poll" data-id="1"></div><img src="a.webp">', [])
    expect(out).toBe('<img loading="lazy" decoding="async" src="a.webp">')
  })
})
