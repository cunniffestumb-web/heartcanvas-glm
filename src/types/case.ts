export type CaseNature = '学术个案' | '教学案例' | '机构公开案例'
export type SourceReliability = 'A' | 'B'
export type VerificationStatus = '已核验' | '条件核验'

export interface MentalHealthCase {
  id: string
  title: string
  slug: string
  category: string
  keywords: string[]
  caseNature: CaseNature
  realCaseStatus: string
  alias: string
  ageRange: string
  summary: string
  background: string
  mainConcern: string
  emotionalSigns: string[]
  behavioralSigns: string[]
  context: string
  helpSeekingProcess: string
  copingMethods: string[]
  professionalSupport: string
  outcome: string
  educationalTakeaways: string[]
  limitations: string
  riskLevel: string
  sourceOrganization: string
  sourceTitle: string
  sourceAuthor: string
  sourceType: string
  sourceUrl: string
  sourcePublishedAt: string
  sourceAccessedAt: string
  sourceReliability: SourceReliability
  verificationStatus: VerificationStatus
  privacyNote: string
  copyrightNote: string
  readingTime: number
  publishedAt: string
  updatedAt: string
}

export interface CaseFilters {
  query: string
  category: string
  sourceType: string
  caseNature: string
}
