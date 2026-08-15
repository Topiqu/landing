<template>
  <section id="specs" class="scroll-mt-20 border-b border-brand-line px-6 py-24 dark:border-white/10 md:py-32">
    <div class="mx-auto max-w-7xl">
      <div class="mb-16 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p class="eyebrow">{{ $t('landing.specs.eyebrow') }}</p>
          <h2 class="section-title max-w-xl">{{ $t('landing.specs.title') }}</h2>
        </div>
        <p class="section-lede max-w-xl md:justify-self-end">{{ $t('landing.specs.subtitle') }}</p>
      </div>

      <div class="grid border-y border-brand-line dark:border-slate-700 md:grid-cols-2">
        <article
          v-for="(feature, index) in features"
          :key="feature.key"
          class="group relative border-brand-line py-9 dark:border-slate-700 md:min-h-72 md:p-10"
          :class="[index % 2 === 0 ? 'md:border-r' : 'md:pl-12', index < 2 ? 'border-b' : '']"
        >
          <div class="mb-8 flex items-center justify-between">
            <span class="font-mono text-xs text-brand-muted">0{{ index + 1 }}</span>
            <Icon :name="feature.icon" size="24" class="text-brand-accent" />
          </div>
          <h3 class="mb-3 text-2xl font-semibold tracking-tight text-brand-ink dark:text-white">{{ feature.title }}</h3>
          <p class="max-w-lg leading-7 text-brand-muted dark:text-slate-300">{{ feature.desc }}</p>
          <ul class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#5f5e57] dark:text-slate-400">
            <li v-for="detail in feature.details" :key="detail" class="flex items-center gap-1.5">
              <span class="h-1 w-1 rounded-full bg-brand-accent" />{{ detail }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const features = computed(() => [
  {
    key: 'ai',
    icon: 'mdi:text-box-search-outline',
    title: t('landing.specs.ai.title'),
    desc: t('landing.specs.ai.desc'),
    details: ['enhance', 'vibe', 'helpfulness'].map((key) => t(`landing.specs.ai.tags.${key}`)),
  },
  {
    key: 'publishing',
    icon: 'mdi:publish',
    title: t('landing.specs.publishing.title'),
    desc: t('landing.specs.publishing.desc'),
    details: ['review', 'locales', 'domain', 'distribution'].map((key) => t(`landing.specs.publishing.list.${key}`)),
  },
  {
    key: 'security',
    icon: 'mdi:shield-check-outline',
    title: t('landing.specs.security.title'),
    desc: t('landing.specs.security.desc'),
    details: ['rbac', 'mfa', 'hashing', 'antibot'].map((key) => t(`landing.specs.security.list.${key}`)),
  },
  {
    key: 'api',
    icon: 'mdi:api',
    title: t('landing.specs.api.title'),
    desc: t('landing.specs.api.desc'),
    details: [t('landing.specs.api.type'), 'WordPress', t('landing.specs.api.domain')],
  },
])
</script>
