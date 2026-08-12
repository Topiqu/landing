const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)

export default defineEventHandler(async (event) => {
  const entries = await queryCollection('changelog').where('path', 'LIKE', '/changelog/en/%').order('date', 'DESC').all()
  const items = entries.map((entry) => {
    const url = `https://topiqu.com/en/changelog/${entry.stem.split('/').at(-1)}`
    return `<item><title>${escapeXml(entry.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${entry.date}T12:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(entry.description)}</description></item>`
  }).join('')
  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Topiqu Changelog</title><link>https://topiqu.com/en/changelog</link><description>Topiqu product and API updates.</description>${items}</channel></rss>`
})
