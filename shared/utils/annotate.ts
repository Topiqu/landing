// Marks each note's quote in a published article and drops the parts the landing cannot render.

const unescape = (text: string) => text.replaceAll('&quot;', '"').replaceAll('&amp;', '&')
const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;')

/** Text runs between tags, so a quote never matches across `<strong>` or a link. */
const runs = (html: string) => [...html.matchAll(/>([^<]+)</g)].map((m) => ({ start: m.index + 1, text: m[1]! }))

/** Where the quote starts in the html, or -1. */
export const findQuote = (html: string, quote: string) => {
  const run = runs(html).find(({ text }) => unescape(text).includes(quote))
  return run ? run.start + unescape(run.text).indexOf(quote) : -1
}

export const annotate = (html: string, quotes: string[]) => {
  // Polls need the blog's own component; an empty box would look broken here.
  let out = html.replace(/<div data-type="poll"[^>]*><\/div>/g, '')
  out = out.replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" decoding="async" ')
  quotes.forEach((quote, index) => {
    const run = runs(out).find(({ text }) => unescape(text).includes(quote))
    if (!run) return
    const text = unescape(run.text)
    const at = text.indexOf(quote)
    const marked =
      escape(text.slice(0, at)) +
      `<mark class="example-mark" data-note="${index + 1}" id="quote-${index + 1}">${escape(quote)}</mark>` +
      escape(text.slice(at + quote.length))
    out = out.slice(0, run.start) + marked + out.slice(run.start + run.text.length)
  })
  return out
}

/** Only the paragraphs and list items holding a mark, in article order: the homepage shows the proof, not the article. */
export const markedParagraphs = (html: string) =>
  [...html.matchAll(/<(p|li)\b[^>]*>[\s\S]*?<\/\1>/g)]
    .map(([block]) => block)
    .filter((block) => block.includes('<mark '))
    .map((block) => (block.startsWith('<li') ? block.replace(/^<li\b/, '<p').replace(/<\/li>$/, '</p>') : block))
    .join('')
