<script setup lang="ts">
defineProps<{ value: number; label: string }>()
</script>
<template>
  <span class="comparison-rating" :data-rating="value">
    <strong>{{ value }}<small>/5</small></strong>
    <span>{{ label }}</span>
  </span>
</template>
<style scoped>
.comparison-rating {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  color: var(--landing-muted);
}
.comparison-rating strong {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.comparison-rating small {
  font-size: 11px;
  font-weight: 400;
  margin-left: 2px;
}
.comparison-rating > span {
  font-size: 11px;
  line-height: 1.4;
}
[data-rating='4'] {
  color: var(--ui-text);
}
[data-rating='5'] {
  color: #4338ca;
}
[data-rating='5'] strong {
  font-weight: 800;
}
:global(.dark .comparison-rating[data-rating='5']) {
  color: #a5b4fc;
}
</style>
