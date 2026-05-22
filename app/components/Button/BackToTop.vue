<template>
  <Teleport to="body">
    <Transition
      enterActiveClass="motion-safe:transition motion-safe:duration-300 motion-safe:ease-out"
      leaveActiveClass="motion-safe:transition motion-safe:duration-200 motion-safe:ease-in"
      enterFromClass="opacity-0 motion-safe:translate-y-3 motion-safe:scale-90"
      leaveToClass="opacity-0 motion-safe:translate-y-3 motion-safe:scale-90"
    >
      <Button
        v-if="isVisible"
        :class="[
          'fixed bottom-8 right-6 sm:bottom-12 sm:right-8 z-30',
          'w-11 h-11 sm:w-12 sm:h-12 rounded-full',
          'bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-black/10 dark:shadow-black/40',
          'ring-1 ring-white/10 backdrop-blur-sm',
          'motion-safe:transition-transform motion-safe:duration-200',
          'hover:scale-105 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500',
        ]"
        icon="mdi:arrow-up"
        size="lg"
        :aria="$t('common.actions.backToTop')"
        @click="scrollToTop"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { height } = useWindowSize()
const reduced = usePreferredReducedMotion()

const { y } = useWindowScroll({
  behavior: () => (reduced.value === 'reduce' ? 'auto' : 'smooth'),
})

const threshold = computed(() => Math.max(400, height.value * 0.6))
const isVisible = computed(() => y.value > threshold.value)

const scrollToTop = () => {
  y.value = 0
}
</script>
