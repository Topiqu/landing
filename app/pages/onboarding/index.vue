<script setup lang="ts">
// Redirect the bare /onboarding entry to the first step. Done in page
// middleware (not top-level await in setup) so the component always has a
// render function — a template-less async page renders blank on client-side
// navigation ("Start Integration"), which showed up as a white screen.
definePageMeta({
  middleware: () => {
    const localePath = useLocalePath()
    return navigateTo(localePath({ name: 'onboarding-site' }), { replace: true })
  },
})
</script>

<template>
  <div />
</template>
