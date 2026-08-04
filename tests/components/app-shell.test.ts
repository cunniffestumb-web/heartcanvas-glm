import { describe, expect, it } from 'vitest'
import { routes } from '@/router'

describe('application shell', () => {
  it('exposes all product routes including the case center', () => {
    expect(routes.map((route) => route.name)).toEqual([
      'home',
      'gallery',
      'database',
      'cases',
      'case-detail',
      'consultation',
      'technology',
      'scenarios',
    ])
  })
})
