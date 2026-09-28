<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
const isCs = computed(() => locale.value === 'cs')

interface Source {
  label: string
  url: string
}

interface Cell {
  text: string
  sources: Source[]
}

interface Row {
  label: string
  cells: Cell[]
}

const source = (label: string, url: string): Source => ({ label, url })
const copy = computed(() =>
  isCs.value
    ? {
        eyebrow: 'SROVNÁNÍ WORKFLOW',
        title: 'Jak tyto kroky řeší jiné nástroje',
        description: 'Konkrétní schopnosti místo vlastních známek. Každé tvrzení má odkaz na produktovou dokumentaci.',
        area: 'Krok',
        source: 'Zdroj',
        sources: 'Zdroje',
        note: 'Veřejná dokumentace produktů, září 2026. Dostupnost se může lišit podle tarifu.',
      }
    : {
        eyebrow: 'WORKFLOW COMPARISON',
        title: 'How other tools handle these steps',
        description:
          'Concrete capabilities instead of self-assigned scores. Every claim links to product documentation.',
        area: 'Step',
        source: 'Source',
        sources: 'Sources',
        note: 'Public product documentation, September 2026. Availability may vary by plan.',
      },
)

const rows = computed<Row[]>(() => {
  const cs = isCs.value
  const topiqu = (slug: string) => localePath(`/changelog/${slug}`)

  return [
    {
      label: cs ? 'Firemní kontext' : 'Company context',
      cells: [
        {
          text: cs
            ? 'Z poznámek, souborů a webu vybírá pasáže relevantní k článku.'
            : 'Selects relevant passages from notes, files and your website for each article.',
          sources: [source('Topiqu', topiqu('2026-09-26-knowledge-base'))],
        },
        {
          text: cs
            ? 'Knowledge Base ukládá firemní fakta a používá je při tvorbě.'
            : 'Knowledge Base stores company facts and applies them during creation.',
          sources: [source('Jasper', 'https://help.jasper.ai/hc/en-us/articles/55085018624411-Knowledge-Base')],
        },
        {
          text: cs
            ? 'Analyzuje firemní web, konkurenci a hlas značky.'
            : 'Analyzes your website, competitors and brand voice.',
          sources: [source('Contentbase', 'https://contentbase.ai/')],
        },
      ],
    },
    {
      label: cs ? 'Rešerše a kontrola' : 'Research and review',
      cells: [
        {
          text: cs
            ? 'Živou rešerši doplňuje revize tvrzení před publikací.'
            : 'Combines live research with a claim review before publishing.',
          sources: [
            source('Topiqu · rešerše', topiqu('2026-09-26-knowledge-base')),
            source('Topiqu · revize', topiqu('2026-09-23-optimization-and-fact-check')),
          ],
        },
        {
          text: cs
            ? 'Research Agent připravuje rešerše s odkazy na zdroje.'
            : 'Research Agent produces research with source links.',
          sources: [source('Jasper', 'https://help.jasper.ai/hc/en-us/articles/48810861467803-Research-Agent')],
        },
        {
          text: cs
            ? 'Zkoumá klíčová slova a do článků přidává externí zdroje.'
            : 'Researches keywords and adds external sources to articles.',
          sources: [
            source('Contentbase · rešerše', 'https://contentbase.ai/'),
            source('Contentbase · zdroje', 'https://contentbase.ai/docs/features/external-linking/'),
          ],
        },
      ],
    },
    {
      label: cs ? 'Publikace' : 'Publishing',
      cells: [
        {
          text: cs
            ? 'Vlastní publikace, synchronizace do WordPressu a REST API.'
            : 'Hosted publication, WordPress sync and a REST API.',
          sources: [source('Topiqu', '/llms-full.txt')],
        },
        {
          text: cs
            ? 'Tvorba obsahu přímo ve Webflow; API pro vlastní integrace.'
            : 'Content creation inside Webflow; API for custom integrations.',
          sources: [
            source('Jasper · Webflow', 'https://www.jasper.ai/integrations'),
            source('Jasper · API', 'https://help.jasper.ai/hc/en-us/articles/18618701173659-Jasper-s-API'),
          ],
        },
        {
          text: cs
            ? 'Hostovaný blog, WordPress a další CMS integrace.'
            : 'Hosted blog, WordPress and other CMS integrations.',
          sources: [source('Contentbase', 'https://contentbase.ai/docs/features/contentbase-go/')],
        },
      ],
    },
    {
      label: cs ? 'Po publikaci' : 'After publishing',
      cells: [
        {
          text: cs
            ? 'Search Console řídí návrhy a volitelný autopilot; sledování viditelnosti kontroluje citace v odpovědích OpenAI.'
            : 'Search Console informs suggestions and optional autopilot; visibility tracking checks citations in OpenAI answers.',
          sources: [
            source('Topiqu · Google', topiqu('2026-08-27-search-console-autopilot')),
            source('Topiqu · AI', topiqu('2026-09-27-ai-visibility')),
          ],
        },
        {
          text: cs
            ? 'GEO Hub sleduje AI citace, propojuje data Search Console a doporučuje další obsah.'
            : 'GEO Hub tracks AI citations, connects Search Console data and recommends content.',
          sources: [
            source('Jasper · GEO', 'https://help.jasper.ai/hc/en-us/articles/55317942235803-GEO-Hub'),
            source(
              'Jasper · Google',
              'https://help.jasper.ai/hc/en-us/articles/55091361235355-Integrations-Google-Search-Console',
            ),
          ],
        },
        {
          text: cs
            ? 'Search Console pomáhá plánovat témata; analytika a automatické aktualizace sledují další vývoj.'
            : 'Search Console helps plan topics; analytics and automatic updates support the next cycle.',
          sources: [source('Contentbase', 'https://contentbase.ai/docs/')],
        },
      ],
    },
  ]
})
</script>

<template>
  <section id="comparison" class="landing-section comparison-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2>{{ copy.title }}</h2>
        <p class="section-description">{{ copy.description }}</p>
      </div>
      <div class="comparison-scroll" tabindex="0" role="region" :aria-label="copy.title">
        <table class="comparison-table">
          <thead>
            <tr>
              <th scope="col">{{ copy.area }}</th>
              <th scope="col">Topiqu</th>
              <th scope="col">Jasper</th>
              <th scope="col">Contentbase</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.label">
              <th scope="row">{{ row.label }}</th>
              <td v-for="(cell, index) in row.cells" :key="index">
                <p>{{ cell.text }}</p>
                <div class="comparison-sources">
                  <a
                    v-for="link in cell.sources"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ cell.sources.length === 1 ? copy.source : copy.sources }}: {{ link.label }}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="comparison-note">{{ copy.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.comparison-scroll {
  overflow-x: auto;
  border: 1px solid var(--landing-line);
}
.comparison-scroll:focus-visible {
  outline: 3px solid var(--landing-accent);
  outline-offset: 3px;
}
.comparison-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  text-align: left;
}
.comparison-table th,
.comparison-table td {
  min-width: 0;
  padding: 22px;
  border-right: 1px solid var(--landing-line);
  border-bottom: 1px solid var(--landing-line);
  vertical-align: top;
}
.comparison-table tr > :last-child {
  border-right: 0;
}
.comparison-table tbody tr:last-child > * {
  border-bottom: 0;
}
.comparison-table thead th {
  background: var(--landing-bg);
  font-size: 14px;
  font-weight: 750;
}
.comparison-table th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  width: 17%;
  min-width: 140px;
  background: var(--landing-surface);
  font-size: 14px;
  font-weight: 700;
}
.comparison-table thead th:first-child {
  z-index: 2;
  background: var(--landing-bg);
}
.comparison-table td {
  width: 27.7%;
}
.comparison-table td:nth-child(2) {
  background: var(--landing-tint);
}
.comparison-table td p {
  color: var(--landing-ink);
  font-size: 13px;
  line-height: 1.65;
}
.comparison-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 12px;
  margin-top: 12px;
}
.comparison-sources a {
  color: var(--landing-accent);
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.comparison-sources a:hover {
  color: var(--landing-ink);
}
.comparison-note {
  margin-top: 14px !important;
  color: var(--landing-muted);
  font-size: 11px;
  line-height: 1.6;
}
@media (max-width: 600px) {
  .comparison-table {
    min-width: 720px;
  }
  .comparison-table th,
  .comparison-table td {
    padding: 15px;
  }
  .comparison-table th:first-child {
    min-width: 115px;
  }
}
</style>
