import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const mode = computed({
    get: () => colorMode.preference,
    set: (value: string) => {
      colorMode.preference = value
    },
  })
  const isDark = computed(() => colorMode.value === 'dark')
  const toggle = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }
  return { mode, isDark, toggle }
})
