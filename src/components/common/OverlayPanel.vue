<script lang="ts">
let openCount = 0
let previousOverflow = ''
</script>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { XIcon } from '@lucide/vue'
withDefaults(defineProps<{ title: string; placement?: 'center' | 'right' | 'left' | 'full' }>(), {
  placement: 'center',
})
const emit = defineEmits<{ close: [] }>()
const titleId = useId()
const panel = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null
const focusable = () =>
  [
    ...(panel.value?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input, select, textarea, summary, [tabindex="0"]',
    ) ?? []),
  ].filter((element) => element.tabIndex >= 0 && element.getClientRects().length)
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
  }
  if (event.key !== 'Tab') return
  const items = focusable()
  if (!items.length) {
    event.preventDefault()
    panel.value?.focus()
    return
  }
  const first = items[0]!
  const last = items[items.length - 1]!
  if (
    event.shiftKey &&
    (document.activeElement === first || document.activeElement === panel.value)
  ) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
onMounted(async () => {
  previousFocus = document.activeElement as HTMLElement
  if (openCount++ === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  await nextTick()
  panel.value?.focus()
})
onBeforeUnmount(() => {
  if (--openCount === 0) document.body.style.overflow = previousOverflow
  previousFocus?.focus({ preventScroll: true })
})
</script>
<template>
  <Teleport to="body">
    <div class="overlay" :data-placement="placement" @click.self="emit('close')">
      <section
        ref="panel"
        class="overlay-panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown="keydown"
      >
        <header class="overlay-heading">
          <h2 :id="titleId">{{ title }}</h2>
          <button
            class="icon-button"
            type="button"
            :aria-label="`关闭${title}`"
            @click="emit('close')"
          >
            <XIcon :size="20" />
          </button>
        </header>
        <div class="overlay-body"><slot /></div>
      </section>
    </div>
  </Teleport>
</template>
<style scoped>
.overlay {
  position: fixed;
  z-index: 180;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(27 49 44 / 30%);
  backdrop-filter: blur(5px);
}
.overlay-panel {
  display: flex;
  flex-direction: column;
  width: min(720px, 100%);
  max-height: calc(100dvh - 48px);
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: 0 30px 80px rgb(32 60 56 / 15%);
  outline: none;
}
.overlay-heading {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
}
.overlay-heading h2 {
  margin: 0;
  font-size: 19px;
}
.overlay-body {
  min-height: 0;
  overflow-y: auto;
  padding: 22px;
  overscroll-behavior: contain;
}
.overlay[data-placement='right'],
.overlay[data-placement='left'] {
  padding: 0;
  justify-content: flex-end;
}
.overlay[data-placement='left'] {
  justify-content: flex-start;
}
.overlay[data-placement='right'] .overlay-panel,
.overlay[data-placement='left'] .overlay-panel {
  width: 380px;
  height: 100dvh;
  max-height: 100dvh;
  border-radius: 20px 0 0 20px;
}
.overlay[data-placement='left'] .overlay-panel {
  width: min(86vw, 340px);
  border-radius: 0 20px 20px 0;
}
.overlay[data-placement='full'] {
  padding: 0;
}
.overlay[data-placement='full'] .overlay-panel {
  width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  border: 0;
  border-radius: 0;
}
.overlay[data-placement='full'] .overlay-body {
  display: flex;
  flex: 1;
  padding: 0;
}
@media (max-width: 1023px) {
  .overlay[data-placement='right'] {
    padding: 0;
    align-items: flex-end;
  }
  .overlay[data-placement='right'] .overlay-panel {
    width: 100%;
    height: auto;
    max-height: 85dvh;
    border-radius: 20px 20px 0 0;
    padding-bottom: env(safe-area-inset-bottom);
  }
}
@media (max-width: 767px) {
  .overlay:not([data-placement='left']):not([data-placement='full']) {
    padding: 0;
    align-items: flex-end;
  }
  .overlay:not([data-placement='left']):not([data-placement='full']) .overlay-panel {
    width: 100%;
    height: auto;
    max-height: 85dvh;
    border-radius: 20px 20px 0 0;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .overlay-heading,
  .overlay-body {
    padding: 16px;
  }
}
</style>
