import type { CaseFilters, MentalHealthCase } from '@/types/case'

const normalize = (value: string) => value.trim().toLocaleLowerCase('zh-CN')

export function filterCases(items: MentalHealthCase[], filters: CaseFilters) {
  const query = normalize(filters.query)

  return items.filter((item) => {
    const searchable = normalize([
      item.title,
      item.summary,
      item.alias,
      item.category,
      item.sourceOrganization,
      ...item.keywords,
    ].join(' '))

    return (!query || searchable.includes(query))
      && (!filters.category || item.category === filters.category)
      && (!filters.sourceType || item.sourceType === filters.sourceType)
      && (!filters.caseNature || item.caseNature === filters.caseNature)
  })
}

export function getCaseBySlug(items: MentalHealthCase[], slug: string) {
  return items.find((item) => item.slug === slug)
}

export function getRelatedCases(items: MentalHealthCase[], current: MentalHealthCase, limit = 3) {
  return items
    .filter((item) => item.id !== current.id)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, limit)
}
