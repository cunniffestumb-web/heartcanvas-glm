import { computed, onScopeDispose, ref } from 'vue'
import { defineStore } from 'pinia'

export const moods = [
  { id: 'sunny', label: '很开心', face: '◡', color: '#e9bf66', reply: '把这一点明亮，留给以后的自己。' },
  { id: 'calm', label: '还不错', face: 'ᴗ', color: '#8caf94', reply: '平平常常的一天，也值得被记住。' },
  { id: 'cloudy', label: '有点累', face: '–', color: '#a9a1c3', reply: '辛苦了。今天也可以对自己宽松一点。' },
  { id: 'rainy', label: '不太好', face: '⌢', color: '#8daaba', reply: '不需要马上好起来，我陪你慢慢走。' },
  { id: 'mixed', label: '说不清', face: '∿', color: '#cf9d88', reply: '说不清也没关系，感受不必有标准答案。' },
] as const
export type MoodId = (typeof moods)[number]['id']
export interface MoodEntry { id: string; mood: MoodId; note: string; createdAt: string }
const key = 'xinhui-wellbeing-v1'
export function localDay(date: Date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export const useWellbeingStore = defineStore('wellbeing', () => {
  const entries = ref<MoodEntry[]>([])
  const nickname = ref('')
  const quietMotion = ref(false)
  const storageWarning = ref('')
  // Page-local drafts survive navigation, but are never sent to the model.
  const draftMood = ref<MoodId | ''>('')
  const draftNote = ref('')
  const pendingAdds = new Map<string, MoodEntry>()
  const pendingDeletes = new Set<string>()
  let pendingPreferences = false
  function refreshFromStorage() {
    try {
      const data = JSON.parse(localStorage.getItem(key) || 'null')
      let fresh: MoodEntry[] = []
      if (data?.version === 1 && Array.isArray(data.entries)) fresh = data.entries.filter((entry: MoodEntry) =>
        entry && typeof entry.id === 'string' && moods.some(m => m.id === entry.mood) &&
        typeof entry.note === 'string' && typeof entry.createdAt === 'string' && Number.isFinite(Date.parse(entry.createdAt)),
      ).map((entry: MoodEntry) => ({ ...entry, note: entry.note.slice(0, 500) }))
      const merged = new Map(fresh.map(entry => [entry.id, entry]))
      pendingAdds.forEach((entry, id) => merged.set(id, entry))
      pendingDeletes.forEach(id => merged.delete(id))
      entries.value = [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      if (!pendingPreferences) {
        nickname.value = typeof data?.nickname === 'string' ? data.nickname.slice(0, 20) : ''
        quietMotion.value = data?.quietMotion === true
      }
    } catch { storageWarning.value = '此浏览器暂时无法读取记录，当前仍可使用。' }
  }
  refreshFromStorage()
  if (typeof window !== 'undefined') {
    const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) refreshFromStorage() }
    window.addEventListener('storage', sync)
    onScopeDispose(() => window.removeEventListener('storage', sync))
    }
  const todayEntries = computed(() => entries.value.filter(entry => localDay(new Date(entry.createdAt)) === localDay()))
  const recordedDays = computed(() => new Set(entries.value.map(entry => localDay(new Date(entry.createdAt)))).size)
  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, nickname: nickname.value, quietMotion: quietMotion.value, entries: entries.value }))
      storageWarning.value = ''
      pendingAdds.clear(); pendingDeletes.clear(); pendingPreferences = false
    } catch { storageWarning.value = '记录暂时只在本次打开中保留，请先导出后再离开。' }
  }
  function addEntry(mood: MoodId, note = '') {
    if (!moods.some(item => item.id === mood)) return
    refreshFromStorage()
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const entry = { id, mood, note: note.trim().slice(0, 500), createdAt: new Date().toISOString() }
    entries.value.unshift(entry)
    pendingAdds.set(id, entry)
    persist()
  }
  function removeEntry(id: string) {
    refreshFromStorage(); entries.value = entries.value.filter(entry => entry.id !== id)
    pendingAdds.delete(id); pendingDeletes.add(id); persist()
  }
  function setPreferences(name: string, quiet: boolean) {
    refreshFromStorage(); nickname.value = name.trim().slice(0, 20); quietMotion.value = quiet
    pendingPreferences = true; persist()
  }
  return { entries, nickname, quietMotion, draftMood, draftNote, storageWarning, todayEntries, recordedDays, addEntry, removeEntry, setPreferences }
})
