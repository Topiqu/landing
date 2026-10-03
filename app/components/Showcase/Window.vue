<template>
  <div class="mock-window">
    <div class="mock-top">
      <span class="mock-tenant">H</span>
      <strong>{{ $t('landing.design.showcase.mock.workspace') }}</strong>
      <Icon name="mdi:chevron-right" class="mock-separator" />
      <Transition name="mock-crumb" mode="out-in">
        <span :key="crumb" class="mock-crumb">{{ crumb }}</span>
      </Transition>
      <span class="mock-avatar">JN</span>
    </div>
    <div class="mock-body">
      <div class="mock-nav">
        <span v-for="item in items" :key="item.key" :data-active="item.key === nav || undefined">
          <Icon :name="item.icon" />
          <span>{{ $t(`landing.design.showcase.mock.nav.${item.key}`) }}</span>
        </span>
      </div>
      <div class="mock-main"><slot /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type ShowcaseNav = 'overview' | 'visibility' | 'write' | 'media' | 'knowledge' | 'settings'

defineProps<{ nav: ShowcaseNav; crumb: string }>()

const items = [
  { key: 'overview', icon: 'mdi:home-outline' },
  { key: 'visibility', icon: 'mdi:radar' },
  { key: 'write', icon: 'mdi:pencil-outline' },
  { key: 'media', icon: 'mdi:image-multiple-outline' },
  { key: 'knowledge', icon: 'mdi:book-open-page-variant-outline' },
  { key: 'settings', icon: 'mdi:cog-outline' },
] as const
</script>

<style scoped>
.mock-window {
  container-type: inline-size;
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  box-shadow:
    0 1px 2px #0f172a0d,
    0 32px 64px -36px color-mix(in srgb, var(--landing-accent) 45%, #0f172a);
  color: var(--landing-ink);
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
}
.mock-top {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 46px;
  padding-inline: 16px;
  border-bottom: 1px solid var(--landing-line);
  font-size: 12px;
  white-space: nowrap;
}
.mock-tenant {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--landing-accent);
  color: var(--landing-surface);
  font-size: 11px;
  font-weight: 800;
}
.mock-separator {
  color: var(--landing-muted);
  font-size: 14px;
}
.mock-crumb {
  overflow: hidden;
  min-width: 0;
  color: var(--landing-muted);
  text-overflow: ellipsis;
}
.mock-avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 26px;
  height: 26px;
  margin-left: auto;
  border-radius: 50%;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 10px;
  font-weight: 750;
}
.mock-body {
  display: grid;
  grid-template-columns: 176px minmax(0, 1fr);
  height: 468px;
}
.mock-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 10px;
  border-right: 1px solid var(--landing-line);
  background: var(--landing-bg);
}
.mock-nav > span {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 34px;
  padding-inline: 10px;
  border-radius: 8px;
  color: var(--landing-muted);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color 0.25s,
    color 0.25s,
    box-shadow 0.25s;
}
.mock-nav > span[data-active] {
  background: var(--landing-surface);
  box-shadow: 0 0 0 1px var(--landing-line);
  color: var(--landing-ink);
}
.mock-nav .iconify {
  flex: none;
  font-size: 16px;
}
.mock-main {
  position: relative;
  min-width: 0;
  overflow: hidden;
}
.mock-crumb-enter-active,
.mock-crumb-leave-active {
  transition: opacity 0.2s;
}
.mock-crumb-enter-from,
.mock-crumb-leave-to {
  opacity: 0;
}
@container (max-width: 680px) {
  .mock-body {
    grid-template-columns: 54px minmax(0, 1fr);
  }
  .mock-nav > span {
    justify-content: center;
    padding: 0;
  }
  .mock-nav > span > span {
    display: none;
  }
}
@container (max-width: 460px) {
  .mock-body {
    grid-template-columns: minmax(0, 1fr);
    height: 440px;
  }
  .mock-nav {
    display: none;
  }
}
</style>
