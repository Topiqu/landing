export default defineAppConfig({
  ui: {
    colors: { primary: 'indigo', neutral: 'slate', success: 'emerald', info: 'sky', warning: 'amber', error: 'red' },
    button: {
      slots: { base: 'tw:rounded-[var(--topiqu-control-radius)] tw:whitespace-nowrap tw:min-h-11' },
      variants: { square: { true: 'tw:size-11 tw:shrink-0 tw:justify-center tw:p-0' } },
    },
    input: { slots: { base: 'tw:rounded-[var(--topiqu-input-radius)]' } },
    textarea: { slots: { base: 'tw:rounded-[var(--topiqu-input-radius)]' } },
    select: {
      slots: {
        base: 'tw:rounded-[var(--topiqu-control-radius)]',
        content: 'tw:rounded-[var(--topiqu-control-radius)]',
      },
    },
    selectMenu: {
      slots: {
        base: 'tw:rounded-[var(--topiqu-control-radius)]',
        content: 'tw:rounded-[var(--topiqu-control-radius)]',
      },
    },
    popover: { slots: { content: 'tw:rounded-[var(--topiqu-surface-radius)]' } },
    card: { slots: { root: 'tw:rounded-[var(--topiqu-surface-radius)]' } },
    alert: { slots: { root: 'tw:rounded-[var(--topiqu-surface-radius)]' } },
    modal: {
      slots: {
        header: 'tw:items-start tw:pe-20',
        footer: 'tw:justify-end tw:gap-3 tw:flex-wrap',
      },
      variants: { fullscreen: { false: { content: 'tw:rounded-[var(--topiqu-surface-radius)]' } } },
    },
    dropdownMenu: {
      slots: {
        content: 'tw:rounded-[var(--topiqu-control-radius)]',
        item: 'tw:before:rounded-[var(--topiqu-control-radius)]',
      },
    },
  },
})
