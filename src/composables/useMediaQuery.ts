import { onBeforeUnmount, onMounted, ref } from 'vue'
export function useMediaQuery(query: string) {
  const media = typeof window !== 'undefined' ? window.matchMedia(query) : null
  const matches = ref(media?.matches ?? false)
  const update = () => {
    matches.value = media?.matches ?? false
  }
  onMounted(() => {
    update()
    media?.addEventListener('change', update)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', update))
  return matches
}
