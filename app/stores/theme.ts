import { defineStore } from 'pinia'
import { useColorMode } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const mode = useColorMode({
    attribute: 'class',
    modes: { light: 'light', dark: 'dark' },
    storageKey: 'theme',
    initialValue: 'light',
  })

  const isDark = computed(() => mode.value === 'dark')

  const toggle = () => {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  return { mode, isDark, toggle }
})
