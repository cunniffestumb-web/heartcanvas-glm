<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpRightIcon, DownloadIcon, HeartIcon, HouseIcon, MessageCircleIcon, SproutIcon, UserRoundIcon } from '@lucide/vue'
import SoftOrb from './SoftOrb.vue'
import AppInstallDialog from '@/components/common/AppInstallDialog.vue'
import { useWellbeingStore } from '@/stores/wellbeing'
import '@/styles/application.css'

const route = useRoute()
const wellbeing = useWellbeingStore()
const showInstall = ref(false)
watchEffect(() => {
  document.documentElement.dataset.xinhuiApp = 'true'
  document.documentElement.dataset.xinhuiQuiet = String(wellbeing.quietMotion)
})
onBeforeUnmount(() => {
  delete document.documentElement.dataset.xinhuiApp
  delete document.documentElement.dataset.xinhuiQuiet
})
const items = [
  { to: '/app', label: '今天', icon: HouseIcon },
  { to: '/app/chat', label: '陪伴', icon: MessageCircleIcon },
  { to: '/app/mood', label: '心情', icon: HeartIcon },
  { to: '/app/me', label: '我的', icon: UserRoundIcon },
]
const sectionPath = computed(() => route.meta.section || route.path)
const current = computed(() => items.find(item => item.to === sectionPath.value) || items[0]!)
const pageLabel = computed(() => route.meta.title || current.value.label)
const date = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
</script>

<template>
  <div class="application" :class="{ 'quiet-motion': wellbeing.quietMotion, 'is-chat': route.path === '/app/chat' }">
    <div class="app-aurora" aria-hidden="true"><i></i><i></i><i></i></div>
    <aside class="application-sidebar">
      <RouterLink class="app-brand" to="/app" aria-label="心绘应用首页">
        <SoftOrb small /><div><strong>心绘<span>·</span></strong><small>给心一个柔软的地方</small></div>
      </RouterLink>
      <p class="sidebar-label">你的日常陪伴</p>
      <nav aria-label="应用侧栏导航">
        <RouterLink v-for="item in items" :key="item.to" :to="item.to" :class="{ selected: sectionPath === item.to }">
          <component :is="item.icon" :size="22" :stroke-width="1.7" /><span>{{ item.label }}</span>
          <i v-if="sectionPath === item.to" aria-hidden="true"></i>
        </RouterLink>
      </nav>
      <div class="sidebar-note"><SproutIcon :size="28" :stroke-width="1.4" /><p>每一种心情，<br />都可以在这里停一停。</p><span>慢一点，也没关系。</span></div>
      <div class="sidebar-bottom">
        <button @click="showInstall = true"><DownloadIcon :size="19" />把心绘放在身边</button>
        <RouterLink to="/"><ArrowUpRightIcon :size="19" />了解心绘官网</RouterLink>
        <RouterLink to="/app/me" class="sidebar-person"><span>{{ wellbeing.nickname.slice(0, 1) || '你' }}</span><div><strong>{{ wellbeing.nickname || '亲爱的你' }}</strong><small>自在使用，无需登录</small></div></RouterLink>
      </div>
    </aside>
    <div class="application-body">
      <header class="application-topbar">
        <div class="app-breadcrumb"><span class="desktop-brand">我的空间</span><span class="mobile-brand">心绘<span>·</span></span><i>/</i><strong>{{ pageLabel }}</strong></div>
        <span class="application-date">{{ date }}</span>
        <button class="app-install-button" aria-label="安装心绘应用" @click="showInstall = true"><DownloadIcon :size="20" /><span>安装应用</span></button>
      </header>
      <main id="application-main" class="application-main"><slot /></main>
    </div>
    <nav class="application-tabbar" aria-label="应用底部导航">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to" :class="{ selected: sectionPath === item.to }"><span><component :is="item.icon" :size="23" :stroke-width="1.8" /></span><small>{{ item.label }}</small></RouterLink>
    </nav>
    <AppInstallDialog v-if="showInstall" @close="showInstall = false" />
  </div>
</template>
