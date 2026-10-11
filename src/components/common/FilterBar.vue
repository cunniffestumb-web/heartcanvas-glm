<script setup lang="ts">
import type { GalleryFilters } from '@/types/statistics'

defineProps<{ filters: GalleryFilters; regions: string[] }>()
const emit = defineEmits<{
  change: [key: keyof GalleryFilters, value: GalleryFilters[keyof GalleryFilters]]
}>()

function valueOf(event: Event) {
  return (event.target as HTMLSelectElement).value
}
</script>

<template>
  <div class="filter-bar" aria-label="数据筛选条件">
    <label>
      <span>年份</span>
      <select :value="filters.year" @change="emit('change', 'year', Number(valueOf($event)))">
        <option v-for="year in [2020, 2021, 2022, 2023, 2024, 2025]" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </label>
    <label>
      <span>地区</span>
      <select :value="filters.region" @change="emit('change', 'region', valueOf($event))">
        <option value="全国">全国</option>
        <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
      </select>
    </label>
    <label>
      <span>人群</span>
      <select :value="filters.population" @change="emit('change', 'population', valueOf($event))">
        <option
          v-for="group in ['青少年', '大学生', '职场人', '老年群体']"
          :key="group"
          :value="group"
        >
          {{ group }}
        </option>
      </select>
    </label>
    <label>
      <span>情绪类型</span>
      <select :value="filters.emotionType" @change="emit('change', 'emotionType', valueOf($event))">
        <option
          v-for="emotion in ['焦虑', '抑郁', '压力', '孤独', '睡眠困扰']"
          :key="emotion"
          :value="emotion"
        >
          {{ emotion }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.filter-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}
label {
  display: grid;
  gap: 6px;
}
label span {
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 700;
}
select {
  width: 100%;
  min-height: 44px;
  padding: 0 34px 0 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  background: #fff;
}
select:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}
@media (max-width: 720px) {
  .filter-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
