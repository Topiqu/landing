<script setup lang="ts">
const channels = [
  { key: 'topiqu', icon: 'mdi:web' },
  { key: 'wordpress', icon: 'mdi:wordpress' },
  { key: 'api', icon: 'mdi:api' },
] as const
</script>

<template>
  <section class="landing-section publishing-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.publishing.eyebrow') }}</p>
        <h2>{{ $t('landing.design.publishing.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.publishing.text') }}</p>
      </div>
      <ul class="publishing-channels">
        <li v-for="channel in channels" :key="channel.key">
          <Icon :name="channel.icon" aria-hidden="true" />
          <div>
            <h3>{{ $t(`landing.design.publishing.items.${channel.key}.title`) }}</h3>
            <p>{{ $t(`landing.design.publishing.items.${channel.key}.text`) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.publishing-section {
  background: var(--landing-bg);
}
.publishing-channels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.publishing-channels li {
  min-width: 0;
  display: flex;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--landing-line);
  background: var(--landing-surface);
}
.publishing-channels .iconify {
  flex: none;
  color: var(--landing-accent);
  font-size: 25px;
}
.publishing-channels h3 {
  margin-bottom: 7px;
  font-size: 17px;
  font-weight: 700;
}
.publishing-channels p {
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.7;
}
@media (max-width: 800px) {
  .publishing-channels {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
