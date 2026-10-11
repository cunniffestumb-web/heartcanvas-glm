<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import ApplicationShell from '@/components/application/ApplicationShell.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <ApplicationShell v-if="route.meta.application">
    <RouterView v-slot="{ Component }">
      <Transition name="app-page" mode="out-in"><component :is="Component" :key="route.path" /></Transition>
    </RouterView>
  </ApplicationShell>
  <div v-else class="app-shell">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
