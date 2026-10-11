<script setup lang="ts">
withDefaults(defineProps<{ small?: boolean }>(), { small: false })
</script>
<template>
  <div class="soft-orb" :class="{ small }" aria-hidden="true">
    <div class="orb-aura"></div><div class="orb-halo"></div>
    <div class="orb-core"><span class="orb-ribbon"></span><span class="orb-smile"><i></i><i></i><b></b></span></div>
    <span class="orb-spark spark-one">✧</span><span class="orb-spark spark-two">✦</span><span class="orb-dot"></span>
  </div>
</template>
<style scoped>
.soft-orb { position: relative; width: 260px; height: 260px; flex-shrink: 0; }
.orb-aura { position: absolute; inset: 7%; border-radius: 50%; background: conic-gradient(from 60deg, #f7c5ac99, #f2dda199, #b7e0d199, #d7d0f299, #f7c5ac99); filter: blur(22px); animation: orb-aura-turn 18s linear infinite; }
.orb-halo { position: absolute; inset: 4%; border: 1px solid #ffffffb0; border-radius: 50%; transform: rotate(-24deg) scaleX(1.16); animation: orb-halo-drift 10s ease-in-out infinite; }
.orb-core { position: absolute; inset: 19%; overflow: hidden; border-radius: 44% 56% 53% 47% / 51% 42% 58% 49%; background: radial-gradient(circle at 28% 22%, #fffff7 0%, #f8e1bd 23%, #b9dace 55%, #b4c9e6 80%, #d1b9dc 100%); box-shadow: inset -10px -12px 24px #73998b20, inset 8px 12px 24px #ffffffaa, 0 20px 35px #ac9d7d24; animation: orb-float 6s ease-in-out infinite; }
.orb-ribbon { position: absolute; inset: -15%; border-radius: 50%; background: conic-gradient(from 90deg, transparent, #ffffff8c 12%, transparent 25%, #e2c3e583 43%, transparent 58%, #ffffff93 73%, transparent); filter: blur(8px); animation: orb-aura-turn 14s linear infinite reverse; }
.orb-smile { position: absolute; left: 37%; top: 44%; width: 28%; height: 28%; opacity: .72; }
.orb-smile i { position: absolute; width: 5px; height: 6px; top: 0; border-radius: 50%; background: #426f63; animation: orb-blink 8s infinite; }
.orb-smile i:first-child { left: 4px; }
.orb-smile i:nth-child(2) { right: 4px; }
.orb-smile b { position: absolute; left: 27%; top: 12px; width: 46%; height: 12px; border: 2px solid #426f63; border-top: 0; border-radius: 0 0 20px 20px; }
.orb-spark { position: absolute; color: #b38d62; animation: orb-sparkle 4s ease-in-out infinite; }
.spark-one { top: 5%; right: 9%; font-size: 32px; }
.spark-two { bottom: 12%; left: 6%; font-size: 20px; color: #6f9b8b; animation-delay: -2s; }
.orb-dot { position: absolute; width: 8px; height: 8px; right: 5%; bottom: 23%; border-radius: 50%; background: #d8aa8d; }
.small { width: 52px; height: 52px; }
.small .orb-halo, .small .orb-spark, .small .orb-dot { display: none; }
.small .orb-aura { filter: blur(7px); }
.small .orb-core { inset: 9%; border-radius: 50%; animation: none; }
.small .orb-smile { left: 32%; width: 36%; top: 38%; }
.small .orb-smile i { width: 2px; height: 3px; }
.small .orb-smile b { height: 4px; top: 6px; border-width: 1px; }
@keyframes orb-float { 0%, 100% { transform: translateY(9px) rotate(-7deg) scale(.96); } 50% { transform: translateY(-18px) rotate(9deg) scale(1.06); border-radius: 54% 46% 44% 56% / 42% 55% 45% 58%; } }
@keyframes orb-aura-turn { to { transform: rotate(360deg); } }
@keyframes orb-halo-drift { 50% { transform: rotate(12deg) scaleX(1.04) scaleY(1.08); } }
@keyframes orb-sparkle { 50% { transform: translateY(-9px) rotate(25deg) scale(1.22); opacity: .55; } }
@keyframes orb-blink { 0%, 43%, 47%, 100% { transform: scaleY(1); } 45% { transform: scaleY(.12); } }
@media (prefers-reduced-motion: reduce) { .soft-orb *, .soft-orb { animation: none !important; } }
</style>
