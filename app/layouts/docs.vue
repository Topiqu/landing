<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
const apiReferencePath = computed(() => `/${locale.value}/api-reference`)
</script>
<template>
  <div class="developer-layout">
    <a class="skip-link" href="#developer-content">{{ locale === 'cs' ? 'Přejít na obsah' : 'Skip to content' }}</a>
    <div class="developer-header">
      <Header />
      <nav class="developer-nav" :aria-label="locale === 'cs' ? 'Dokumentace' : 'Documentation'">
        <NuxtLink :to="localePath('/docs')">{{ locale === 'cs' ? 'Dokumentace' : 'Documentation' }}</NuxtLink>
        <NuxtLink :to="apiReferencePath">API Reference</NuxtLink>
        <NuxtLink :to="localePath('/changelog')">{{ locale === 'cs' ? 'Co je nového' : 'Changelog' }}</NuxtLink>
      </nav>
    </div>
    <div id="developer-content" tabindex="-1"><slot /></div>
  </div>
</template>
<style scoped>
.developer-layout {
  min-height: 100vh;
  background: var(--landing-surface);
  color: var(--ui-text);
}
.developer-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--landing-surface);
}
.developer-layout {
  --developer-header-height: calc(var(--ui-header-height) + 53px);
  --scalar-custom-header-height: var(--developer-header-height);
}
.developer-nav {
  display: flex;
  align-items: center;
  min-height: 53px;
  gap: 28px;
  padding: 16px max(24px, calc((100vw - 1248px) / 2));
  border-bottom: 1px solid var(--landing-line);
  overflow-x: auto;
}
.developer-nav a {
  white-space: nowrap;
  font-size: 13px;
  text-decoration: none;
  color: var(--landing-muted);
}
.developer-nav a.router-link-active,
.developer-nav a:hover {
  color: var(--landing-accent);
}
</style>
