<script setup lang="ts">
const { t } = useI18n()
const items = computed(() =>
  Array.from({ length: 5 }, (_, i) => ({
    label: t('landing.faq.items.' + i + '.q'),
    content: t('landing.faq.items.' + i + '.a'),
  })),
)
</script>
<template>
  <section id="faq" class="landing-section faq-section">
    <div class="landing-container faq-grid">
      <div>
        <p class="eyebrow">{{ $t('landing.faq.badge') }}</p>
        <h2>{{ $t('landing.faq.title') }}</h2>
        <p class="section-description">{{ $t('landing.faq.subtitle') }}</p>
        <UButton to="mailto:support@topiqu.com" color="neutral" variant="link" trailingIcon="mdi:arrow-right">{{
          $t('landing.faq.cta_button')
        }}</UButton>
      </div>
      <UAccordion
        :items="items"
        :ui="{ trigger: 'tw:py-6 tw:text-base tw:font-semibold', content: 'tw:text-base tw:leading-7 tw:text-muted' }"
      />
    </div>
  </section>
</template>
