<template>
  <section
    id="workflow"
    class="scroll-mt-20 border-b border-brand-line bg-brand-surface px-6 py-24 dark:border-white/10 dark:bg-[#111418] md:py-32"
  >
    <div class="relative mx-auto max-w-7xl">
      <NuxtImg
        src="/topik_empty_rm.png"
        width="150"
        height="150"
        alt=""
        class="absolute -right-3 -top-12 hidden w-32 rotate-3 opacity-90 lg:block"
      />
      <div class="relative z-10 mx-auto mb-16 max-w-3xl text-center">
        <p class="eyebrow justify-center">{{ $t('landing.specs.workflow.eyebrow') }}</p>
        <h2 class="section-title">{{ $t('landing.specs.workflow.sectionTitle') }}</h2>
        <p class="section-lede mt-5">{{ $t('landing.specs.workflow.subtitle') }}</p>
      </div>

      <ol class="border-t border-brand-line dark:border-slate-700">
        <li
          v-for="(step, index) in workflow"
          :key="step.key"
          class="grid gap-7 border-b border-brand-line py-10 dark:border-slate-700 md:grid-cols-[72px_0.8fr_1.2fr] md:gap-10 md:py-14"
        >
          <span class="font-mono text-sm text-brand-muted">0{{ index + 1 }}</span>
          <div>
            <h3 class="mb-3 text-2xl font-semibold tracking-tight text-brand-ink dark:text-white">{{ step.title }}</h3>
            <p class="max-w-md leading-7 text-brand-muted dark:text-slate-300">{{ step.desc }}</p>
          </div>

          <div class="rounded-xl border border-brand-line bg-[#f4f1e9] p-5 dark:border-slate-700 dark:bg-[#080a0d]">
            <template v-if="step.key === 'research'">
              <div class="mb-5 flex items-center justify-between border-b border-brand-line pb-4 dark:border-slate-700">
                <span class="text-sm font-semibold">{{ $t('landing.specs.workflow.research.uiTitle') }}</span>
                <span class="text-xs text-brand-muted">6 {{ $t('landing.specs.workflow.research.sources') }}</span>
              </div>
              <div class="space-y-3">
                <div
                  v-for="source in 3"
                  :key="source"
                  class="flex items-center gap-3 text-sm text-brand-muted dark:text-slate-300"
                >
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5e1d7] text-[10px] dark:bg-slate-800"
                    >{{ source }}</span
                  >
                  <span class="h-2 rounded bg-[#d3cfc4] dark:bg-slate-700" :class="source === 2 ? 'w-3/5' : 'w-4/5'" />
                  <Icon name="mdi:check" class="ml-auto text-emerald-600" />
                </div>
              </div>
            </template>

            <template v-else-if="step.key === 'review'">
              <p class="mb-4 font-serif text-xl text-brand-ink dark:text-white">
                {{ $t('landing.specs.workflow.review.uiTitle') }}
              </p>
              <div
                class="mb-4 rounded-lg bg-[#eae6dd] p-4 text-sm leading-6 text-brand-muted dark:bg-slate-800 dark:text-slate-300"
              >
                “{{ $t('landing.specs.workflow.review.comment') }}”
                <p class="mt-2 text-xs font-semibold text-brand-accent dark:text-indigo-300">
                  {{ $t('landing.specs.workflow.review.editor') }}
                </p>
              </div>
              <div class="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Icon name="mdi:check-circle" /> {{ $t('landing.specs.workflow.review.approved') }}
              </div>
            </template>

            <template v-else>
              <div class="mb-5 flex items-center gap-3">
                <span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  ><Icon name="mdi:check"
                /></span>
                <div>
                  <p class="text-sm font-semibold">{{ $t('landing.specs.workflow.publish.live') }}</p>
                  <p class="text-xs text-brand-muted">blog.yourbrand.com</p>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 border-t border-brand-line pt-4 text-center dark:border-slate-700">
                <div v-for="metric in publishMetrics" :key="metric.label">
                  <strong class="block text-lg">{{ metric.value }}</strong
                  ><span class="text-[10px] text-brand-muted">{{ metric.label }}</span>
                </div>
              </div>
            </template>
          </div>
        </li>
      </ol>

      <div
        class="mt-8 flex flex-col gap-5 text-sm text-brand-muted dark:text-slate-300 md:flex-row md:items-center md:justify-between"
      >
        <p class="font-semibold text-brand-ink dark:text-white">{{ $t('landing.specs.foundation') }}</p>
        <ul class="flex flex-wrap gap-x-6 gap-y-3">
          <li v-for="item in foundations" :key="item" class="flex items-center gap-2">
            <Icon name="mdi:check" class="text-brand-accent" />{{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const workflow = computed(() =>
  ['research', 'review', 'publish'].map((key) => ({
    key,
    title: t(`landing.specs.workflow.${key}.title`),
    desc: t(`landing.specs.workflow.${key}.desc`),
  })),
)
const foundations = computed(() => ['security', 'locales', 'api'].map((key) => t(`landing.specs.foundations.${key}`)))
const publishMetrics = computed(() => [
  { value: '100', label: t('landing.specs.workflow.publish.score') },
  { value: '3', label: t('landing.specs.workflow.publish.locales') },
  { value: '6', label: t('landing.specs.workflow.publish.channels') },
])
</script>
