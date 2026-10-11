import { onBeforeUnmount, onMounted, ref } from 'vue'
export function useVisualViewport() {
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 800)
  const update = () => {
    height.value = window.visualViewport?.height ?? window.innerHeight
  }
  onMounted(() => {
    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
    window.visualViewport?.removeEventListener('resize', update)
  })
  return height
}
