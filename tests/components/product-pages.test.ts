import { describe, expect, it } from 'vitest'
import { createPinia } from 'pinia'
import { mount, RouterLinkStub, shallowMount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'
import GalleryPage from '@/pages/GalleryPage.vue'
import DatabasePage from '@/pages/DatabasePage.vue'
import TechnologyPage from '@/pages/TechnologyPage.vue'
import ScenariosPage from '@/pages/ScenariosPage.vue'

const global = {
  plugins: [createPinia()],
  stubs: { RouterLink: RouterLinkStub },
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

  it('renders five linked visualization modules and a demonstration label', () => {
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
    expect(wrapper.text()).toContain('演示数据')
    expect(wrapper.findAll('select')).toHaveLength(4)
  })

  it('filters the database table using visible controls', async () => {
    const wrapper = mount(DatabasePage, { global })
    const regionSelect = wrapper.get('[data-filter="region"]')

    await regionSelect.setValue('北京')

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.text().includes('北京'))).toBe(true)
    expect(wrapper.text()).toContain('演示数据')
  })

  it('preserves the original project technology narrative', () => {
    const wrapper = shallowMount(TechnologyPage, { global })

    for (const term of ['ChatGLM2-6B', 'LoRA', 'Prompt', 'LangChain', '心理知识图谱']) {
      expect(wrapper.text()).toContain(term)
    }
  })

  it('covers four application environments and three future product forms', () => {
    const wrapper = shallowMount(ScenariosPage, { global })

    for (const term of ['学校', '医院', '社区', '心理咨询机构', 'Web 平台', '微信小程序', '医疗平台插件']) {
      expect(wrapper.text()).toContain(term)
    }
  })
})
