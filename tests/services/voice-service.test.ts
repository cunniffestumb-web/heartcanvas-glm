import { describe, expect, it } from 'vitest'
import { listChineseVoices, selectVoice } from '@/services/voiceService'

const voices = [
  { name: 'Microsoft Xiaoxiao Online (Natural)', lang: 'zh-CN', voiceURI: 'xiaoxiao', default: true, localService: false },
  { name: 'Microsoft Yunxi Online (Natural)', lang: 'zh-CN', voiceURI: 'yunxi', default: false, localService: false },
  { name: 'Meijia', lang: 'zh-TW', voiceURI: 'meijia', default: false, localService: true },
  { name: 'David', lang: 'en-US', voiceURI: 'david', default: false, localService: true },
] as SpeechSynthesisVoice[]

describe('voice service', () => {
  it('lists only Chinese voices', () => {
    expect(listChineseVoices(voices).map((voice) => voice.voiceURI)).toEqual(['xiaoxiao', 'yunxi', 'meijia'])
  })

  it('matches distinct voices to female and male doctor personalities', () => {
    expect(selectVoice(voices, 'female')?.voiceURI).toBe('xiaoxiao')
    expect(selectVoice(voices, 'male')?.voiceURI).toBe('yunxi')
  })

  it('prefers an explicitly selected Chinese voice', () => {
    expect(selectVoice(voices, 'male', 'meijia')?.voiceURI).toBe('meijia')
  })
})
