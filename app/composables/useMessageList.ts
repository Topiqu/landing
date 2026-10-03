type Message = Parameters<ReturnType<typeof useI18n>['rt']>[0]

/** Resolves an array of flat message objects from the locale files. */
export function useMessageList<K extends string>(key: string) {
  const { tm, rt } = useI18n()
  return computed(() =>
    (tm(key) as Record<K, Message>[]).map(
      (item) =>
        Object.fromEntries(Object.entries(item).map(([name, value]) => [name, rt(value as Message)])) as Record<
          K,
          string
        >,
    ),
  )
}

/** Resolves an array of plain strings from the locale files. */
export function useMessageStrings(key: string) {
  const { tm, rt } = useI18n()
  return computed(() => (tm(key) as Message[]).map((item) => rt(item)))
}
