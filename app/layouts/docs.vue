<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
</script>
<template>
  <div class="developer-layout">
    <Header />
    <nav class="developer-nav" :aria-label="locale === 'cs' ? 'Dokumentace' : 'Documentation'">
      <NuxtLink :to="localePath('/docs')">{{ locale === 'cs' ? 'Dokumentace' : 'Documentation' }}</NuxtLink>
      <NuxtLink :to="localePath('/api-reference')">API Reference</NuxtLink>
      <NuxtLink :to="localePath('/changelog')">{{ locale === 'cs' ? 'Co je nového' : 'Changelog' }}</NuxtLink>
    </nav>
    <slot />
  </div>
</template>
<style scoped>
.developer-layout {
  min-height: 100vh;
  background: var(--landing-surface);
  color: var(--ui-text);
}
.developer-nav {
  display: flex;
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
