<template>
  <div class="relative w-full pt-22">
    <div class="absolute inset-0 z-0 pointer-events-none">
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
      <div class="pt-10 pb-20 px-6 md:pt-20 md:pb-32 max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div class="text-center lg:text-left relative z-20">
            <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm mb-8"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span class="text-xs font-bold tracking-wide uppercase text-indigo-700 dark:text-indigo-300">
                {{ $t('landing.hero.badge') }}
              </span>
            </div>

            <h1
              class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]"
            >
              {{ $t('landing.hero.title_prefix') }} <br class="hidden lg:block" />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 animate-gradient-x bg-[length:200%_auto]"
              >
                {{ $t('landing.hero.title_suffix') }}
              </span>
            </h1>

            <p
              class="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-10 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0"
            >
              {{ $t('landing.hero.subtitle') }}
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                variant="primary"
                size="lg"
                animation="softpop"
                icon="mdi:arrow-right"
                iconPosition="right"
                class="w-full sm:w-auto shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)]"
                @click="navigateTo(localePath('/onboarding'))"
              >
                {{ $t('common.actions.get_started') }}
              </Button>

              <Button
                variant="neutral"
                size="lg"
                class="w-full sm:w-auto bg-white dark:bg-slate-900"
                @click="$emit('scroll', 'specs')"
              >
                {{ $t('common.actions.learn_more') }}
              </Button>
            </div>

            <div
              class="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap justify-center lg:justify-start gap-8"
            >
              <div class="flex items-center gap-2">
                <Icon name="mdi:check-circle" class="text-emerald-600 dark:text-emerald-400" />
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {{ $t('landing.hero.stats.score') }} 100/100
                </span>
              </div>
            </div>
          </div>

          <div class="relative perspective-1000 flex justify-center">
            <!-- Background glow blob -->
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-full blur-[80px] opacity-30 dark:opacity-20 animate-pulse-slow pointer-events-none"
            ></div>

            <!-- Card-sized wrapper — badges position relative to this, not the column -->
            <div class="relative w-[260px] sm:w-[320px] lg:w-[400px]">
              <!-- Revenue — left side, near top -->
              <div
                class="absolute top-6 -left-12 lg:-left-16 bg-white dark:bg-[#151515] px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 flex items-center gap-2.5 lg:gap-3 animate-float-slow z-20"
              >
                <div
                  class="w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 shrink-0"
                >
                  <Icon name="mdi:chart-line-variant" class="text-[18px] lg:text-[22px]" />
                </div>
                <div>
                  <div
                    class="text-[10px] lg:text-xs text-slate-400 uppercase font-bold tracking-wider leading-none mb-0.5"
                  >
                    Revenue
                  </div>
                  <div class="text-sm lg:text-base font-bold text-slate-900 dark:text-white leading-none">+ 124%</div>
                </div>
              </div>

              <!-- SEO — right side, a bit lower than Revenue -->
              <div
                class="absolute top-20 -right-16 lg:-right-20 bg-white dark:bg-[#151515] px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 flex items-center gap-2.5 lg:gap-3 animate-float-delayed z-20"
              >
                <div
                  class="w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0"
                >
                  <Icon name="mdi:google" class="text-[18px] lg:text-[22px]" />
                </div>
                <div>
                  <div
                    class="text-[10px] lg:text-xs text-slate-400 uppercase font-bold tracking-wider leading-none mb-0.5"
                  >
                    SEO Index
                  </div>
                  <div class="text-sm lg:text-base font-bold text-slate-900 dark:text-white leading-none">
                    Optimized
                  </div>
                </div>
              </div>

              <!-- Card -->
              <div
                class="w-full h-[320px] sm:h-[400px] lg:h-[500px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-2xl flex flex-col items-center justify-end overflow-hidden lg:transform lg:rotate-y-6 lg:hover:rotate-y-0 transition-transform duration-700 ease-out group"
              >
                <NuxtImg
                  src="/topik_normal_rm.png"
                  width="320"
                  height="380"
                  :preload="true"
                  fetchpriority="high"
                  loading="eager"
                  decoding="sync"
                  alt="Topiqu mascot"
                  class="w-[210px] sm:w-[260px] lg:w-[320px] relative z-10 -bottom-4 drop-shadow-2xl transition-transform group-hover:scale-105 duration-300"
                />

                <div class="w-full bg-slate-900 p-3 lg:p-4 border-t border-slate-700">
                  <div class="flex gap-1.5 mb-1.5 lg:mb-2">
                    <div class="w-2 h-2 rounded-full bg-red-500"></div>
                    <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div class="font-mono text-[9px] lg:text-[10px] text-slate-300">
                    <span class="text-purple-400">ai</span>.generate(<span class="text-green-400">'viral_post'</span>)
                    <br />
                    <span class="text-blue-400">>></span> Processing... Done.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

defineEmits<{
  (e: 'scroll', id: string): void
}>()
</script>

<style scoped>
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
.animate-float-slow {
  animation: float-slow 4s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite 1s;
}

.perspective-1000 {
  perspective: 1000px;
}
</style>
