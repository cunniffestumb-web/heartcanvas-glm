<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ActivityIcon, ArrowUpRightIcon, DownloadIcon, MenuIcon, XIcon } from '@lucide/vue'
import AppInstallDialog from '@/components/common/AppInstallDialog.vue'

const route = useRoute()
const menuOpen = ref(false)
const showInstall = ref(false)

const navItems = [
  { to: '/', label: '首页' },
  { to: '/gallery', label: '陈列馆' },
  { to: '/database', label: '数据库' },
  { to: '/cases', label: '案例中心' },
  { to: '/technology', label: '技术亮点' },
  { to: '/scenarios', label: '应用场景' },
]

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="心绘 GLM 首页">
        <span class="brand-mark"><ActivityIcon :size="20" aria-hidden="true" /></span>
        <span><strong>心绘 GLM</strong><small>心理数据与智能支持</small></span>
      </RouterLink>

      <button
        class="icon-button nav-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-navigation"
        :aria-label="menuOpen ? '关闭导航' : '打开导航'"
        @click="menuOpen = !menuOpen"
      >
        <XIcon v-if="menuOpen" :size="20" aria-hidden="true" />
        <MenuIcon v-else :size="20" aria-hidden="true" />
      </button>

      <nav
        id="primary-navigation"
        class="primary-nav"
        :class="{ open: menuOpen }"
        aria-label="主导航"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="{ active: item.to === '/cases' && route.path.startsWith('/cases/') }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="header-app-actions"><button type="button" class="header-download" @click="showInstall = true"><DownloadIcon :size="16"/><span>下载 / 安装</span></button><RouterLink to="/app" class="header-open-app">进入心绘<ArrowUpRightIcon :size="16"/></RouterLink></div>
    </div>
  </header>
  <AppInstallDialog v-if="showInstall" @close="showInstall = false"/>
</template>
<style scoped>
.header-inner{gap:16px;width:min(calc(100% - 48px),1380px)}.primary-nav{margin-left:auto}.primary-nav a{padding-inline:10px;font-size:13px}.header-app-actions{display:flex;align-items:center;gap:10px;padding-left:14px;border-left:1px solid var(--line);flex-shrink:0}.header-download,.header-open-app{display:flex;align-items:center;justify-content:center;gap:7px;min-height:40px;border-radius:9px;font-size:12px}.header-download{padding:8px 9px;border:0;color:var(--ink-soft);background:transparent}.header-open-app{padding:8px 14px;background:var(--teal);color:white}.header-open-app:hover{background:var(--teal-dark)}@media(max-width:1150px) and (min-width:1024px){.header-inner{gap:8px;width:calc(100% - 32px)}.primary-nav a{padding-inline:7px;font-size:12px}.header-app-actions{gap:5px;padding-left:9px}.brand small{display:none}.brand strong{font-size:16px}.header-download span{display:none}}@media(max-width:1023px){.primary-nav{margin:0}.nav-toggle{order:3}.header-app-actions{margin-left:auto;border:0;padding:0}.header-inner{width:calc(100% - 32px);gap:10px}}@media(max-width:600px){.brand small{display:none}.brand strong{font-size:16px}.brand-mark{width:34px;height:34px;border-radius:11px}.brand{gap:7px}.header-app-actions{gap:2px}.header-download{width:34px;padding:0}.header-download span{display:none}.header-open-app{font-size:11px;padding:8px 10px;min-height:38px}.header-open-app svg{display:none}.nav-toggle{width:38px;height:38px}.header-inner{gap:7px}}
</style>
