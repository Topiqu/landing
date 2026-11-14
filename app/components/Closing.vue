<template>
  <section class="landing-section closing-section">
    <div class="landing-container closing-inner">
      <div>
        <p class="eyebrow">{{ $t('landing.design.closing.eyebrow') }}</p>
        <h2>{{ $t('landing.design.closing.title') }}</h2>
        <p>{{ $t('landing.design.closing.text') }}</p>
      </div>
      <LeadForm id="closing" source="closing" />
    </div>
  </section>
</template>
