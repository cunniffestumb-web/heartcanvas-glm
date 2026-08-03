export type PopulationName = '青少年' | '大学生' | '职场人' | '老年群体'
export type EmotionType = '焦虑' | '抑郁' | '压力' | '孤独' | '睡眠困扰'

export interface GalleryFilters {
  year: number
  region: string
  population: PopulationName
  emotionType: EmotionType
}

export interface TrendRow {
  year: number
  anxiety: number
  depression: number
  stress: number
  sleep: number
}

export interface RegionRecord {
  name: string
  riskIndex: number
  level: string
  mainEmotion: EmotionType
  suggestion: string
}

export interface PopulationRecord {
  group: PopulationName
  anxiety: number
  stress: number
  sleep: number
  social: number
  stability: number
}

export interface EmotionDistributionRecord {
  group: PopulationName
  anxiety: number
  depression: number
  stress: number
  loneliness: number
  sleep: number
}

export interface KeywordRecord {
  name: string
  value: number
  category: EmotionType | '人际关系'
}

export interface DatabaseRecord {
  id: string
  year: number
  region: string
  population: PopulationName
  emotionType: EmotionType
  riskIndex: number
  source: string
  sampleSize: number
}

export interface GalleryDataset {
  trends: TrendRow[]
  regions: RegionRecord[]
  populations: PopulationRecord[]
  emotionDistribution: EmotionDistributionRecord[]
  keywords: KeywordRecord[]
}
