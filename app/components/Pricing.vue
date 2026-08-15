<template>
  <section id="pricing" class="scroll-mt-20 border-b border-brand-line px-6 py-24 dark:border-white/10 md:py-32">
    <div class="mx-auto max-w-7xl">
      <div class="mb-16 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p class="eyebrow">{{ $t('landing.pricing.eyebrow') }}</p>
          <h2 class="section-title">{{ $t('landing.pricing.title') }}</h2>
        </div>
        <p class="section-lede max-w-xl md:justify-self-end">{{ $t('landing.pricing.subtitle') }}</p>
      </div>

      <div
        class="grid gap-px overflow-hidden rounded-xl border border-brand-line bg-brand-line dark:border-slate-700 dark:bg-slate-700 md:grid-cols-2 lg:grid-cols-4"
      >
        <article
          v-for="plan in plans"
          :key="plan.key"
          class="relative flex min-h-[620px] flex-col bg-brand-surface p-7 dark:bg-[#111418]"
          :class="plan.recommended ? 'ring-2 ring-inset ring-brand-accent' : ''"
        >
          <span
            v-if="plan.recommended"
            class="absolute right-4 top-4 rounded-md bg-brand-accent px-2 py-1 text-[10px] font-semibold text-white"
            >{{ $t('landing.pricing.recommended') }}</span
          >
          <p class="mb-4 text-xs font-semibold text-brand-accent">{{ plan.audience }}</p>
          <h3 class="text-2xl font-semibold text-brand-ink dark:text-white">{{ plan.name }}</h3>
          <p class="mt-2 min-h-12 text-sm leading-6 text-brand-muted dark:text-slate-400">{{ plan.desc }}</p>
          <div class="mb-7 mt-6 flex items-baseline gap-1 border-b border-brand-line pb-7 dark:border-slate-700">
            <span class="text-4xl font-semibold tracking-tight text-brand-ink dark:text-white">{{ plan.price }}</span>
            <span v-if="plan.key !== 'custom'" class="text-sm text-brand-muted">{{ $t('landing.pricing.month') }}</span>
          </div>
          <ul class="mb-8 flex-1 space-y-4">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2.5 text-sm leading-5 text-[#4f4e48] dark:text-slate-300"
            >
              <Icon name="mdi:check" class="mt-0.5 shrink-0 text-brand-accent" />{{ feature }}
            </li>
          </ul>
          <Button
            :variant="plan.recommended ? 'primary' : 'neutral'"
            class="w-full !rounded-lg shadow-none"
            :class="
              plan.recommended
                ? '!border-brand-accent !bg-brand-accent hover:!bg-[#4035ad]'
                : '!border-brand-line !bg-transparent !text-brand-ink hover:!border-[#99958b] dark:!border-slate-600 dark:!text-white'
            "
            @click="choosePlan(plan.key)"
          >
            {{ plan.cta }}
          </Button>
        </article>
      </div>
      <p class="mt-6 text-center text-xs text-brand-muted">{{ $t('landing.pricing.note') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const planConfig = [
  { key: 'free', features: ['manual_writing', 'subdomain', 'basic_analytics', 'editor', 'community', 'no_card'] },
  { key: 'pro', features: ['ai_tokens', 'seo', 'sources', 'scheduling', 'translations', 'import'] },
  {
    key: 'premium',
    recommended: true,
    features: ['sentiment', 'indexing', 'gsc', 'workflow', 'distribution', 'support'],
  },
  { key: 'custom', features: ['domain', 'whitelabel', 'banners', 'multisite', 'onboarding', 'sla'] },
]

const plans = computed(() =>
  planConfig.map((plan) => ({
    ...plan,
    name: t(`landing.pricing.plans.${plan.key}.name`),
    desc: t(`landing.pricing.plans.${plan.key}.desc`),
    price: t(`landing.pricing.plans.${plan.key}.price`),
    audience: t(`landing.pricing.plans.${plan.key}.audience`),
    cta: t(`landing.pricing.plans.${plan.key}.cta`),
    features: plan.features.map((feature) => t(`landing.pricing.plans.${plan.key}.features.${feature}`)),
  })),
)

const choosePlan = (key: string) =>
  key === 'custom'
    ? navigateTo('mailto:support@topiqu.com', { external: true })
    : navigateTo({ path: localePath('/onboarding'), query: { plan: key } })
</script>
