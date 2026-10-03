<template>
  <section class="landing-section features-section">
    <div class="landing-container">
      <div class="features-heading">
        <div class="section-heading">
          <p class="eyebrow">{{ $t('landing.design.features.eyebrow') }}</p>
          <h2>{{ $t('landing.design.features.title') }}</h2>
        </div>
        <p class="section-description">{{ $t('landing.design.features.text') }}</p>
      </div>
      <ul class="features-grid">
        <li v-for="(item, index) in items" :key="item.title">
          <span class="features-icon"><Icon :name="icons[index]!" aria-hidden="true" /></span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
        <li class="features-more">
          <NuxtLinkLocale to="/changelog">
            <span class="features-icon"><Icon name="mdi:plus" aria-hidden="true" /></span>
            <div>
              <h3>{{ $t('landing.design.features.more.title') }}</h3>
              <p>{{ $t('landing.design.features.more.text') }}<Icon name="mdi:arrow-right" aria-hidden="true" /></p>
            </div>
          </NuxtLinkLocale>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = useMessageList<'title' | 'text'>('landing.design.features.items')
// Same order as `landing.design.features.items`.
const icons = [
  'mdi:translate',
  'mdi:image-multiple-outline',
  'mdi:format-list-numbered',
  'mdi:comment-text-multiple-outline',
  'mdi:poll',
  'mdi:account-group-outline',
  'mdi:view-grid-plus-outline',
  'mdi:web',
  'mdi:palette-outline',
  'mdi:gauge',
  'mdi:code-json',
  'mdi:frequently-asked-questions',
  'mdi:emoticon-happy-outline',
  'mdi:linkedin',
  'mdi:chart-box-outline',
]
</script>

<style scoped>
.features-section {
  background: var(--landing-surface);
}
.features-heading {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: end;
  gap: 24px 64px;
  margin-bottom: 44px;
}
.features-heading .section-heading {
  margin-bottom: 0;
}
.landing-page .features-heading .section-description {
  margin-top: 0;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--landing-line);
  list-style: none;
}
.features-grid li {
  display: flex;
  gap: 14px;
  min-width: 0;
  padding: 22px 20px 22px 0;
  border-bottom: 1px solid var(--landing-line);
}
.features-more a {
  display: flex;
  gap: 14px;
  color: inherit;
  text-decoration: none;
}
.features-more a:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 4px;
  border-radius: 8px;
}
.features-more .features-icon {
  background: var(--landing-accent);
  color: var(--landing-surface);
}
.features-more p {
  color: var(--landing-accent);
  font-weight: 650;
}
.features-more a:hover p .iconify {
  transform: translateX(3px);
}
.features-more p .iconify {
  margin-left: 4px;
  vertical-align: -2px;
  transition: transform 0.15s;
}
.features-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 20px;
  transition:
    background-color 0.2s,
    color 0.2s;
}
.features-grid li:hover .features-icon {
  background: var(--landing-accent);
  color: var(--landing-surface);
}
.features-grid h3 {
  margin-bottom: 3px;
  font-size: 15px;
  font-weight: 700;
}
.features-grid p {
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.55;
}
@media (max-width: 1000px) {
  .features-heading {
    grid-template-columns: minmax(0, 1fr);
  }
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .features-grid li {
    padding: 16px 0;
  }
}
</style>
