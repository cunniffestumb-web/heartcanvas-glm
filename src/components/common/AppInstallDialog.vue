<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpRightIcon, CheckIcon, DownloadIcon, MonitorIcon, SmartphoneIcon } from '@lucide/vue'
import OverlayPanel from './OverlayPanel.vue'
import { useAppInstall } from '@/composables/useAppInstall'

const emit = defineEmits<{ close: [] }>()
const route = useRoute()
const { canInstall, installed, installing, installMessage, install } = useAppInstall()
const isAppRoute = computed(() => route.path === '/app' || route.path.startsWith('/app/'))
const device = ref<'mobile' | 'desktop'>(typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? 'desktop' : 'mobile')

function selectDevice(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  device.value = event.key === 'Home' ? 'mobile' : event.key === 'End' ? 'desktop' : device.value === 'mobile' ? 'desktop' : 'mobile'
  document.getElementById(`install-${device.value}-tab`)?.focus()
}
</script>

<template>
  <OverlayPanel title="让心绘陪在身边" @close="emit('close')">
    <div class="install-intro">
      <img src="/icons/xinhui.svg" alt="" width="66" height="66" />
      <div>
        <h3>给心情，留一个小小的入口</h3>
        <p>把心绘网页版添加到桌面或手机主屏幕，下次轻轻一点，就能回来。</p>
      </div>
    </div>

    <div class="install-action">
      <div v-if="installed" class="installed-state"><CheckIcon :size="18" /> 你正在使用已添加的心绘</div>
      <RouterLink v-else-if="!isAppRoute" class="install-primary" to="/app" @click="emit('close')">
        进入心绘，添加到桌面 <ArrowUpRightIcon :size="17" />
      </RouterLink>
      <button v-else-if="canInstall" class="install-primary" type="button" :disabled="installing" @click="install">
        <DownloadIcon :size="17" /> {{ installing ? '正在打开添加窗口…' : '添加心绘到桌面 / 主屏幕' }}
      </button>
      <p v-else class="install-manual">打开浏览器菜单，按下面的步骤添加心绘。</p>
      <p v-if="installMessage" class="install-status" role="status">{{ installMessage }}</p>
      <p v-if="!isAppRoute" class="install-hint">请在心绘工作台中添加，让每次打开都直接回到自己的空间。</p>
    </div>

    <div class="install-tabs" role="tablist" aria-label="选择设备" @keydown="selectDevice">
      <button id="install-mobile-tab" type="button" role="tab" :aria-selected="device === 'mobile'" :tabindex="device === 'mobile' ? 0 : -1" aria-controls="install-device-panel" @click="device = 'mobile'">
        <SmartphoneIcon :size="17" /> 手机
      </button>
      <button id="install-desktop-tab" type="button" role="tab" :aria-selected="device === 'desktop'" :tabindex="device === 'desktop' ? 0 : -1" aria-controls="install-device-panel" @click="device = 'desktop'">
        <MonitorIcon :size="17" /> 电脑
      </button>
    </div>

    <div id="install-device-panel" class="install-guide" role="tabpanel" :aria-labelledby="device === 'mobile' ? 'install-mobile-tab' : 'install-desktop-tab'">
      <template v-if="device === 'mobile'">
        <section>
          <h4>iPhone / iPad</h4>
          <ol>
            <li>用 Safari 打开心绘工作台。</li>
            <li>轻点浏览器的「分享」按钮。</li>
            <li>选择「添加到主屏幕」，再轻点「添加」。</li>
          </ol>
        </section>
        <section>
          <h4>Android 手机</h4>
          <p>用 Chrome 或支持安装的浏览器打开工作台，在菜单中选择「安装应用」或「添加到主屏幕」。具体名称以浏览器显示为准。</p>
        </section>
      </template>
      <section v-else>
        <h4>Windows / macOS</h4>
        <p>用 Chrome 或 Edge 打开心绘工作台，轻点地址栏中的安装图标，或在浏览器菜单中选择「安装心绘」。macOS Safari 支持时，也可以在菜单中选择「添加到程序坞」。</p>
      </section>
      <p class="install-small">如果在微信等应用内打开，先选择「在浏览器中打开」。安装选项取决于浏览器与设备；没有该选项时，仍可直接使用网页版。</p>
    </div>

    <div class="install-package-note">
      <span>关于软件下载</span>
      <p>Windows、macOS、Android 和 iOS 原生安装包尚未发布。目前可使用网页版，或通过浏览器添加到桌面 / 主屏幕。离线时仅提供重新连接提示，记录与对话需要网络。</p>
    </div>
  </OverlayPanel>
</template>

<style scoped>
.install-intro { display: flex; align-items: center; gap: 16px; }
.install-intro img { flex-shrink: 0; border-radius: 20px; }
.install-intro h3 { margin: 0 0 5px; font-size: 17px; font-weight: 650; }
.install-intro p, .install-guide p, .install-package-note p { margin: 0; color: var(--ink-soft); font-size: 13px; line-height: 1.8; }
.install-action { margin: 23px 0; }
.install-primary { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; min-height: 48px; padding: 12px 16px; border: 0; border-radius: 14px; color: white; background: var(--teal); font-size: 14px; font-weight: 600; transition: background 160ms, transform 160ms; }
.install-primary:hover { background: var(--teal-dark); transform: translateY(-1px); }
.install-primary:disabled { opacity: .65; transform: none; }
.installed-state { display: flex; align-items: center; gap: 8px; padding: 13px 16px; border-radius: 14px; background: var(--teal-soft); color: var(--teal-dark); font-size: 14px; }
.install-hint, .install-status, .install-manual { margin: 10px 0 0; color: var(--ink-soft); font-size: 12px; }
.install-status { color: var(--teal-dark); }
.install-manual { padding: 14px 16px; border-radius: 12px; background: var(--surface-muted); font-size: 13px; }
.install-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 5px; border-radius: 14px; background: var(--surface-muted); }
.install-tabs button { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; border: 0; border-radius: 10px; color: var(--ink-soft); background: transparent; font-size: 13px; }
.install-tabs button[aria-selected='true'] { color: var(--ink); background: var(--surface); box-shadow: var(--shadow-sm); }
.install-guide { padding: 18px 2px 20px; }
.install-guide section + section { margin-top: 18px; }
.install-guide h4 { margin: 0 0 8px; font-size: 14px; }
.install-guide ol { display: grid; gap: 5px; margin: 0; padding-left: 22px; color: var(--ink-soft); font-size: 13px; }
.install-guide .install-small { margin-top: 16px; font-size: 12px; }
.install-package-note { padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg); }
.install-package-note span { display: block; margin-bottom: 5px; font-size: 12px; font-weight: 600; }
.install-package-note p { font-size: 12px; }
@media (max-width: 420px) { .install-intro { gap: 12px; align-items: flex-start; } .install-intro img { width: 52px; height: 52px; } .install-intro h3 { font-size: 15px; } }
@media (prefers-reduced-motion: reduce) { .install-primary { transition: none; } }
</style>
