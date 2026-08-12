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

            <!-- Publishing workflow card -->
            <div
              class="md:row-span-2 group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl dark:border-slate-800 dark:bg-[#0E0E0E]"
            >
              <div class="absolute right-0 top-0 p-32 bg-emerald-500/5 blur-3xl transition-colors group-hover:bg-emerald-500/10" />
              <div class="relative z-10 flex h-full flex-col">
                <div class="mb-6 flex items-center gap-3">
                  <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Icon name="mdi:publish" size="28" />
                  </div>
                  <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Content operations</span>
                </div>
                <h3 class="mb-3 text-xl font-bold leading-snug text-slate-900 dark:text-white">{{ $t('landing.specs.publishing.title') }}</h3>
                <p class="mb-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{{ $t('landing.specs.publishing.desc') }}</p>
                <ul class="mt-auto space-y-4">
                  <li v-for="item in ['review', 'locales', 'domain', 'distribution']" :key="item" class="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Icon name="mdi:check-circle" class="shrink-0 text-emerald-500" />
                    {{ $t(`landing.specs.publishing.list.${item}`) }}
                  </li>
                </ul>
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

      <section class="border-t border-slate-200 px-6 py-20 dark:border-white/5" aria-labelledby="about-topiqu">
        <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#0e0e0e]">
            <p class="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Topiqu</p>
            <h2 id="about-topiqu" class="mb-4 text-2xl font-black text-slate-900 dark:text-white">{{ $t('landing.purpose.title') }}</h2>
            <p class="m-0 leading-7 text-slate-700 dark:text-slate-300">{{ $t('landing.purpose.description') }}</p>
          </div>
          <div class="rounded-3xl border border-blue-200 bg-blue-50 p-8 dark:border-blue-500/20 dark:bg-blue-500/10">
            <div class="mb-4 flex items-center gap-3">
              <Icon name="mdi:google" size="26" class="text-blue-600 dark:text-blue-400" />
              <h2 class="m-0 text-2xl font-black text-slate-900 dark:text-white">{{ $t('landing.purpose.gscTitle') }}</h2>
            </div>
            <p class="m-0 leading-7 text-slate-700 dark:text-slate-300">{{ $t('landing.purpose.gscDescription') }}</p>
            <NuxtLinkLocale to="/privacy-policy" class="mt-5 inline-flex font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 dark:text-blue-300">
              {{ $t('landing.purpose.privacyLink') }}
            </NuxtLinkLocale>
          </div>
        </div>
      </section>

      <LazyComparison />

      <LazyPricing />

      <LazyFaq />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: 'Topiqu — AI Content Operations',
  description: () => t('landing.hero.subtitle'),
  ogTitle: 'Topiqu — AI Content Operations',
  ogDescription: () => t('landing.hero.subtitle'),
  ogType: 'website',
})

useSchemaOrg([
  defineWebSite({ name: 'Topiqu', description: () => t('landing.hero.subtitle') }),
  defineWebPage({ name: 'Topiqu — AI Content Operations' }),
])

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
