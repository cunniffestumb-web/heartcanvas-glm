<template>
  <div class="chart-skeleton" aria-label="正在加载图表">
    <span v-for="width in ['84%', '67%', '76%', '52%']" :key="width" :style="{ width }"></span>
  </div>
</template>

<style scoped>
.chart-skeleton { min-height: 330px; display: grid; align-content: center; gap: 18px; padding: 30px; }
.chart-skeleton span { height: 12px; border-radius: 4px; background: var(--surface-muted); animation: skeleton-pulse 1.4s ease-in-out infinite alternate; }
.chart-skeleton span:nth-child(2) { animation-delay: 120ms; }.chart-skeleton span:nth-child(3) { animation-delay: 240ms; }.chart-skeleton span:nth-child(4) { animation-delay: 360ms; }
@keyframes skeleton-pulse { to { opacity: .35; } }
</style>
