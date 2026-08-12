export default defineEventHandler(async (event) => {
  const entries = await queryCollection('changelog').where('path', 'LIKE', '/changelog/en/%').order('date', 'DESC').all()
  setResponseHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=3600')
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Topiqu Changelog',
    home_page_url: 'https://topiqu.com/en/changelog',
    feed_url: 'https://topiqu.com/api/changelog/feed.json',
    items: entries.map((entry) => ({
      id: `https://topiqu.com/en/changelog/${entry.stem.split('/').at(-1)}`,
      url: `https://topiqu.com/en/changelog/${entry.stem.split('/').at(-1)}`,
      title: entry.title,
      summary: entry.description,
      date_published: `${entry.date}T12:00:00Z`,
      tags: entry.areas,
    })),
  }
})
