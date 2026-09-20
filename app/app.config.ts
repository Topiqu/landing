export default defineAppConfig({
  ui: {
    colors: { primary: 'indigo', neutral: 'slate', success: 'emerald', info: 'sky', warning: 'amber', error: 'red' },
    button: { slots: { base: 'tw:rounded-[var(--ui-radius)] tw:whitespace-nowrap tw:min-h-11' } },
  },
})
