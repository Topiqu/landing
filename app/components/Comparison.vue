<template>
  <section id="comparison" class="landing-section comparison-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2>{{ copy.title }}</h2>
        <p>{{ copy.subtitle }}</p>
      </div>
      <div class="comparison-frame">
        <div class="comparison-scroll" tabindex="0" :aria-label="copy.title" role="region">
          <table class="comparison-table">
            <thead>
              <tr>
                <th scope="col" class="capability-heading">{{ copy.capability }}</th>
                <th
                  v-for="product in products"
                  :key="product.name"
                  scope="col"
                  :class="{ 'topiqu-column': product.topiqu }"
                >
                  <div class="comparison-product">
                    <span class="comparison-logo">
                      <span v-if="product.name === 'BlendScribe'" class="blendscribe-mark" aria-hidden="true">B</span>
                      <img v-else :src="product.logo" alt="" width="32" height="32" loading="lazy" />
                    </span>
                    <span>{{ product.name }}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.label">
                <th scope="row">{{ row.label }}</th>
                <td
                  v-for="(value, index) in row.values"
                  :key="index"
                  :class="{ 'topiqu-column': products[index]?.topiqu }"
                >
                  <ComparisonRating :value="value" :label="ratingWord(value)!" />
                </td>
              </tr>
              <tr class="comparison-fit">
                <th scope="row">{{ copy.bestFor }}</th>
                <td v-for="product in products" :key="product.name" :class="{ 'topiqu-column': product.topiqu }">
                  {{ product.fit }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="comparison-notes">
        <p><UIcon name="mdi:arrow-all" aria-hidden="true" />{{ copy.scroll }}</p>
        <p>{{ copy.methodology }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const isCs = computed(() => locale.value === 'cs')
const copy = computed(() =>
  isCs.value
    ? {
        eyebrow: 'Srovnání bez marketingové mlhy',
        title: 'Topiqu vs. specializované AI nástroje',
        subtitle:
          'Nejsme nejlepší v každé izolované disciplíně. Vyhráváme tam, kde tým potřebuje dostat kvalitní obsah od rešerše až na živý a měřitelný web.',
        capability: 'Schopnost',
        bestFit: 'Nejlepší all-in-one fit',
        bestFor: 'Nejlepší volba pro',
        scale: 'Jak číst hodnocení',
        scroll: 'Posuňte tabulku pro další nástroje a schopnosti',
        methodology: 'Stav k srpnu 2026. Dostupnost funkcí konkurentů se může lišit podle tarifu.',
      }
    : {
        eyebrow: 'A comparison without the marketing fog',
        title: 'Topiqu vs. specialized AI tools',
        subtitle:
          'We are not the best at every isolated discipline. We win when a team needs to move quality content from research to a live, measurable website.',
        capability: 'Capability',
        bestFit: 'Best all-in-one fit',
        bestFor: 'Best choice for',
        scale: 'Reading the ratings',
        scroll: 'Scroll to compare more tools and capabilities',
        methodology: 'As of August 2026. Competitor feature availability may vary by plan.',
      },
)

const products = computed(() => [
  {
    name: 'Topiqu',
    logo: '/brand/topiqu-mark.png?v=20260910',
    topiqu: true,
    fit: isCs.value ? 'Kompletní obsahový provoz v jednom systému' : 'Complete content operations in one system',
  },
  {
    name: 'Contentbase',
    logo: '/brand/products/contentbase.svg',
    fit: isCs.value ? 'Autonomní SEO obsah ve velkém' : 'Autonomous SEO content at scale',
  },
  {
    name: 'NextBlog',
    logo: '/brand/products/nextblog.ico',
    fit: isCs.value ? 'Jednoduchý blog na autopilota' : 'Simple blog on autopilot',
  },
  {
    name: 'EdgeBlog',
    logo: '/brand/products/edgeblog.svg',
    fit: isCs.value ? 'SEO/GEO automatizace pro B2B SaaS' : 'SEO/GEO automation for B2B SaaS',
  },
  {
    name: 'BlendScribe',
    logo: '',
    fit: isCs.value ? 'Technicky AI-readable blog na vlastní doméně' : 'Technical AI-readable blog on your domain',
  },
  {
    name: 'Jasper',
    logo: '/brand/products/jasper.png',
    fit: isCs.value ? 'Enterprise brand a marketingové workflow' : 'Enterprise brand and marketing workflows',
  },
  {
    name: 'HubSpot',
    logo: '/brand/products/hubspot.png',
    fit: isCs.value ? 'CRM, kampaně a obsah v jednom ekosystému' : 'CRM, campaigns, and content in one ecosystem',
  },
])
const labels = computed(() =>
  isCs.value
    ? [
        'AI rešerše a dlouhé články',
        'Práce se zdroji a citacemi',
        'SEO optimalizace',
        'AEO/GEO-ready publikace',
        'Monitoring viditelnosti v AI',
        'Brand voice a znalost značky',
        'Vlastní CMS, web a doména',
        'Plánování a automatická publikace',
        'Překlady a redakční schválení',
        'API / WordPress integrace',
        'Čtenářský engagement a komunita',
      ]
    : [
        'AI research and long-form articles',
        'Sources and citations',
        'SEO optimization',
        'AEO/GEO-ready publishing',
        'AI visibility monitoring',
        'Brand voice and brand knowledge',
        'Native CMS, website, and domain',
        'Scheduling and automated publishing',
        'Translations and editorial approval',
        'API / WordPress integrations',
        'Reader engagement and community',
      ],
)
const matrix: number[][] = [
  [5, 5, 4, 5, 4, 4, 4],
  [5, 5, 3, 5, 4, 4, 3],
  [5, 5, 5, 5, 4, 3, 4],
  [5, 4, 5, 5, 5, 3, 4],
  [3, 2, 2, 5, 1, 1, 4],
  [5, 5, 3, 4, 5, 5, 5],
  [5, 5, 4, 5, 5, 1, 5],
  [5, 5, 5, 5, 3, 4, 5],
  [5, 5, 3, 2, 3, 5, 5],
  [5, 5, 4, 4, 3, 5, 5],
  [5, 1, 1, 1, 1, 1, 3],
]
const rows = computed(() => labels.value.map((label, index) => ({ label, values: matrix[index]! })))
const ratingWord = (rating: number) => {
  const cs = ['Minimální', 'Základní', 'Dobré', 'Velmi dobré', 'Špičkové']
  const en = ['Minimal', 'Basic', 'Good', 'Very good', 'Leading']
  return (isCs.value ? cs : en)[rating - 1]
}
</script>

<style scoped>
.comparison-frame {
  border: 1px solid var(--landing-line);
  border-radius: var(--ui-radius);
  overflow: hidden;
}
.comparison-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
}
.comparison-table th,
.comparison-table td {
  padding: 13px 10px;
  border-bottom: 1px solid var(--landing-line);
  text-align: center;
}
.comparison-table thead th {
  background: var(--landing-surface);
  padding-block: 23px;
}
.comparison-table th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  padding-inline: 22px;
  background: var(--landing-surface);
  text-align: left;
  font-weight: 600;
  border-right: 1px solid var(--landing-line);
}
.comparison-table thead th:first-child {
  z-index: 3;
  color: var(--landing-muted);
}
.comparison-table .topiqu-column {
  background: #fafaff;
  border-inline: 1px solid var(--landing-line);
}
.comparison-table thead .topiqu-column {
  background: #fafaff;
  box-shadow: inset 0 3px #4338ca;
}
.comparison-table tbody tr:last-child > * {
  border-bottom: 0;
}
.comparison-table tbody tr:hover > * {
  box-shadow: inset 0 0 0 9999px rgb(100 116 139 / 5%);
}
.comparison-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}
.comparison-logo {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: white;
}
.comparison-logo img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.blendscribe-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #71d5ff, #36e0a1 52%, #ffb86b);
  color: #03110f;
  font:
    900 18px/1 Inter,
    sans-serif;
}
.comparison-fit td {
  font-size: 11px;
  line-height: 1.7;
  vertical-align: top;
  color: var(--landing-muted);
  padding-block: 22px;
}
.comparison-notes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  color: var(--landing-muted);
  font-size: 11px;
  line-height: 1.6;
}
.comparison-notes p {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
}
:global(.dark .comparison-table .topiqu-column) {
  background: #1a2335;
  border-inline-color: #313a60;
}
:global(.dark .comparison-table thead .topiqu-column) {
  background: #1a2335;
  box-shadow: inset 0 3px #a5b4fc;
}
@media (max-width: 640px) {
  .comparison-table {
    min-width: 1040px;
  }
  .comparison-table th:first-child {
    width: 142px;
    min-width: 142px;
    max-width: 142px;
    padding-inline: 12px;
    font-size: 12px;
  }
}
</style>
