import { computed, readonly, ref } from 'vue'

interface AppInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const installPrompt = ref<AppInstallPromptEvent | null>(null)
const installed = ref(false)
const installing = ref(false)
const installMessage = ref('')
let removeListeners: (() => void) | undefined

/** Start once at app boot so a prompt is retained before the dialog opens. */
export function initializeAppInstall() {
  if (removeListeners || typeof window === 'undefined') return removeListeners ?? (() => {})

  const standalone = window.matchMedia('(display-mode: standalone)')
  const updateDisplayMode = () => {
    installed.value = standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  }
  const rememberPrompt = (event: Event) => {
    event.preventDefault()
    installPrompt.value = event as AppInstallPromptEvent
    installMessage.value = ''
  }
  const markInstalled = () => {
    installed.value = true
    installPrompt.value = null
    installMessage.value = '已添加心绘，下次可以从桌面或主屏幕打开。'
  }

  updateDisplayMode()
  window.addEventListener('beforeinstallprompt', rememberPrompt)
  window.addEventListener('appinstalled', markInstalled)
  standalone.addEventListener('change', updateDisplayMode)

  removeListeners = () => {
    window.removeEventListener('beforeinstallprompt', rememberPrompt)
    window.removeEventListener('appinstalled', markInstalled)
    standalone.removeEventListener('change', updateDisplayMode)
    installPrompt.value = null
    removeListeners = undefined
  }
  return removeListeners
}

export function useAppInstall() {
  const canInstall = computed(() => Boolean(installPrompt.value) && !installed.value)

  async function install() {
    const prompt = installPrompt.value
    if (!prompt || installing.value) return
    installing.value = true
    installMessage.value = ''
    try {
      await prompt.prompt()
      const choice = await prompt.userChoice
      installMessage.value = choice.outcome === 'accepted'
        ? '已确认添加。完成后，可以从桌面或主屏幕打开心绘。'
        : '这次先留在浏览器里，想添加时再回来就好。'
    } catch {
      installMessage.value = '当前浏览器未完成添加，请按下方步骤通过浏览器菜单操作。'
    } finally {
      // A beforeinstallprompt event can only be prompted once.
      if (installPrompt.value === prompt) installPrompt.value = null
      installing.value = false
    }
  }

  return {
    canInstall,
    installed: readonly(installed),
    installing: readonly(installing),
    installMessage: readonly(installMessage),
    install,
  }
}
