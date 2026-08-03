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
vi.mock('@/components/charts/PopulationRadarChart.vue', () => ({ default: { template: '<div />' } }))
vi.mock('@/components/charts/EmotionStackedBar.vue', () => ({ default: { template: '<div />' } }))
vi.mock('@/components/charts/KeywordCloud.vue', () => ({ default: { template: '<div />' } }))

const global = {
  plugins: [createPinia()],
  stubs: { RouterLink: RouterLinkStub, AsyncComponentWrapper: true },
}

describe('product pages', () => {
  it('puts both core product entrances in the home first viewport', () => {
    const wrapper = shallowMount(HomePage, { global })
    const destinations = wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'))

    expect(wrapper.get('h1').text()).toContain('心绘 GLM')
    expect(destinations).toContain('/gallery')
    expect(destinations).toContain('/consultation')
    expect(wrapper.text()).toContain('识别')
    expect(wrapper.text()).toContain('分析')
    expect(wrapper.text()).toContain('干预')
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

  it('presents only the technology capabilities implemented by the product', () => {
    const wrapper = shallowMount(TechnologyPage, { global })

    for (const term of ['DeepSeek', '安全策略', '会话记忆', '人格化交互']) {
      expect(wrapper.text()).toContain(term)
    }
    expect(wrapper.text()).not.toMatch(/MVP|LoRA|LangChain|已完成全部训练/u)
  })

  it('keeps internal development language off the home page', () => {
    const wrapper = shallowMount(HomePage, { global })

    expect(wrapper.text()).not.toMatch(/MVP|演示|模拟|ChatGLM2-6B/u)
  })

  it('covers four application environments and three future product forms', () => {
    const wrapper = shallowMount(ScenariosPage, { global })

    for (const term of ['学校', '医院', '社区', '心理咨询机构', 'Web 平台', '微信小程序', '医疗平台插件']) {
      expect(wrapper.text()).toContain(term)
    }
    expect(wrapper.text()).not.toMatch(/MVP|演示/u)
  })
})
