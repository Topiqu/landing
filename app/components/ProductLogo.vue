<script setup lang="ts">
defineProps<{
  name: string
  src?: string
  mark?: string
}>()
</script>

<template>
  <span
    class="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/10 bg-white text-[11px] font-bold text-brand-ink shadow-sm dark:border-white/15"
    aria-hidden="true"
  >
    <img v-if="src" :src="src" alt="" width="28" height="28" class="h-full w-full object-contain p-0.5" />
    <span v-else>{{ mark || name.slice(0, 1) }}</span>
  </span>
</template>
