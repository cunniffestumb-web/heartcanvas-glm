import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatInput from '@/components/consultation/ChatInput.vue'
import CrisisNotice from '@/components/consultation/CrisisNotice.vue'

describe('consultation controls', () => {
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
})
