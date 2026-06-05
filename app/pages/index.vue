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

            <!-- Monetization card — banknote style -->
            <div
              class="md:row-span-2 rounded-3xl relative overflow-hidden flex flex-col group transition-all duration-300 bg-[#1b3a2a] border-2 border-emerald-700/50 shadow-2xl hover:shadow-emerald-950/60 hover:border-emerald-600/60 text-white"
            >
              <!-- Fine grid background (guilloche effect) -->
              <div
                class="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#4ade80_0,#4ade80_1px,transparent_1px,transparent_8px),repeating-linear-gradient(90deg,#4ade80_0,#4ade80_1px,transparent_1px,transparent_8px)]"
              ></div>
              <!-- Diagonal hatch overlay for texture depth -->
              <div
                class="absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(45deg,#86efac_0,#86efac_1px,transparent_1px,transparent_12px)]"
              ></div>
              <!-- Inner inset border (banknote frame) -->
              <div class="absolute inset-3 rounded-2xl border border-emerald-600/25 pointer-events-none"></div>
              <!-- Ghosted watermark — bottom-right corner, away from text -->
              <div class="absolute bottom-16 right-6 pointer-events-none select-none opacity-[0.06]">
                <span class="text-[8rem] font-black text-emerald-200 leading-none">$</span>
              </div>
              <!-- Vertical security thread -->
              <div
                class="absolute top-0 bottom-0 left-[38%] w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent pointer-events-none"
              ></div>

              <!-- Top: serial + denomination -->
              <div class="relative z-10 px-7 pt-7 flex justify-between items-start">
                <div class="font-mono text-[9px] text-emerald-400/50 leading-relaxed tracking-widest">
                  <div class="text-emerald-400/30 mb-0.5 text-[8px]">SERIAL NO.</div>
                  TPQ‑2026‑00124A
                </div>
                <div class="text-right">
                  <div class="text-4xl font-black text-emerald-300 leading-none tracking-tight">$$$</div>
                  <div class="text-[8px] font-mono text-emerald-400/40 mt-0.5 tracking-widest uppercase">Revenue</div>
                </div>
              </div>

              <!-- Middle: icon + content -->
              <div class="relative z-10 px-7 pt-5">
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-10 h-10 flex items-center justify-center bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-500/20 shrink-0"
                  >
                    <Icon name="mdi:currency-usd" size="20" />
                  </div>
                  <div class="h-px flex-1 bg-emerald-700/50"></div>
                  <span class="font-mono text-[9px] text-emerald-400/50 tracking-widest uppercase">Topiqu GAM</span>
                </div>

                <h3 class="text-xl font-bold text-white mb-3 leading-snug">
                  {{ $t('landing.specs.monetization.title') }}
                </h3>
                <p class="text-emerald-100/70 leading-relaxed text-sm mb-4">
                  {{ $t('landing.specs.monetization.desc') }}
                </p>

                <!-- Revenue stat pill -->
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full"
                >
                  <Icon name="mdi:trending-up" size="12" class="text-emerald-300" />
                  <span class="text-[11px] font-bold text-emerald-200 tracking-wide">+124% avg. revenue growth</span>
                </div>
              </div>

              <!-- Bottom: bar chart — mt-auto pushes it to bottom regardless of content height -->
              <div class="relative z-10 mx-5 mb-6 mt-auto pt-5">
                <div class="rounded-xl bg-black/30 border border-emerald-800/50 px-5 pt-4 pb-3">
                  <p class="text-[9px] text-emerald-400/50 font-mono uppercase tracking-widest mb-3">Monthly Revenue</p>
                  <div class="flex items-end justify-between gap-1.5 h-20">
                    <div class="flex flex-col items-center gap-1 flex-1">
                      <span class="text-[8px] font-mono text-emerald-400/60">$1.2k</span>
                      <div class="w-full rounded-t bg-emerald-600/50" style="height: 38%"></div>
                      <span class="text-[8px] text-emerald-400/50 font-mono">Jan</span>
                    </div>
                    <div class="flex flex-col items-center gap-1 flex-1">
                      <span class="text-[8px] font-mono text-emerald-400/60">$1.8k</span>
                      <div class="w-full rounded-t bg-emerald-500/60" style="height: 55%"></div>
                      <span class="text-[8px] text-emerald-400/50 font-mono">Feb</span>
                    </div>
                    <div class="flex flex-col items-center gap-1 flex-1">
                      <span class="text-[8px] font-mono text-emerald-400/60">$1.5k</span>
                      <div class="w-full rounded-t bg-emerald-500/70" style="height: 48%"></div>
                      <span class="text-[8px] text-emerald-400/50 font-mono">Mar</span>
                    </div>
                    <div class="flex flex-col items-center gap-1 flex-1">
                      <span class="text-[8px] font-mono text-emerald-300/70">$2.4k</span>
                      <div class="w-full rounded-t bg-emerald-400/80" style="height: 75%"></div>
                      <span class="text-[8px] text-emerald-400/60 font-mono">Apr</span>
                    </div>
                    <div class="flex flex-col items-center gap-1 flex-1">
                      <span class="text-[8px] font-mono font-bold text-emerald-300">$3.1k</span>
                      <div
                        class="w-full rounded-t bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.5)]"
                        style="height: 96%"
                      ></div>
                      <span class="text-[8px] font-bold text-emerald-300 font-mono">May</span>
                    </div>
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
