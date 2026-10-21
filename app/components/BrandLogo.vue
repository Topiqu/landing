<template>
  <NuxtLink :to="localePath('/')" class="brand-logo" aria-label="Topiqu">
    <NuxtImg
      src="/brand/topiqu-wordmark.png"
      width="126"
      height="48"
      format="webp"
      fit="inside"
      densities="x1 x2"
      alt="Topiqu"
      class="brand-wordmark"
    />
    <span class="brand-dark-wordmark">
      <NuxtImg
        src="/brand/topiqu-wordmark-dark.png"
        width="188"
        height="106"
        format="webp"
        fit="inside"
        densities="x1 x2"
        alt="Topiqu"
      />
    </span>
  </NuxtLink>
</template>
<script setup lang="ts">
const localePath = useLocalePath()
</script>
<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}
.brand-wordmark {
  width: 126px;
  height: auto;
  display: block;
}
.brand-dark-wordmark {
  display: none;
  position: relative;
  width: 126px;
  height: 47px;
  overflow: hidden;
}
.brand-dark-wordmark img {
  position: absolute;
  width: 188px;
  max-width: none;
  height: auto;
  left: -31px;
  top: -28px;
}
:global(.dark .brand-wordmark) {
  display: none;
}
:global(.dark .brand-dark-wordmark) {
  display: block;
}
</style>
