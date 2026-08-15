<template>
  <DocsPage :slug="slug" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const route = useRoute()
const slug = computed(() => String(route.params.slug || 'index'))
</script>
