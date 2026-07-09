<template>
  <div
    class="min-h-screen bg-[#F8FAFC] dark:bg-[#020408] text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden"
  >
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse"
      />
      <div
        class="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
    </div>

    <div class="relative z-10">
      <Hero @scroll="scrollToSection" />

      <section id="specs" class="py-24 px-6 relative border-t border-slate-200 dark:border-white/5">
        <div class="max-w-7xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-20">
            <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              {{ $t('landing.specs.title') }}
            </h2>
            <p class="text-lg text-slate-700 dark:text-slate-300 font-medium">
              {{ $t('landing.specs.subtitle') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            <!-- AI card -->
            <div
              class="md:col-span-2 group relative p-8 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"
              ></div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-700 dark:text-indigo-400">
                    <Icon name="mdi:robot-happy-outline" size="28" />
                  </div>
                  <span
                    class="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-full uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    {{ $t('landing.specs.ai.badge') }}
                  </span>
                </div>

                <h3
                  class="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors"
                >
                  {{ $t('landing.specs.ai.title') }}
                </h3>
                <p class="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
                  {{ $t('landing.specs.ai.desc') }}
                </p>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, key) in ['enhance', 'vibe', 'helpfulness']"
                    :key="key"
                    class="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Icon name="mdi:check-decagram" size="14" class="text-indigo-600 dark:text-indigo-400" />
                    {{ $t(`landing.specs.ai.tags.${tag}`) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Monetization card — revenue growth, clarity-led -->
            <div
              class="md:row-span-2 group relative p-8 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <!-- Soft corner glow -->
              <div
                class="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"
              ></div>

              <div class="relative z-10 flex flex-col h-full">
                <!-- Header: icon + label + live pill -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <Icon name="mdi:cash-multiple" size="28" />
                    </div>
                    <span
                      class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
                      >Topiqu GAM</span
                    >
                  </div>
                  <div
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                  >
                    <span class="relative flex h-1.5 w-1.5">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"
                      ></span>
                      <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span class="text-[10px] font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">live</span>
                  </div>
                </div>

                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                  {{ $t('landing.specs.monetization.title') }}
                </h3>
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-sm mb-6">
                  {{ $t('landing.specs.monetization.desc') }}
                </p>

                <!-- Headline number + minimal area trend, pinned to bottom -->
                <div class="mt-auto">
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">+124%</span>
                    <Icon name="mdi:trending-up" size="20" class="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p class="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold mt-1 mb-5">
                    avg. revenue growth
                  </p>

                  <div class="relative h-16">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="w-full h-full">
                      <defs>
                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
                          <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,34 C14,31 22,25 33,25 C46,25 52,15 66,12 C80,9 88,5 100,3 L100,40 L0,40 Z"
                        fill="url(#revFill)"
                      />
                      <path
                        d="M0,34 C14,31 22,25 33,25 C46,25 52,15 66,12 C80,9 88,5 100,3"
                        fill="none"
                        stroke="#10b981"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        vector-effect="non-scaling-stroke"
                      />
                    </svg>
                    <span
                      class="absolute right-0 top-0.5 flex h-2.5 w-2.5 -translate-x-1/2"
                      style="filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))"
                    >
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"
                      ></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security card -->
            <div
              class="group p-8 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300"
            >
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-500">
                  <Icon name="mdi:shield-check" size="28" />
                </div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                  {{ $t('landing.specs.security.title') }}
                </h3>
              </div>
              <ul class="space-y-3">
                <li
                  v-for="item in ['rbac', 'mfa', 'hashing', 'antibot']"
                  :key="item"
                  class="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <div class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                  {{ $t(`landing.specs.security.list.${item}`) }}
                </li>
              </ul>
            </div>

            <!-- API card -->
            <div
              class="group p-8 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                  {{ $t('landing.specs.api.title') }}
                </h3>
                <span
                  class="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400"
                  >{{ $t('landing.specs.api.type') }}</span
                >
              </div>
              <p class="text-sm text-slate-700 dark:text-slate-300 mb-6">
                {{ $t('landing.specs.api.desc') }}
              </p>
              <div
                class="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden font-mono text-[10px] md:text-xs text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-800"
              >
                <span class="text-purple-600 dark:text-purple-400">const</span>
                { data } = <span class="text-purple-600 dark:text-purple-400">useFetch</span>(...)
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazyPricing />

      <LazyFaq />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: 'Topiqu — AI Blog Platform',
  description: () => t('landing.hero.subtitle'),
  ogTitle: 'Topiqu — AI Blog Platform',
  ogDescription: () => t('landing.hero.subtitle'),
  ogType: 'website',
})

useSchemaOrg([
  defineWebSite({ name: 'Topiqu', description: () => t('landing.hero.subtitle') }),
  defineWebPage({ name: 'Topiqu — AI Blog Platform' }),
])

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
