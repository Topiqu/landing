<template>
  <figure class="example-cover">
    <img
      :src="cover.url"
      alt=""
      width="1280"
      height="720"
      :loading="priority ? undefined : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
      class="example-cover-image"
    />
    <figcaption v-if="cover.author">
      <a v-if="cover.sourceUrl" :href="cover.sourceUrl" target="_blank" rel="noopener">{{ cover.author }}</a>
      <span v-else>{{ cover.author }}</span>
      <span v-if="cover.license"> · {{ cover.license }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ExampleSnapshot } from '~/composables/useExample'

defineProps<{ cover: ExampleSnapshot['cover']; priority?: boolean }>()
</script>

<style scoped>
.example-cover-image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-tint);
}
.example-cover figcaption {
  margin-top: 8px;
  color: var(--landing-muted);
  font-size: 12.5px;
}
.example-cover figcaption a {
  color: inherit;
}
</style>
