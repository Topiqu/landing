<template>
  <section id="comparison" class="border-t border-slate-200 px-6 py-24 dark:border-white/5">
    <div class="mx-auto max-w-7xl">
      <div class="mx-auto mb-12 max-w-3xl text-center">
        <p class="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">{{ copy.eyebrow }}</p>
        <h2 class="mb-5 text-3xl font-black text-slate-900 md:text-5xl dark:text-white">{{ copy.title }}</h2>
        <p class="text-lg leading-8 text-slate-600 dark:text-slate-300">{{ copy.subtitle }}</p>
      </div>

      <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e0e0e]">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1280px] border-collapse text-sm">
            <thead><tr class="border-b border-slate-200 dark:border-slate-800">
              <th class="sticky left-0 z-20 min-w-64 bg-white px-5 py-5 text-left font-bold text-slate-500 dark:bg-[#0e0e0e] dark:text-slate-400">{{ copy.capability }}</th>
              <th v-for="product in products" :key="product.name" :class="product.topiqu ? highlightHead : regularHead">
                {{ product.name }}
                <span v-if="product.topiqu" class="mt-1 block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">{{ copy.bestFit }}</span>
              </th>
            </tr></thead>
            <tbody>
              <tr v-for="row in rows" :key="row.label" class="border-b border-slate-100 last:border-0 dark:border-slate-800/70">
                <th class="sticky left-0 z-10 bg-white px-5 py-4 text-left font-semibold text-slate-800 dark:bg-[#0e0e0e] dark:text-slate-200">{{ row.label }}</th>
                <td v-for="(value, index) in row.values" :key="index" :class="products[index]?.topiqu ? highlightCell : regularCell">
                  <span :class="ratingClass(value)" :aria-label="ratingLabel(value)">
                    <strong class="block text-base">{{ value }}/5</strong>
                    <span class="block text-[10px] font-semibold uppercase tracking-wide">{{ ratingWord(value) }}</span>
                  </span>
                </td>
              </tr>
              <tr>
                <th class="sticky left-0 z-10 bg-white px-5 py-5 text-left font-bold text-slate-900 dark:bg-[#0e0e0e] dark:text-white">{{ copy.bestFor }}</th>
                <td v-for="product in products" :key="product.name" :class="product.topiqu ? highlightFit : regularFit">{{ product.fit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-3 text-xs leading-5 text-slate-500 md:flex-row md:justify-between dark:text-slate-400">
        <p class="m-0">{{ copy.scale }}</p>
        <p class="m-0 max-w-3xl md:text-right">{{ copy.methodology }}</p>
      </div>

      <div class="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-500/20 dark:bg-indigo-500/10">
        <h3 class="mb-2 text-lg font-bold text-slate-900 dark:text-white">{{ copy.verdictTitle }}</h3>
        <p class="m-0 leading-7 text-slate-700 dark:text-slate-300">{{ copy.verdict }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const isCs = computed(() => locale.value === 'cs')
const copy = computed(() => isCs.value ? {
  eyebrow: 'Srovnání bez marketingové mlhy', title: 'Topiqu vs. specializované AI nástroje',
  subtitle: 'Nejsme nejlepší v každé izolované disciplíně. Vyhráváme tam, kde tým potřebuje dostat kvalitní obsah od rešerše až na živý a měřitelný web.',
  capability: 'Schopnost', bestFit: 'Nejlepší all-in-one fit', bestFor: 'Nejlepší volba pro', scale: '1 = minimální · 3 = dobré · 5 = špičkové',
  methodology: 'Stav k srpnu 2026. Dostupnost funkcí konkurentů se může lišit podle tarifu.',
  verdictTitle: 'Kde Topiqu objektivně vyhrává', verdict: 'V šíři jednoho provozního řešení pro menší a střední tým: zdrojovaný AI obsah, redakční workflow, překlady, CMS a vlastní doména, API/WordPress i komunita. EdgeBlog je silnější v měření GEO, Contentbase v čistě autonomním SEO provozu, BlendScribe v technických výstupech pro answer engines, Jasper v enterprise brand governance a HubSpot v CRM a kampaních.'
} : {
  eyebrow: 'A comparison without the marketing fog', title: 'Topiqu vs. specialized AI tools',
  subtitle: 'We are not the best at every isolated discipline. We win when a team needs to move quality content from research to a live, measurable website.',
  capability: 'Capability', bestFit: 'Best all-in-one fit', bestFor: 'Best choice for', scale: '1 = minimal · 3 = good · 5 = leading',
  methodology: 'As of August 2026. Competitor feature availability may vary by plan.',
  verdictTitle: 'Where Topiqu objectively wins', verdict: 'In the breadth of one operational system for a lean team: source-backed AI content, editorial workflow, translations, CMS and custom domain, API/WordPress, and community. EdgeBlog is stronger at GEO measurement, Contentbase at autonomous SEO operations, BlendScribe at technical answer-engine outputs, Jasper at enterprise brand governance, and HubSpot at CRM and campaigns.'
})

const products = computed(() => [
  { name: 'Topiqu', topiqu: true, fit: isCs.value ? 'Kompletní obsahový provoz v jednom systému' : 'Complete content operations in one system' },
  { name: 'Contentbase', fit: isCs.value ? 'Autonomní SEO obsah ve velkém' : 'Autonomous SEO content at scale' },
  { name: 'NextBlog', fit: isCs.value ? 'Jednoduchý blog na autopilota' : 'Simple blog on autopilot' },
  { name: 'EdgeBlog', fit: isCs.value ? 'SEO/GEO automatizace pro B2B SaaS' : 'SEO/GEO automation for B2B SaaS' },
  { name: 'BlendScribe', fit: isCs.value ? 'Technicky AI-readable blog na vlastní doméně' : 'Technical AI-readable blog on your domain' },
  { name: 'Jasper', fit: isCs.value ? 'Enterprise brand a marketingové workflow' : 'Enterprise brand and marketing workflows' },
  { name: 'HubSpot', fit: isCs.value ? 'CRM, kampaně a obsah v jednom ekosystému' : 'CRM, campaigns, and content in one ecosystem' },
])
const labels = computed(() => isCs.value
  ? ['AI rešerše a dlouhé články','Práce se zdroji a citacemi','SEO optimalizace','AEO/GEO-ready publikace','Monitoring viditelnosti v AI','Brand voice a znalost značky','Vlastní CMS, web a doména','Plánování a automatická publikace','Překlady a redakční schválení','API / WordPress integrace','Čtenářský engagement a komunita']
  : ['AI research and long-form articles','Sources and citations','SEO optimization','AEO/GEO-ready publishing','AI visibility monitoring','Brand voice and brand knowledge','Native CMS, website, and domain','Scheduling and automated publishing','Translations and editorial approval','API / WordPress integrations','Reader engagement and community'])
const matrix: number[][] = [
  [5,5,4,5,4,4,4],[5,5,3,5,4,4,3],[4,5,5,5,4,3,4],[4,4,5,5,5,3,4],
  [1,2,2,5,1,1,4],[5,5,3,4,5,5,5],[5,5,4,5,5,1,5],[5,5,5,5,3,4,5],
  [5,5,3,2,3,5,5],[5,5,4,4,3,5,5],[5,1,1,1,1,1,3],
]
const rows = computed(() => labels.value.map((label, index) => ({ label, values: matrix[index]! })))
const highlightHead = 'min-w-32 bg-indigo-50 px-4 py-5 text-center font-black text-slate-900 dark:bg-indigo-500/15 dark:text-white'
const regularHead = 'min-w-32 px-4 py-5 text-center font-bold text-slate-800 dark:text-slate-200'
const highlightCell = 'bg-indigo-50/70 px-4 py-4 text-center dark:bg-indigo-500/10'
const regularCell = 'px-4 py-4 text-center'
const highlightFit = 'bg-indigo-50/70 px-4 py-5 text-center text-xs font-semibold leading-5 text-slate-700 dark:bg-indigo-500/10 dark:text-slate-200'
const regularFit = 'px-4 py-5 text-center text-xs leading-5 text-slate-600 dark:text-slate-400'
const ratingWord = (rating: number) => {
  const cs = ['Minimální', 'Základní', 'Dobré', 'Velmi dobré', 'Špičkové']
  const en = ['Minimal', 'Basic', 'Good', 'Very good', 'Leading']
  return (isCs.value ? cs : en)[rating - 1]
}
const ratingClass = (rating: number) => rating >= 5 ? 'text-emerald-600 dark:text-emerald-400' : rating >= 4 ? 'text-indigo-600 dark:text-indigo-400' : rating >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
const ratingLabel = (rating: number) => `${rating}/5 — ${ratingWord(rating)}`
</script>
