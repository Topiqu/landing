<!-- Flat duotone illustrations; every fill follows the publication's brand colour. -->
<template>
  <svg class="pub-cover" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" class="soft" />
    <template v-if="variant === 'house'">
      <circle cx="252" cy="52" r="22" class="accent" opacity="0.35" />
      <rect y="160" width="320" height="40" class="accent" opacity="0.14" />
      <rect x="70" y="92" width="120" height="68" class="paper" />
      <polygon points="58,96 130,44 202,96" class="accent" />
      <rect x="118" y="120" width="24" height="40" rx="2" class="accent" opacity="0.55" />
      <rect x="84" y="108" width="22" height="20" rx="2" class="accent" opacity="0.28" />
      <rect x="154" y="108" width="22" height="20" rx="2" class="accent" opacity="0.28" />
      <rect x="210" y="118" width="54" height="42" rx="5" class="paper" />
      <circle cx="229" cy="139" r="12" class="line" />
      <path d="M229 131v16M221 139h16" class="line thin" />
      <path d="M248 128h8M248 135h8M248 142h8M248 149h8" class="line thin" />
    </template>
    <template v-else-if="variant === 'radiator'">
      <rect y="166" width="320" height="34" class="accent" opacity="0.12" />
      <rect v-for="fin in 6" :key="fin" :x="78 + fin * 22" y="76" width="16" height="90" rx="8" class="paper" />
      <rect x="92" y="160" width="140" height="8" rx="4" class="accent" opacity="0.5" />
      <path
        v-for="wave in 3"
        :key="wave"
        :d="`M${118 + wave * 26} 64 q 8 -9 0 -18 q -8 -9 0 -18`"
        class="line"
        :opacity="0.9 - wave * 0.15"
      />
    </template>
    <template v-else-if="variant === 'winter'">
      <rect
        v-for="(height, index) in [40, 64, 88, 72, 108]"
        :key="index"
        :x="70 + index * 30"
        :y="160 - height"
        width="20"
        :height="height"
        rx="4"
        class="accent"
        :opacity="0.35 + index * 0.13"
      />
      <path d="M60 160h190" class="line thin" />
      <g transform="translate(250 58)" class="line thin">
        <path d="M0 -22v44M-19 -11l38 22M-19 11l38 -22" />
        <path d="M-5 -17l5 5 5 -5M-5 17l5 -5 5 5" />
      </g>
    </template>
    <template v-else>
      <circle cx="160" cy="100" r="54" class="paper" />
      <path d="M160 70v60M134 85l52 30M134 115l52 -30" class="line" />
      <path d="M96 64a76 76 0 0 1 64 -38" class="line" />
      <path d="M150 20l12 6 -8 11" class="line" />
      <path d="M224 136a76 76 0 0 1 -64 38" class="line" />
      <path d="M170 180l-12 -6 8 -11" class="line" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ variant: 'house' | 'radiator' | 'winter' | 'defrost' }>()
</script>

<style scoped>
.pub-cover {
  display: block;
  width: 100%;
  height: 100%;
}
.pub-cover * {
  transition:
    fill 0.45s ease,
    stroke 0.45s ease;
}
.soft {
  fill: var(--pub-accent-soft);
}
.accent {
  fill: var(--pub-accent);
}
.paper {
  fill: var(--pub-surface);
}
.line {
  fill: none;
  stroke: var(--pub-accent);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.thin {
  stroke-width: 2.5;
}
</style>
