<script setup lang="ts">
defineProps<{ label: string; parent?: { label: string; to: string } }>()
const localePath = useLocalePath()
</script>
<template>
  <UBreadcrumb :items="[{ label: 'Topiqu', to: localePath('/') }, ...(parent ? [parent] : []), { label }]" />
</template>
