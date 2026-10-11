import { describe, expect, it } from 'vitest'
import { routes } from '@/router'

describe('application shell', () => {
  it('exposes all product routes including the case center', () => {
    expect(routes.map((route) => route.name)).toEqual(expect.arrayContaining([
      'home',
      'gallery',
      'database',
      'cases',
      'case-detail',
      'consultation',
      'technology',
      'scenarios',
      'app-today',
      'app-chat',
      'app-mood',
      'app-me',
    ]))
  })
  it('preserves existing topic links when opening the new application', () => {
    const legacy = routes.find(route => route.name === 'consultation')!
    const redirect = legacy.redirect as (to: any) => unknown
    expect(redirect({ query: { topic: 'exam', region: '广东' }, hash: '#draft' })).toEqual({
      path: '/app/chat', query: { topic: 'exam', region: '广东' }, hash: '#draft',
    })
    expect(routes.find(route => route.path === '/app/chat')?.meta?.application).toBe(true)
    expect(routes.find(route => route.path === '/')?.meta?.application).toBeUndefined()
  })
})
