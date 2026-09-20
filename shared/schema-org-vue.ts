// Compatibility layer for helpers present in @unhead/schema-org 2.1.15's core
// entry but omitted from its Vue entry. Keeping this on public package exports
// also prevents Nitro from externalizing package-internal relative paths.
import { injectHead, useHead } from '@unhead/vue'
import { computed, defineComponent, h, ref, unref, type VNode } from 'vue'
import {
  UnheadSchemaOrg,
  defineArticle,
  defineBook,
  defineBreadcrumb,
  defineComment,
  defineCourse,
  defineEvent,
  defineFoodEstablishment,
  defineHowTo,
  defineImage,
  defineItemList,
  defineJobPosting,
  defineLocalBusiness,
  defineMovie,
  defineOrganization,
  definePerson,
  defineProduct,
  defineQuestion,
  defineRecipe,
  defineReview,
  defineSoftwareApp,
  defineVideo,
  defineWebPage,
  defineWebSite,
  normalizeSchemaOrgInput,
} from '@unhead/schema-org'

export * from '@unhead/schema-org'

type SchemaDefinition = (input?: never) => unknown

function shallowVNodesToText(nodes: VNode[]) {
  return nodes.reduce((text, node) => text + (typeof node.children === 'string' ? node.children.trim() : ''), '')
}

function fixKey(key: string) {
  const normalized = key.replace(/-./g, match => match[1]!.toUpperCase())
  return normalized === 'type' || normalized === 'id' ? `@${normalized}` : normalized
}

function ignoreKey(key: string) {
  if (key.startsWith('aria-') || key.startsWith('data-')) return false
  return key === 'class' || key === 'style'
}

export function useSchemaOrg(
  input: Parameters<typeof normalizeSchemaOrgInput>[0] = [],
  options: Parameters<typeof useHead>[1] & { head?: ReturnType<typeof injectHead> } = {},
) {
  const unhead = options.head || injectHead()
  unhead.use(UnheadSchemaOrg())
  const entry = useHead(normalizeSchemaOrgInput(input) as Parameters<typeof useHead>[0], options)
  const patch = entry.patch
  entry.patch = nextInput => patch(normalizeSchemaOrgInput(nextInput as never) as Parameters<typeof useHead>[0])
  return entry
}

export function defineSchemaOrgComponent(name: string, defineNode?: SchemaDefinition) {
  return defineComponent({
    name,
    props: { as: String },
    setup(props, { slots, attrs }) {
      const node = ref(null)
      const nodePartial = computed(() => {
        const value: Record<string, unknown> = {}
        Object.entries(unref(attrs)).forEach(([key, entry]) => {
          if (!ignoreKey(key)) value[fixKey(key)] = unref(entry)
        })
        if (!node.value) {
          for (const [key, slot] of Object.entries(slots)) {
            if (slot && key !== 'default') value[fixKey(key)] = shallowVNodesToText(slot(props))
          }
        }
        return value
      })
      if (defineNode) useSchemaOrg(defineNode(unref(nodePartial) as never) as never)
      return () => slots.default ? h(props.as || 'div', {}, [slots.default(unref(nodePartial))]) : null
    },
  })
}

export const SchemaOrgArticle = defineSchemaOrgComponent('SchemaOrgArticle', defineArticle)
export const SchemaOrgBreadcrumb = defineSchemaOrgComponent('SchemaOrgBreadcrumb', defineBreadcrumb)
export const SchemaOrgComment = defineSchemaOrgComponent('SchemaOrgComment', defineComment)
export const SchemaOrgEvent = defineSchemaOrgComponent('SchemaOrgEvent', defineEvent)
export const SchemaOrgFoodEstablishment = defineSchemaOrgComponent('SchemaOrgFoodEstablishment', defineFoodEstablishment)
export const SchemaOrgHowTo = defineSchemaOrgComponent('SchemaOrgHowTo', defineHowTo)
export const SchemaOrgImage = defineSchemaOrgComponent('SchemaOrgImage', defineImage)
export const SchemaOrgJobPosting = defineSchemaOrgComponent('SchemaOrgJobPosting', defineJobPosting)
export const SchemaOrgLocalBusiness = defineSchemaOrgComponent('SchemaOrgLocalBusiness', defineLocalBusiness)
export const SchemaOrgOrganization = defineSchemaOrgComponent('SchemaOrgOrganization', defineOrganization)
export const SchemaOrgPerson = defineSchemaOrgComponent('SchemaOrgPerson', definePerson)
export const SchemaOrgProduct = defineSchemaOrgComponent('SchemaOrgProduct', defineProduct)
export const SchemaOrgQuestion = defineSchemaOrgComponent('SchemaOrgQuestion', defineQuestion)
export const SchemaOrgRecipe = defineSchemaOrgComponent('SchemaOrgRecipe', defineRecipe)
export const SchemaOrgReview = defineSchemaOrgComponent('SchemaOrgReview', defineReview)
export const SchemaOrgVideo = defineSchemaOrgComponent('SchemaOrgVideo', defineVideo)
export const SchemaOrgWebPage = defineSchemaOrgComponent('SchemaOrgWebPage', defineWebPage)
export const SchemaOrgWebSite = defineSchemaOrgComponent('SchemaOrgWebSite', defineWebSite)
export const SchemaOrgMovie = defineSchemaOrgComponent('SchemaOrgMovie', defineMovie)
export const SchemaOrgCourse = defineSchemaOrgComponent('SchemaOrgCourse', defineCourse)
export const SchemaOrgItemList = defineSchemaOrgComponent('SchemaOrgItemList', defineItemList)
export const SchemaOrgBook = defineSchemaOrgComponent('SchemaOrgBook', defineBook)
export const SchemaOrgSoftwareApp = defineSchemaOrgComponent('SchemaOrgSoftwareApp', defineSoftwareApp)
