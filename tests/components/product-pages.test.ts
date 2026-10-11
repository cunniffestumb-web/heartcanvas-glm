import { describe, expect, it, vi } from 'vitest'
import { createPinia } from 'pinia'
import { mount, RouterLinkStub, shallowMount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'
import GalleryPage from '@/pages/GalleryPage.vue'
import DatabasePage from '@/pages/DatabasePage.vue'
import TechnologyPage from '@/pages/TechnologyPage.vue'
import ScenariosPage from '@/pages/ScenariosPage.vue'

vi.mock('@/components/charts/TrendLineChart.vue', () => ({ default: { template: '<div />' } }))
vi.mock('@/components/charts/ChinaRiskMap.vue', () => ({ default: { template: '<div />' } }))
vi.mock('@/components/charts/PopulationRadarChart.vue', () => ({
  default: { template: '<div />' },
}))
vi.mock('@/components/charts/EmotionStackedBar.vue', () => ({ default: { template: '<div />' } }))
vi.mock('@/components/charts/KeywordCloud.vue', () => ({ default: { template: '<div />' } }))

const global = {
  plugins: [createPinia()],
  stubs: { RouterLink: RouterLinkStub, AsyncComponentWrapper: true },
}

describe('product pages', () => {
  it('offers support, gallery and four topic entry links', () => {
    const wrapper = shallowMount(HomePage, { global })
    const destinations = wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'))

    expect(wrapper.get('h1').text()).toContain('心绘 GLM')
    expect(destinations).toContain('/gallery')
    expect(destinations).toContain('/consultation')
    const topics = destinations.filter(
      (destination) => typeof destination === 'object' && destination.query?.topic,
    )
    expect(topics.map((destination) => destination.query.topic)).toEqual([
      'exam',
      'relationships',
      'sleep',
      'work',
    ])
    expect(wrapper.text()).not.toContain('12,680')
  })

  it('renders five linked visualization modules with a formal data notice', () => {
    const wrapper = mount(GalleryPage, {
      global: {
        ...global,
        stubs: {
          ...global.stubs,
          TrendLineChart: true,
          ChinaRiskMap: true,
          PopulationRadarChart: true,
          EmotionStackedBar: true,
          KeywordCloud: true,
        },
      },
    })
    expect(wrapper.findAll('[data-chart-card]')).toHaveLength(5)
    expect(wrapper.text()).toContain('数据说明')
    expect(wrapper.text()).not.toContain('演示数据')
    expect(wrapper.findAll('select')).toHaveLength(4)
  })

  it('filters the database table using visible controls', async () => {
    const wrapper = mount(DatabasePage, { global })
    const regionSelect = wrapper.get('[data-filter="region"]')

    await regionSelect.setValue('北京')

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.text().includes('北京'))).toBe(true)
    expect(wrapper.text()).toContain('匿名化聚合数据')
    expect(wrapper.text()).not.toContain('/api/')
    expect(wrapper.text()).not.toMatch(/MVP|演示|模拟/u)
  })

  it('connects the Xinhui GLM brand to its local model training architecture', () => {
    const wrapper = shallowMount(TechnologyPage, { global })

    for (const term of ['心绘 GLM', '本地 GLM 基座', '心理支持场景训练', '安全策略', '会话记忆', '人格化交互']) {
      expect(wrapper.text()).toContain(term)
    }
    expect(wrapper.text()).not.toMatch(/DeepSeek|Deep Seek|MVP|LoRA|LangChain|已完成全部训练/iu)
    expect(wrapper.findAll('[data-model-stage]')).toHaveLength(3)
  })

  it('keeps internal development language off the home page', () => {
    const wrapper = shallowMount(HomePage, { global })

    expect(wrapper.text()).not.toMatch(/MVP|演示|模拟|ChatGLM2-6B/u)
    expect(wrapper.get('.hero-description').text()).toContain('基于本地 GLM 模型训练而成')
  })

  it('covers four application environments and three future product forms', () => {
    const wrapper = shallowMount(ScenariosPage, { global })

    for (const term of [
      '学校',
      '医院',
      '社区',
      '心理咨询机构',
      'Web 平台',
      '微信小程序',
      '医疗平台插件',
    ]) {
      expect(wrapper.text()).toContain(term)
    }
    expect(wrapper.text()).not.toMatch(/MVP|演示/u)
  })
})
