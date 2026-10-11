import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { localDay, useWellbeingStore } from '@/stores/wellbeing'

describe('personal wellbeing records', () => {
  beforeEach(() => { localStorage.clear(); setActivePinia(createPinia()) })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('restores mood notes and preferences after reopening and preserves separate chat storage', () => {
    localStorage.setItem('xinhui-consultation', 'existing-chat')
    const store = useWellbeingStore()
    store.addEntry('cloudy', '  今天稍微累一点。  ')
    store.setPreferences(' 小绘 ', true)
    setActivePinia(createPinia())
    const reopened = useWellbeingStore()
    expect(reopened.entries[0]).toMatchObject({ mood: 'cloudy', note: '今天稍微累一点。' })
    expect(reopened.nickname).toBe('小绘')
    expect(reopened.quietMotion).toBe(true)
    expect(localStorage.getItem('xinhui-consultation')).toBe('existing-chat')
    reopened.removeEntry(reopened.entries[0]!.id)
    setActivePinia(createPinia())
    expect(useWellbeingStore().entries).toHaveLength(0)
  })
  it('counts local calendar days rather than UTC days or number of entries', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 11, 0, 15))
    const store = useWellbeingStore()
    store.addEntry('calm'); store.addEntry('sunny')
    expect(store.todayEntries).toHaveLength(2)
    expect(store.recordedDays).toBe(1)
    expect(localDay(new Date(2026, 9, 11, 0, 15))).toBe('2026-10-11')
    vi.setSystemTime(new Date(2026, 9, 12, 0, 15))
    store.addEntry('mixed')
    expect(store.todayEntries).toHaveLength(1)
    expect(store.recordedDays).toBe(2)
  })
  it('ignores invalid restored records while retaining valid notes', () => {
    localStorage.setItem('xinhui-wellbeing-v1', JSON.stringify({ version: 1, entries: [null,
      { id: 'wrong-mood', mood: 'unknown', note: '', createdAt: new Date().toISOString() },
      { id: 'wrong-date', mood: 'calm', note: '', createdAt: 'invalid' },
      { id: 'valid', mood: 'calm', note: 'a'.repeat(600), createdAt: new Date().toISOString() },
    ] }))
    const store = useWellbeingStore()
    expect(store.entries).toHaveLength(1)
    expect(store.entries[0]!.note).toHaveLength(500)
  })
  it('keeps a new record usable and reports persistence failure', () => {
    const store = useWellbeingStore()
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('quota') })
    expect(() => store.addEntry('rainy', '仍然可以写下来')).not.toThrow()
    expect(store.entries[0]!.note).toBe('仍然可以写下来')
    expect(store.storageWarning).toContain('本次打开')
  })
})
