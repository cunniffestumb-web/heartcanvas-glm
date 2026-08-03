import trendsJson from '@/data/mock/trends.json'
import regionsJson from '@/data/mock/regions.json'
import populationsJson from '@/data/mock/populations.json'
import emotionDistributionJson from '@/data/mock/emotionDistribution.json'
import keywordsJson from '@/data/mock/keywords.json'
import databaseRecordsJson from '@/data/mock/databaseRecords.json'
import type {
  DatabaseRecord,
  EmotionDistributionRecord,
  GalleryDataset,
  GalleryFilters,
  KeywordRecord,
  PopulationName,
  PopulationRecord,
  RegionRecord,
  TrendRow,
} from '@/types/statistics'

export const baseRegions = regionsJson as RegionRecord[]
export const databaseRecords = databaseRecordsJson as DatabaseRecord[]

const populationFactors: Record<PopulationName, number> = {
  青少年: 0.96,
  大学生: 1.06,
  职场人: 1.1,
  老年群体: 0.84,
}

const emotionKeys = {
  焦虑: 'anxiety',
  抑郁: 'depression',
  压力: 'stress',
  孤独: 'depression',
  睡眠困扰: 'sleep',
} as const

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

export function getGalleryDataset(filters: GalleryFilters): GalleryDataset {
  const populationFactor = populationFactors[filters.population]
  const selectedKey = emotionKeys[filters.emotionType]
  const selectedRegion = filters.region === '全国'
    ? null
    : baseRegions.find((region) => region.name === filters.region)
  const regionFactor = selectedRegion ? selectedRegion.riskIndex / 65 : 1

  const trends = (trendsJson as TrendRow[])
    .filter((row) => row.year <= filters.year)
    .map((row) => ({
      ...row,
      anxiety: clamp(row.anxiety * populationFactor * regionFactor * (selectedKey === 'anxiety' ? 1.06 : 0.98)),
      depression: clamp(row.depression * populationFactor * regionFactor * (selectedKey === 'depression' ? 1.08 : 0.98)),
      stress: clamp(row.stress * populationFactor * regionFactor * (selectedKey === 'stress' ? 1.08 : 0.98)),
      sleep: clamp(row.sleep * populationFactor * regionFactor * (selectedKey === 'sleep' ? 1.08 : 0.98)),
    }))

  const regions = baseRegions.map((region) => ({
    ...region,
    riskIndex: clamp(region.riskIndex * populationFactor * (region.mainEmotion === filters.emotionType ? 1.05 : 0.98)),
  }))

  return {
    trends,
    regions,
    populations: populationsJson as PopulationRecord[],
    emotionDistribution: emotionDistributionJson as EmotionDistributionRecord[],
    keywords: (keywordsJson as KeywordRecord[])
      .map((word) => ({ ...word, value: clamp(word.value * (word.category === filters.emotionType ? 1.12 : 0.94)) }))
      .sort((a, b) => b.value - a.value),
  }
}

export function filterDatabaseRecords(filters: Pick<GalleryFilters, 'region' | 'population' | 'emotionType'>): DatabaseRecord[] {
  return databaseRecords.filter((record) => (
    (filters.region === '全国' || record.region === filters.region)
    && record.population === filters.population
    && record.emotionType === filters.emotionType
  ))
}
