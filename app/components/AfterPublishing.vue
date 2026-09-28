<script setup lang="ts">
const steps = [
  { key: 'search', icon: 'mdi:google' },
  { key: 'ai', icon: 'mdi:radar' },
  { key: 'opportunities', icon: 'mdi:lightbulb-outline' },
  { key: 'autopilot', icon: 'mdi:autorenew' },
] as const
</script>

<template>
  <section class="landing-section after-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.after.eyebrow') }}</p>
        <h2>{{ $t('landing.design.after.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.after.text') }}</p>
      </div>
      <ol class="after-steps">
        <li v-for="step in steps" :key="step.key">
          <Icon :name="step.icon" aria-hidden="true" />
          <h3>{{ $t(`landing.design.after.items.${step.key}.title`) }}</h3>
          <p>{{ $t(`landing.design.after.items.${step.key}.text`) }}</p>
        </li>
      </ol>
      <p class="after-plan">{{ $t('landing.design.after.plan') }}</p>
    </div>
  </section>
</template>

<style scoped>
.after-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--landing-line);
}
.after-steps li {
  min-width: 0;
  padding: 28px;
  border-right: 1px solid var(--landing-line);
}
.after-steps li:last-child {
  border-right: 0;
}
.after-steps .iconify {
  margin-bottom: 26px;
  color: var(--landing-accent);
  font-size: 24px;
}
.after-steps h3 {
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: 700;
}
.after-steps p {
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.75;
}
.after-plan {
  margin-top: 18px !important;
  color: var(--landing-muted);
  font-size: 12px;
}
@media (max-width: 900px) {
  .after-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .after-steps li:nth-child(2) {
    border-right: 0;
  }
  .after-steps li:nth-child(-n + 2) {
    border-bottom: 1px solid var(--landing-line);
  }
}
@media (max-width: 600px) {
  .after-steps {
    grid-template-columns: 1fr;
  }
  .after-steps li {
    padding: 22px;
    border-right: 0;
    border-bottom: 1px solid var(--landing-line);
  }
  .after-steps li:last-child {
    border-bottom: 0;
  }
  .after-steps .iconify {
    margin-bottom: 14px;
  }
}
</style>
