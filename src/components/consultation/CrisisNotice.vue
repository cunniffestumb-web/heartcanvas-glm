<script setup lang="ts">
import { ShieldAlertIcon } from '@lucide/vue'
</script>

<template>
  <aside class="crisis-notice" role="alert">
    <ShieldAlertIcon :size="22" />
    <div>
      <strong>请优先确认你此刻的安全</strong>
      <p>
        如果你可能马上伤害自己或别人，请立即联系当地急救电话、附近医院急诊，或让身边可信赖的人陪在你身边。这个平台不能替代紧急救助。
      </p>
    </div>
  </aside>
</template>

<style scoped>
.crisis-notice {
  display: flex;
  gap: 12px;
  padding: 15px;
  border: 1px solid #e5aaa4;
  border-left: 4px solid var(--danger);
  border-radius: 6px;
  color: #742d2d;
  background: var(--danger-soft);
}
svg {
  flex: 0 0 auto;
}
.crisis-notice strong {
  font-size: 13px;
}
.crisis-notice p {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.7;
}
</style>
