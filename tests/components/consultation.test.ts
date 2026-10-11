import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatInput from '@/components/consultation/ChatInput.vue'
import CrisisNotice from '@/components/consultation/CrisisNotice.vue'
import ModeBadge from '@/components/common/ModeBadge.vue'

describe('consultation controls', () => {
  afterEach(() => vi.restoreAllMocks())
  it('prevents empty messages and emits trimmed content', async () => {
    const wrapper = mount(ChatInput, { props: { sending: false } })
    const button = wrapper.get('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
    await wrapper.get('textarea').setValue('  我最近很焦虑  ')
    expect(button.attributes('disabled')).toBeUndefined()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('send')?.[0]).toEqual(['我最近很焦虑'])
  })

  it('opens the voice call experience from the composer', async () => {
    const wrapper = mount(ChatInput, { props: { sending: false } })

    await wrapper.get('button[aria-label="开始语音通话"]').trigger('click')

    expect(wrapper.emitted('voice')).toHaveLength(1)
  })

  it('shows immediate emergency and trusted-person guidance', () => {
    const wrapper = mount(CrisisNotice)

    expect(wrapper.text()).toContain('立即联系当地急救电话')
    expect(wrapper.text()).toContain('可信赖的人')
    expect(wrapper.text()).toContain('不能替代紧急救助')
  })

  it('uses a presentation-ready service status label', () => {
    const online = mount(ModeBadge, { props: { mode: 'online' } })
    const fallback = mount(ModeBadge, { props: { mode: 'mock' } })

    expect(online.text()).toContain('在线回应')
    expect(fallback.text()).toContain('基础支持')
    expect(`${online.text()} ${fallback.text()}`).not.toMatch(/mock|演示|模式/iu)
  })

  it('does not send during Chinese composition or Shift+Enter', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    const wrapper = mount(ChatInput, { props: { sending: false } })
    const input = wrapper.get('textarea')
    await input.setValue('还在输入中文')
    await input.trigger('compositionstart')
    await input.trigger('keydown', { key: 'Enter', isComposing: true })
    expect(wrapper.emitted('send')).toBeUndefined()
    await input.trigger('compositionend')
    await input.trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(wrapper.emitted('send')).toBeUndefined()
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('send')?.[0]).toEqual(['还在输入中文'])
  })

  it('keeps mobile Enter for a newline and supports cancelling a pending reply', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList)
    const wrapper = mount(ChatInput, { props: { sending: false } })
    await wrapper.get('textarea').setValue('手机上的感受')
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('send')).toBeUndefined()
    await wrapper.setProps({ sending: true })
    await wrapper.get('[aria-label="停止回应"]').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(false)
  })
})
