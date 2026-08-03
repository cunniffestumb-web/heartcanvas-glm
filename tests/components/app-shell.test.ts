import { describe, expect, it } from 'vitest'
import { routes } from '@/router'

describe('application shell', () => {
  it('exposes all six product routes', () => {
    expect(routes.map((route) => route.name)).toEqual([
      'home',
      'gallery',
      'database',
      'consultation',
      'technology',
      'scenarios',
    ])
  })
})
