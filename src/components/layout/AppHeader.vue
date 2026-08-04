<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ActivityIcon, MenuIcon, XIcon } from '@lucide/vue'

const route = useRoute()
const menuOpen = ref(false)

const navItems = [
  { to: '/', label: '首页' },
  { to: '/gallery', label: '陈列馆' },
  { to: '/database', label: '数据库' },
  { to: '/cases', label: '案例中心' },
  { to: '/consultation', label: '智能支持' },
  { to: '/technology', label: '技术亮点' },
  { to: '/scenarios', label: '应用场景' },
]

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
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

      <nav id="primary-navigation" class="primary-nav" :class="{ open: menuOpen }" aria-label="主导航">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
