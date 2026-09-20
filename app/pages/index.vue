<script setup lang="ts">
const { t } = useI18n()
const featureIcons = ['mdi:creation-outline', 'mdi:account-group-outline', 'mdi:web']
const localePath = useLocalePath()
useSeoMeta({
  title: 'Topiqu — AI Content Operations',
  description: () => t('landing.design.hero.description'),
  ogTitle: 'Topiqu — AI Content Operations',
  ogDescription: () => t('landing.design.hero.description'),
  ogType: 'website',
})
useSchemaOrg([
  defineOrganization({ name: 'Topiqu', url: 'https://topiqu.com' }),
  defineWebSite({ name: 'Topiqu' }),
  defineWebPage({ name: 'Topiqu — AI Content Operations' }),
])
</script>
<template>
  <div class="landing-page">
    <Hero />
    <section id="specs" class="landing-section workflow-section">
      <div class="landing-container">
        <div class="section-heading">
          <p class="eyebrow">{{ $t('landing.design.workflow.eyebrow') }}</p>
          <h2>{{ $t('landing.design.workflow.title') }}</h2>
        </div>
        <div class="workflow-grid">
          <article v-for="index in [0, 1, 2]" :key="index">
            <span class="step-number">0{{ Number(index) + 1 }}</span>
            <h3>{{ $t('landing.design.workflow.steps.' + index + '.title') }}</h3>
            <p>{{ $t('landing.design.workflow.steps.' + index + '.text') }}</p>
          </article>
        </div>
      </div>
    </section>
    <section class="landing-section feature-section">
      <div class="landing-container feature-grid">
        <div>
          <p class="eyebrow">{{ $t('landing.design.features.eyebrow') }}</p>
          <h2>{{ $t('landing.design.features.title') }}</h2>
          <p class="section-description">{{ $t('landing.design.features.text') }}</p>
          <div class="feature-list">
            <article v-for="(icon, index) in featureIcons" :key="icon">
              <Icon :name="icon" />
              <div>
                <h3>{{ $t('landing.design.features.items.' + index + '.title') }}</h3>
                <p>{{ $t('landing.design.features.items.' + index + '.text') }}</p>
              </div>
            </article>
          </div>
        </div>
        <figure class="publication-preview">
          <figcaption class="eyebrow">{{ $t('landing.design.publication.eyebrow') }}</figcaption>
          <div class="publication-paper">
            <div class="publication-masthead">
              {{ $t('landing.design.publication.brand') }}<span aria-hidden="true">↗</span>
            </div>
            <div class="publication-cover" aria-hidden="true">
              <span>T.</span>
              <div class="cover-lines"><i /><i /><i /><i /><i /></div>
            </div>
            <div class="publication-body">
              <p class="editor-category">{{ $t('landing.design.publication.issue') }}</p>
              <h3>{{ $t('landing.design.publication.title') }}</h3>
              <p>{{ $t('landing.design.publication.text') }}</p>
              <div class="publication-byline">{{ $t('landing.design.publication.byline') }}</div>
            </div>
          </div>
          <p class="publication-note"><Icon name="mdi:web" />{{ $t('landing.design.publication.note') }}</p>
        </figure>
      </div>
    </section>
    <section class="landing-section integration-section">
      <div class="landing-container integration-grid">
        <div>
          <p class="eyebrow">WORDPRESS / API / GOOGLE SEARCH CONSOLE</p>
          <h2>{{ $t('landing.purpose.title') }}</h2>
          <p>{{ $t('landing.purpose.description') }}</p>
          <UButton :to="localePath('/docs')" color="neutral" variant="link" trailingIcon="mdi:arrow-right">{{
            $t('landing.design.nav.docs')
          }}</UButton>
        </div>
        <div class="integration-note">
          <Icon name="mdi:chart-line" />
          <h3>{{ $t('landing.purpose.gscTitle') }}</h3>
          <p>{{ $t('landing.purpose.gscDescription') }}</p>
          <NuxtLink :to="localePath('privacy')">{{ $t('landing.purpose.privacyLink') }}</NuxtLink>
        </div>
      </div>
    </section>
    <Comparison />
    <Pricing />
    <Faq />
    <section class="landing-section closing-section">
      <div class="landing-container closing-inner">
        <div>
          <p class="eyebrow">{{ $t('landing.design.closing.eyebrow') }}</p>
          <h2>{{ $t('landing.design.closing.title') }}</h2>
          <p>{{ $t('landing.design.closing.text') }}</p>
        </div>
        <UButton :to="localePath({ name: 'onboarding-site' })" size="xl" trailingIcon="mdi:arrow-right">{{
          $t('landing.design.hero.cta')
        }}</UButton>
      </div>
    </section>
  </div>
</template>
