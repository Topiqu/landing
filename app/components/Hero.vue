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

            <!-- Card-sized wrapper — floating chips position relative to this, not the column -->
            <div class="relative w-[260px] sm:w-[320px] lg:w-[400px]">
              <!-- Floating chip: AI writing — refined glass, product-specific -->
              <div
                class="absolute -top-4 -left-8 lg:-left-14 z-30 flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg animate-float-slow"
              >
                <span
                  class="flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shrink-0"
                >
                  <Icon name="mdi:auto-fix" class="text-[15px]" />
                </span>
                <div class="leading-tight">
                  <div class="text-[11px] font-bold text-slate-900 dark:text-white">
                    {{ $t('landing.hero.card.writing') }}
                  </div>
                  <div class="flex items-center gap-0.5 mt-1">
                    <span class="w-1 h-1 rounded-full bg-indigo-400 animate-typing-dot"></span>
                    <span class="w-1 h-1 rounded-full bg-indigo-400 animate-typing-dot [animation-delay:.16s]"></span>
                    <span class="w-1 h-1 rounded-full bg-indigo-400 animate-typing-dot [animation-delay:.32s]"></span>
                  </div>
                </div>
              </div>

              <!-- Floating chip: SEO score — calm, single accent -->
              <div
                class="absolute top-28 -right-6 lg:-right-12 z-30 flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg animate-float-delayed"
              >
                <span
                  class="flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0"
                >
                  <Icon name="mdi:speedometer" class="text-[15px]" />
                </span>
                <div class="leading-tight">
                  <div class="text-[11px] font-bold text-slate-900 dark:text-white leading-none mb-0.5">100/100</div>
                  <div class="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {{ $t('landing.hero.card.score') }}
                  </div>
                </div>
              </div>

              <!-- Card -->
              <div
                class="w-full h-[320px] sm:h-[400px] lg:h-[500px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden lg:transform lg:rotate-y-6 lg:hover:rotate-y-0 transition-transform duration-700 ease-out group"
              >
                <!-- Minimal browser bar — product context, not a hacker terminal -->
                <div class="flex items-center px-4 lg:px-5 pt-4 lg:pt-5">
                  <div
                    class="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10"
                  >
                    <Icon name="mdi:lock" class="text-[11px] text-emerald-500 shrink-0" />
                    <span class="font-mono text-[10px] lg:text-[11px] text-slate-500 dark:text-slate-400 truncate"
                      >topiqu.com/blog</span
                    >
                  </div>
                </div>

                <!-- Mascot — the star -->
                <div class="relative flex-1 flex items-end justify-center min-h-0">
                  <NuxtImg
                    src="/topik_normal_rm.png"
                    width="320"
                    height="380"
                    :preload="true"
                    fetchpriority="high"
                    loading="eager"
                    decoding="sync"
                    alt="Topiqu mascot"
                    class="w-[190px] sm:w-[240px] lg:w-[290px] relative z-10 drop-shadow-2xl transition-transform group-hover:scale-105 duration-300"
                  />
                </div>

                <!-- Editor panel — a post writing itself, framed as real product UI -->
                <div
                  class="relative z-20 m-3 lg:m-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 backdrop-blur border border-slate-200/70 dark:border-white/10 px-4 py-3 shadow-lg"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span
                      class="flex items-center justify-center w-5 h-5 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shrink-0"
                    >
                      <Icon name="mdi:star-four-points" class="text-[11px]" />
                    </span>
                    <span
                      class="text-[9px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400"
                      >{{ $t('landing.hero.card.draft') }}</span
                    >
                    <span class="ml-auto text-[9px] font-mono text-slate-400 dark:text-slate-500">{{
                      $t('landing.hero.card.read')
                    }}</span>
                  </div>
                  <p class="text-[13px] lg:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {{ $t('landing.hero.card.headline')
                    }}<span class="inline-block w-px h-[0.9em] align-[-0.1em] bg-indigo-500 ml-0.5 animate-caret"></span>
                  </p>
                  <div class="mt-2.5 h-1 rounded-full bg-slate-200/70 dark:bg-white/5 overflow-hidden">
                    <div
                      class="h-full w-2/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-shimmer-bar"
                    ></div>
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

/* Typing dots — the "AI is writing" chip */
@keyframes typing-dot {
  0%,
  60%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
.animate-typing-dot {
  animation: typing-dot 1.4s ease-in-out infinite;
}

/* Blinking caret at the end of the generated headline */
@keyframes caret {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
.animate-caret {
  animation: caret 1s steps(1) infinite;
}

/* Indeterminate progress — "generating" */
@keyframes shimmer-bar {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}
.animate-shimmer-bar {
  animation: shimmer-bar 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-typing-dot,
  .animate-caret,
  .animate-shimmer-bar,
  .animate-float-slow,
  .animate-float-delayed {
    animation: none;
  }
}
</style>
