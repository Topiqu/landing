import { THEME_COLORS } from '~~/shared/utils/plans'

export const useAgencySamples = () => {
  const { tm, rt } = useI18n()
  return computed(() =>
    (tm('agencies.samples') as { name: string; domain: string; section: string; title: string }[]).map(
      (sample, index) => ({
        ...AGENCY_SAMPLE_BLOGS[index]!,
        color: THEME_COLORS[AGENCY_SAMPLE_BLOGS[index]!.theme],
        name: rt(sample.name),
        domain: rt(sample.domain),
        section: rt(sample.section),
        title: rt(sample.title),
      }),
    ),
  )
}
