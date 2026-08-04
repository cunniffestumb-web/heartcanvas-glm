import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import CaseListPage from '@/pages/CaseListPage.vue'
import CaseDetailPage from '@/pages/CaseDetailPage.vue'
import { cases } from '@/data/cases'
import { filterCases } from '@/services/caseService'

describe('case center data', () => {
  it('contains eight traceable A-rated cases without unsafe outcome claims', () => {
    expect(cases).toHaveLength(8)

    for (const item of cases) {
      expect(item.sourceReliability).toBe('A')
      expect(item.sourceUrl).toMatch(/^https:\/\//u)
      expect(item.sourceOrganization.length).toBeGreaterThan(0)
      expect(item.sourceTitle.length).toBeGreaterThan(0)
      expect(item.privacyNote.length).toBeGreaterThan(0)
      expect(item.copyrightNote.length).toBeGreaterThan(0)
      expect(JSON.stringify(item)).not.toMatch(/彻底治愈|保证有效|完全康复|一定可以|最佳治疗方法/u)
    }
  })

  it('filters by keyword, category, source type and case nature', () => {
    expect(filterCases(cases, { query: '考试', category: '', sourceType: '', caseNature: '' })).toHaveLength(1)
    expect(filterCases(cases, { query: '', category: '睡眠困扰', sourceType: '', caseNature: '' })).toHaveLength(1)
    expect(filterCases(cases, { query: '', category: '', sourceType: '政府研究报告', caseNature: '' })).toHaveLength(1)
    expect(filterCases(cases, { query: '', category: '', sourceType: '', caseNature: '教学案例' })).toHaveLength(2)
    expect(filterCases(cases, { query: '不存在的关键词', category: '', sourceType: '', caseNature: '' })).toHaveLength(0)
  })
})

describe('case center pages', () => {
  it('renders searchable case cards and an empty state', async () => {
    const wrapper = mount(CaseListPage, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.findAll('[data-case-card]')).toHaveLength(8)
    expect(wrapper.text()).toContain('案例中心')
    expect(wrapper.text()).toContain('来源可靠性 A')

    await wrapper.get('[data-case-search]').setValue('不存在的关键词')

    expect(wrapper.findAll('[data-case-card]')).toHaveLength(0)
    expect(wrapper.text()).toContain('没有找到符合条件的案例')
  })

  it('renders a full detail page with safe source links', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/cases', component: CaseListPage },
        { path: '/cases/:slug', component: CaseDetailPage },
      ],
    })
    await router.push('/cases/test-anxiety-adolescent')
    await router.isReady()

    const wrapper = mount(CaseDetailPage, { global: { plugins: [router] } })

    for (const heading of ['案例背景', '主要困扰', '情绪和行为表现', '形成背景', '求助过程', '应对方法', '后续变化', '科普启示', '案例局限', '来源与参考资料', '隐私说明', '免责声明']) {
      expect(wrapper.text()).toContain(heading)
    }

    const sourceLink = wrapper.get('[data-source-link]')
    expect(sourceLink.attributes('target')).toBe('_blank')
    expect(sourceLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('shows an error state for an unknown case slug', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/cases/:slug', component: CaseDetailPage }],
    })
    await router.push('/cases/not-found')
    await router.isReady()

    const wrapper = mount(CaseDetailPage, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('没有找到这个案例')
  })
})
