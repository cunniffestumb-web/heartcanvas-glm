import type { VoicePreference } from '@/types/consultation'

interface RecognitionAlternativeLike { transcript: string }
interface RecognitionResultLike { 0: RecognitionAlternativeLike; isFinal: boolean }
interface RecognitionEventLike { resultIndex: number; results: ArrayLike<RecognitionResultLike> }
interface RecognitionErrorLike { error: string }
interface RecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: RecognitionEventLike) => void) | null
  onerror: ((event: RecognitionErrorLike) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionConstructor = new () => RecognitionLike

const femalePattern = /xiaoxiao|xiaoyi|huihui|yaoyao|meijia|tingting|female|woman|女/iu
const malePattern = /yunxi|yunyang|kangkang|danny|male|man|男/iu

function recognitionConstructor(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  const speechWindow = window as Window & {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition
}

export function listChineseVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter((voice) => /^zh(?:-|$)/iu.test(voice.lang))
}

export function selectVoice(
  voices: SpeechSynthesisVoice[],
  preference: VoicePreference,
  preferredVoiceURI?: string,
): SpeechSynthesisVoice | undefined {
  const chinese = listChineseVoices(voices)
  const explicit = chinese.find((voice) => voice.voiceURI === preferredVoiceURI)
  if (explicit) return explicit
  const pattern = preference === 'female' ? femalePattern : preference === 'male' ? malePattern : null
  return (pattern ? chinese.find((voice) => pattern.test(`${voice.name} ${voice.voiceURI}`)) : undefined)
    || chinese.find((voice) => voice.default)
    || chinese[preference === 'male' && chinese.length > 1 ? 1 : 0]
}

export function getSystemVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  return listChineseVoices(window.speechSynthesis.getVoices())
}

export function onVoicesChanged(callback: (voices: SpeechSynthesisVoice[]) => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return () => undefined
  const handler = () => callback(getSystemVoices())
  window.speechSynthesis.addEventListener('voiceschanged', handler)
  handler()
  return () => window.speechSynthesis.removeEventListener('voiceschanged', handler)
}

export function supportsSpeechRecognition(): boolean {
  return Boolean(recognitionConstructor())
}

export function createSpeechRecognition(callbacks: {
  onInterim: (text: string) => void
  onFinal: (text: string) => void
  onError: (message: string) => void
  onEnd: () => void
}): RecognitionLike | null {
  const Constructor = recognitionConstructor()
  if (!Constructor) return null
  const recognition = new Constructor()
  recognition.lang = 'zh-CN'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.onresult = (event) => {
    let interim = ''
    let final = ''
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const text = event.results[index][0]?.transcript || ''
      if (event.results[index].isFinal) final += text
      else interim += text
    }
    callbacks.onInterim(interim)
    if (final.trim()) callbacks.onFinal(final.trim())
  }
  recognition.onerror = (event) => callbacks.onError(event.error === 'not-allowed' ? '请允许浏览器使用麦克风后重试' : '没有听清，请再说一次')
  recognition.onend = callbacks.onEnd
  return recognition
}

export function speakText(
  text: string,
  voices: SpeechSynthesisVoice[],
  preference: VoicePreference,
  preferredVoiceURI?: string,
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return Promise.resolve()
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = preference === 'male' ? 0.94 : 0.98
  utterance.pitch = preference === 'female' ? 1.04 : 0.96
  utterance.voice = selectVoice(voices, preference, preferredVoiceURI) || null
  return new Promise((resolve) => {
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}
