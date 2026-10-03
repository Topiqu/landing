<template>
  <section id="comparison" class="landing-section comparison-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2>{{ copy.title }}</h2>
        <p class="section-description">{{ copy.description }}</p>
      </div>
      <div class="comparison-pager">
        <div role="tablist" class="comparison-tabs" :aria-label="copy.pagesLabel" @keydown="onKeydown">
          <button
            v-for="(group, index) in groups"
            :id="`comparison-tab-${index}`"
            :key="group.label"
            type="button"
            role="tab"
            :aria-selected="index === page"
            aria-controls="comparison-panel"
            :tabindex="index === page ? 0 : -1"
            @click="page = index"
          >
            {{ group.label }}
            <small>{{ group.rows.length }}</small>
          </button>
        </div>
        <div class="comparison-steps">
          <span>{{ page + 1 }} / {{ groups.length }}</span>
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            size="sm"
            square
            icon="mdi:chevron-left"
            :disabled="page === 0"
            :aria-label="copy.previous"
            @click="page--"
          />
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            size="sm"
            square
            icon="mdi:chevron-right"
            :disabled="page === groups.length - 1"
            :aria-label="copy.next"
            @click="page++"
          />
        </div>
      </div>
      <div
        id="comparison-panel"
        class="comparison-scroll"
        tabindex="0"
        role="tabpanel"
        :aria-labelledby="`comparison-tab-${page}`"
      >
        <table class="comparison-table" :data-closed="page < groups.length - 1 || undefined">
          <thead>
            <tr>
              <th scope="col">{{ copy.feature }}</th>
              <th v-for="tool in tools" :key="tool.name" scope="col" :data-own="tool.own || undefined">
                <span class="comparison-tool">
                  <img :src="tool.logo" alt="" width="28" height="28" />
                  {{ tool.name }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody v-for="(group, groupIndex) in groups" v-show="groupIndex === page" :key="group.label">
            <tr v-for="row in group.rows" :key="row.label">
              <th scope="row">
                <strong>{{ row.label }}</strong>
                <small>{{ row.hint }}</small>
              </th>
              <td v-for="(has, index) in row.support" :key="index" :data-own="tools[index]!.own || undefined">
                <span class="comparison-mark" :data-has="has || undefined">
                  <Icon :name="has ? icons.yes : icons.no" aria-hidden="true" />
                  <span class="comparison-visually-hidden">{{ has ? copy.yes : copy.no }}</span>
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-show="page === groups.length - 1">
            <tr class="comparison-price">
              <th scope="row">
                <strong>{{ copy.priceLabel }}</strong>
                <small>{{ copy.priceHint }}</small>
              </th>
              <td v-for="(price, index) in prices" :key="index" :data-own="tools[index]!.own || undefined">
                <strong>{{ price.amount }}</strong>
                <small>{{ price.detail }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="comparison-footer">
        <ul class="comparison-legend">
          <li><Icon :name="icons.yes" class="comparison-legend-yes" aria-hidden="true" />{{ copy.legendYes }}</li>
          <li><Icon :name="icons.no" class="comparison-legend-no" aria-hidden="true" />{{ copy.legendNo }}</li>
          <li>{{ copy.legendDate }}</li>
        </ul>
        <details class="comparison-sources">
          <summary>{{ copy.sources }} {{ sources.length }}<Icon name="mdi:chevron-down" aria-hidden="true" /></summary>
          <div>
            <a v-for="link in sources" :key="link.url" :href="link.url" target="_blank" rel="noopener noreferrer"
              >{{ link.label }}<Icon name="mdi:arrow-top-right" aria-hidden="true"
            /></a>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatUsd, PLAN_ARTICLES, PLAN_PRICES_USD } from '~~/shared/utils/plans'

const { locale } = useI18n()
const isCs = computed(() => locale.value === 'cs')
const usd = (amount: number) => formatUsd(amount, locale.value)
const icons = { yes: 'mdi:check-circle', no: 'mdi:close-circle-outline' }

const tools = [
  { name: 'Topiqu', logo: '/brand/topiqu-mark.png', own: true },
  { name: 'Jasper', logo: '/brand/products/jasper.png', own: false },
  { name: 'Contentbase', logo: '/brand/products/contentbase.svg', own: false },
  { name: 'Writesonic', logo: '/brand/products/writesonic.svg', own: false },
  { name: 'Arvow', logo: '/brand/products/arvow.png', own: false },
]

// A tick only where public documentation or pricing describes the feature; a cross where we could not find it
// (October 2026). Columns follow `tools`: Topiqu, Jasper, Contentbase, Writesonic, Arvow.
const featureGroups = [
  {
    key: 'writing',
    features: [
      { key: 'knowledge', support: [true, true, false, true, true] },
      { key: 'research', support: [true, true, true, true, true] },
      { key: 'review', support: [true, false, false, true, false] },
      { key: 'imageRights', support: [true, false, false, false, false] },
    ],
  },
  {
    key: 'publishing',
    features: [
      { key: 'hosted', support: [true, false, true, false, false] },
      { key: 'wordpress', support: [true, true, true, true, true] },
      { key: 'scheduling', support: [true, false, true, false, true] },
      { key: 'hreflang', support: [true, false, false, false, false] },
      { key: 'api', support: [true, true, false, true, true] },
    ],
  },
  {
    key: 'after',
    features: [
      { key: 'searchConsole', support: [true, true, true, true, true] },
      { key: 'aiCitations', support: [true, true, false, true, true] },
      { key: 'aiTraffic', support: [true, false, false, true, false] },
      { key: 'autopilot', support: [true, false, true, false, false] },
    ],
  },
  {
    key: 'plans',
    features: [
      { key: 'free', support: [true, false, false, false, false] },
      { key: 'affordable', support: [true, false, false, false, true] },
    ],
  },
] as const

type GroupKey = (typeof featureGroups)[number]['key']
type FeatureKey = (typeof featureGroups)[number]['features'][number]['key']

const labels: Record<'cs' | 'en', Record<GroupKey, string> & Record<FeatureKey, readonly [string, string]>> = {
  cs: {
    writing: 'Psaní',
    publishing: 'Publikace',
    after: 'Po publikaci',
    plans: 'Tarify',
    knowledge: ['Znalostní báze z vašich dokumentů', 'Ceníky, poznámky, soubory i celý web.'],
    research: ['Živá rešerše na webu', 'Aktuální zdroje ke každému tématu.'],
    review: ['Kontrola tvrzení před vydáním', 'Sporná místa se vrátí k opravě.'],
    imageRights: ['Původ obrázků a práva k publikaci', 'U každého obrázku víte, odkud je a jestli ho smíte použít.'],
    hosted: ['Hostovaný blog na vlastní doméně', 'Bez šablony a vlastního hostingu.'],
    wordpress: ['Publikace do WordPressu', 'Články jako běžné příspěvky.'],
    scheduling: ['Plánované automatické vydávání', 'Rytmus vydávání nastavíte jednou.'],
    hreflang: ['Propojené jazykové verze článku', 'Vlastní URL a hreflang pro každý překlad.'],
    api: ['API pro integrace', 'Napojení na vlastní web či systémy.'],
    searchConsole: ['Data ze Search Console', 'Kliknutí, zobrazení a pozice.'],
    aiCitations: ['Sledování citací v odpovědích AI', 'Kdo je citován u vašich otázek.'],
    aiTraffic: ['Návštěvy z AI a AI crawlerů', 'Provoz, který Google Analytics nevidí.'],
    autopilot: ['Automatické úpravy vydaných článků', 'Podle dat, s možností změnu vrátit.'],
    free: ['Tarif zdarma bez časového limitu', 'Ruční editor a publikace; AI od tarifu Pro.'],
    affordable: ['Tarif s AI do 50 $ měsíčně', 'Při měsíční platbě.'],
  },
  en: {
    writing: 'Writing',
    publishing: 'Publishing',
    after: 'After publishing',
    plans: 'Plans',
    knowledge: ['Knowledge base from your documents', 'Pricing sheets, notes, files or your whole site.'],
    research: ['Live web research', 'Current sources for every topic.'],
    review: ['Claim review before publishing', 'Disputed claims go back for revision.'],
    imageRights: [
      'Image provenance and publishing rights',
      'Know where every image comes from and whether you may use it.',
    ],
    hosted: ['Hosted blog on your own domain', 'No theme or hosting to manage.'],
    wordpress: ['Publishing to WordPress', 'Articles arrive as regular posts.'],
    scheduling: ['Scheduled automatic publishing', 'Set your publishing rhythm once.'],
    hreflang: ['Linked language versions', 'Own URL and hreflang for every translation.'],
    api: ['API for integrations', 'Connect your own site or systems.'],
    searchConsole: ['Search Console data', 'Clicks, impressions and positions.'],
    aiCitations: ['AI answer citation tracking', 'Who gets cited for your questions.'],
    aiTraffic: ['AI referrals and AI crawler visits', 'Traffic Google Analytics does not show.'],
    autopilot: ['Automatic updates to published articles', 'Data-driven and reversible.'],
    free: ['Free plan with no time limit', 'Manual editor and publishing; AI from Pro.'],
    affordable: ['AI plan under $50 a month', 'With monthly billing.'],
  },
}

const groups = computed(() => {
  const text = labels[isCs.value ? 'cs' : 'en']
  return featureGroups.map((group) => ({
    label: text[group.key],
    rows: group.features.map((feature) => ({
      label: text[feature.key][0],
      hint: text[feature.key][1],
      support: feature.support,
    })),
  }))
})

const prices = computed(() =>
  isCs.value
    ? [
        { amount: usd(PLAN_PRICES_USD.pro), detail: `${PLAN_ARTICLES.pro} AI článků` },
        { amount: usd(69), detail: 'za uživatele' },
        { amount: usd(99), detail: '30 článků' },
        { amount: usd(99), detail: '15 článků' },
        { amount: usd(39), detail: 'akce, běžně 69 $' },
      ]
    : [
        { amount: usd(PLAN_PRICES_USD.pro), detail: `${PLAN_ARTICLES.pro} AI articles` },
        { amount: usd(69), detail: 'per seat' },
        { amount: usd(99), detail: '30 articles' },
        { amount: usd(99), detail: '15 articles' },
        { amount: usd(39), detail: 'offer, usually $69' },
      ],
)

const copy = computed(() =>
  isCs.value
    ? {
        eyebrow: 'SROVNÁNÍ',
        title: 'Co dostanete navíc',
        description:
          'Topiqu pokrývá celou cestu článku od podkladů po data z vyhledávání. Takhle vypadá srovnání s nástroji, na které narazíte nejčastěji.',
        feature: 'Funkce',
        yes: 'Ano',
        no: 'Ne',
        priceLabel: 'Nejnižší tarif s AI',
        priceHint: 'Měsíčně v USD, při měsíční platbě.',
        legendYes: 'popsáno ve veřejné dokumentaci nebo ceníku',
        legendNo: 've veřejné dokumentaci jsme nenašli',
        legendDate: 'Stav k říjnu 2026. Pokud je údaj nepřesný, napište nám.',
        sources: 'Zdroje',
        pagesLabel: 'Oblasti srovnání',
        previous: 'Předchozí oblast',
        next: 'Další oblast',
      }
    : {
        eyebrow: 'COMPARISON',
        title: 'What you get on top',
        description:
          'Topiqu covers the whole journey of an article, from your material to search data. Here is how it compares with the tools you are most likely to meet.',
        feature: 'Feature',
        yes: 'Yes',
        no: 'No',
        priceLabel: 'Lowest AI plan',
        priceHint: 'Per month in USD, billed monthly.',
        legendYes: 'described in public documentation or pricing',
        legendNo: 'not found in public documentation',
        legendDate: 'As of October 2026. If anything is inaccurate, let us know.',
        sources: 'Sources',
        pagesLabel: 'Comparison areas',
        previous: 'Previous area',
        next: 'Next area',
      },
)

// One feature group per page keeps the table short; the price row closes the last page.
const page = shallowRef(0)
const onKeydown = (event: KeyboardEvent) => {
  const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }
  const offset = offsets[event.key]
  if (!offset) return
  event.preventDefault()
  page.value = (page.value + offset + groups.value.length) % groups.value.length
  nextTick(() => document.getElementById(`comparison-tab-${page.value}`)?.focus())
}

const sources = [
  { label: 'Jasper · pricing', url: 'https://www.jasper.ai/pricing' },
  { label: 'Jasper · Knowledge Base', url: 'https://help.jasper.ai/hc/en-us/articles/55085018624411-Knowledge-Base' },
  { label: 'Jasper · Research Agent', url: 'https://help.jasper.ai/hc/en-us/articles/48810861467803-Research-Agent' },
  { label: 'Jasper · integrations', url: 'https://www.jasper.ai/integrations' },
  { label: 'Jasper · API', url: 'https://help.jasper.ai/hc/en-us/articles/18618701173659-Jasper-s-API' },
  {
    label: 'Jasper · Search Console',
    url: 'https://help.jasper.ai/hc/en-us/articles/55091361235355-Integrations-Google-Search-Console',
  },
  { label: 'Jasper · GEO Hub', url: 'https://help.jasper.ai/hc/en-us/articles/55317942235803-GEO-Hub' },
  { label: 'Contentbase · pricing & FAQ', url: 'https://contentbase.ai/pricing' },
  { label: 'Contentbase · docs', url: 'https://contentbase.ai/docs/' },
  { label: 'Contentbase · Go', url: 'https://contentbase.ai/docs/features/contentbase-go/' },
  { label: 'Writesonic · pricing', url: 'https://writesonic.com/pricing' },
  { label: 'Writesonic · docs & API', url: 'https://docs.writesonic.com/' },
  {
    label: 'Writesonic · Article Writer 6.0',
    url: 'https://cxotoday.com/media-coverage/writesonic-unveils-ai-article-writer-6-0-write-factually-accurate-articles-with-real-time-data-that-drive-traffic/',
  },
  { label: 'Arvow · pricing', url: 'https://arvow.com/pricing' },
  { label: 'Arvow · changelog', url: 'https://arvow.featurebase.app/en/changelog' },
]
</script>

<style scoped>
.comparison-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  margin-bottom: 18px;
}
.comparison-tabs {
  display: flex;
  gap: 4px;
  max-width: 100%;
  padding: 4px;
  overflow-x: auto;
  border: 1px solid var(--landing-line);
  border-radius: 999px;
  background: var(--landing-surface);
}
.comparison-tabs button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--landing-muted);
  font: inherit;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}
.comparison-tabs button:hover {
  color: var(--landing-ink);
}
.comparison-tabs button[aria-selected='true'] {
  background: var(--landing-tint);
  color: var(--landing-accent);
}
.comparison-tabs button:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 2px;
}
.comparison-tabs small {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding-inline: 5px;
  border-radius: 999px;
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-size: 11px;
  font-weight: 700;
}
.comparison-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--landing-muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.comparison-steps > span {
  margin-right: 4px;
}
.comparison-scroll {
  overflow-x: auto;
}
.comparison-scroll:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 4px;
}
.comparison-table {
  width: 100%;
  min-width: 860px;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  text-align: left;
}
.comparison-table th,
.comparison-table td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--landing-line);
  vertical-align: middle;
}
.comparison-table thead th {
  padding-block: 18px;
  border-bottom-color: var(--landing-ink);
  color: var(--landing-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  vertical-align: bottom;
}
.comparison-table thead th:first-child {
  width: 34%;
}
.comparison-table thead th:not(:first-child),
.comparison-table td {
  text-align: center;
}
.comparison-table tbody th strong {
  display: block;
  font-size: 15px;
  font-weight: 700;
}
.comparison-table tbody th small {
  display: block;
  margin-top: 2px;
  color: var(--landing-muted);
  font-size: 13px;
  font-weight: 500;
}
.comparison-tool {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--landing-ink);
  font-size: 14px;
  font-weight: 750;
  letter-spacing: -0.01em;
  text-transform: none;
}
.comparison-tool img {
  width: 32px;
  height: 32px;
  padding: 3px;
  border: 1px solid var(--landing-line);
  border-radius: 9px;
  background: #fff;
  object-fit: contain;
}
.comparison-mark {
  display: inline-grid;
  place-items: center;
  color: color-mix(in srgb, var(--landing-muted) 55%, transparent);
  font-size: 22px;
}
.comparison-mark[data-has] {
  color: var(--landing-success);
}
.comparison-table td[data-own] .comparison-mark[data-has] {
  color: var(--landing-accent);
  font-size: 24px;
}
/* Topiqu reads as one raised column running through the table. */
.comparison-table td[data-own],
.comparison-table thead th[data-own] {
  background: var(--landing-tint);
  box-shadow:
    inset 1px 0 var(--landing-accent),
    inset -1px 0 var(--landing-accent);
}
.comparison-table thead th[data-own] {
  border-radius: var(--topiqu-surface-radius) var(--topiqu-surface-radius) 0 0;
  border-bottom-color: var(--landing-accent);
  box-shadow:
    inset 1px 0 var(--landing-accent),
    inset -1px 0 var(--landing-accent),
    inset 0 1px var(--landing-accent);
}
.comparison-price td[data-own] {
  border-radius: 0 0 var(--topiqu-surface-radius) var(--topiqu-surface-radius);
  box-shadow:
    inset 1px 0 var(--landing-accent),
    inset -1px 0 var(--landing-accent),
    inset 0 -1px var(--landing-accent);
}
.comparison-table td[data-own] {
  border-bottom-color: color-mix(in srgb, var(--landing-accent) 25%, var(--landing-tint));
}
/* Pages without the price row close the Topiqu column on their last feature. */
.comparison-table[data-closed] tbody tr:last-child td[data-own] {
  border-radius: 0 0 var(--topiqu-surface-radius) var(--topiqu-surface-radius);
  border-bottom-color: transparent;
  box-shadow:
    inset 1px 0 var(--landing-accent),
    inset -1px 0 var(--landing-accent),
    inset 0 -1px var(--landing-accent);
}
.comparison-table[data-closed] tbody tr:last-child > * {
  border-bottom: 0;
}
.comparison-price > * {
  padding-block: 18px !important;
  border-bottom: 0 !important;
}
.comparison-price td strong {
  display: block;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.01em;
}
.comparison-price td small {
  display: block;
  margin-top: 2px;
  color: var(--landing-muted);
  font-size: 12px;
}
.comparison-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.comparison-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 22px;
  color: var(--landing-muted);
  font-size: 12px;
  line-height: 1.6;
}
.comparison-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.comparison-legend li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.comparison-legend .iconify {
  font-size: 16px;
}
.comparison-legend-yes {
  color: var(--landing-success);
}
.comparison-legend-no {
  color: color-mix(in srgb, var(--landing-muted) 55%, transparent);
}
.comparison-sources summary {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 650;
  cursor: pointer;
  list-style: none;
}
.comparison-sources summary::-webkit-details-marker {
  display: none;
}
.comparison-sources summary .iconify {
  font-size: 16px;
  transition: rotate 0.2s;
}
.comparison-sources[open] summary .iconify {
  rotate: 180deg;
}
.comparison-sources > div {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.comparison-sources a {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  border: 1px solid var(--landing-line);
  border-radius: 999px;
  color: var(--landing-muted);
  font-size: 11px;
  font-weight: 650;
  text-decoration: none;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.comparison-sources a:hover {
  border-color: var(--landing-accent);
  color: var(--landing-accent);
}

/* Narrow screens: the feature name spans the row and the five tools share the width beneath it. */
@media (max-width: 760px) {
  .comparison-table,
  .comparison-table thead,
  .comparison-table tbody {
    display: block;
    min-width: 0;
  }
  .comparison-table tr {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .comparison-table thead th:first-child {
    display: none;
  }
  .comparison-table th,
  .comparison-table td {
    padding: 8px 2px;
  }
  .comparison-table tbody th {
    grid-column: 1 / -1;
    padding: 14px 4px 4px;
    border-bottom: 0;
  }
  .comparison-table tbody th small {
    display: none;
  }
  .comparison-tool {
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0;
  }
  .comparison-tool img {
    width: 28px;
    height: 28px;
  }
  .comparison-mark,
  .comparison-table td[data-own] .comparison-mark[data-has] {
    font-size: 20px;
  }
  .comparison-price td strong {
    font-size: 14px;
  }
  .comparison-price td small {
    font-size: 10px;
    line-height: 1.3;
  }
}
</style>
