import type { TFunction } from 'vue-i18n'
import type { navigateTo } from 'nuxt/app'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: TFunction
    navigateTo: typeof navigateTo
  }
}
