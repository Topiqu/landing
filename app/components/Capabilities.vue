<script setup lang="ts">
const { tm, rt } = useI18n()
const meta = [
  { icon: 'mdi:book-open-page-variant-outline' },
  { icon: 'mdi:compass-outline' },
  { icon: 'mdi:shield-check-outline' },
  { icon: 'mdi:account-check-outline' },
] as const
const items = computed(() =>
  (tm('landing.design.capabilities.items') as { title: string; text: string }[]).map((item, index) => ({
    title: rt(item.title),
    text: rt(item.text),
    ...meta[index]!,
  })),
)
</script>
<template>
  <section id="features" class="landing-section quality-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.capabilities.eyebrow') }}</p>
        <h2>{{ $t('landing.design.capabilities.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.capabilities.text') }}</p>
      </div>
      <ul class="quality-grid">
        <li v-for="item in items" :key="item.title">
          <Icon :name="item.icon" aria-hidden="true" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ul>
      <p class="supporting-features">
        <span>{{ $t('landing.design.capabilities.moreLabel') }}</span>
        {{ $t('landing.design.capabilities.more') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.quality-section {
  background: var(--landing-bg);
}
.quality-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.quality-grid li {
  min-width: 0;
  padding-top: 22px;
  border-top: 2px solid var(--landing-accent);
}
.quality-grid .iconify {
  color: var(--landing-accent);
  font-size: 25px;
  margin-bottom: 18px;
}
.quality-grid h3 {
  margin-bottom: 10px;
  font-size: 17px;
  font-weight: 700;
}
.quality-grid p {
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.75;
}
.supporting-features {
  margin-top: 36px !important;
  padding-top: 20px;
  border-top: 1px solid var(--landing-line);
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.8;
}
.supporting-features span {
  display: inline-block;
  margin-right: 12px;
  color: var(--landing-ink);
  font-weight: 750;
}
@media (max-width: 900px) {
  .quality-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
  }
}
@media (max-width: 600px) {
  .quality-grid {
    grid-template-columns: 1fr;
    gap: 26px;
  }
}
</style>
