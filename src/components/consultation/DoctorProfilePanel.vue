<script setup lang="ts">
import { ref, watch } from 'vue'
import { CheckIcon, PlusIcon, StethoscopeIcon, Volume2Icon, XIcon } from '@lucide/vue'
import type { DoctorProfile, VoicePreference } from '@/types/consultation'

const props = defineProps<{ profiles: DoctorProfile[]; selectedId: string; voices: SpeechSynthesisVoice[] }>()
const emit = defineEmits<{
  select: [id: string]
  save: [profile: Omit<DoctorProfile, 'id' | 'custom'> & { id?: string }]
  close: []
}>()

const editing = ref(false)
const customId = ref<string>()
const name = ref('我的医生')
const title = ref('专属陪伴')
const description = ref('按照我喜欢的方式陪我梳理情绪。')
const instruction = ref('温和、简洁，多倾听，先问清楚我的感受再给建议。')
const voicePreference = ref<VoicePreference>('female')
const voiceURI = ref('')

watch(() => props.selectedId, (id) => {
  const doctor = props.profiles.find((item) => item.id === id)
  if (!doctor?.custom) return
  customId.value = doctor.id
  name.value = doctor.name
  title.value = doctor.title
  description.value = doctor.description
  instruction.value = doctor.instruction
  voicePreference.value = doctor.voicePreference
  voiceURI.value = doctor.voiceURI || ''
})

function save() {
  emit('save', {
    id: customId.value,
    name: name.value,
    title: title.value,
    description: description.value,
    instruction: instruction.value,
    voicePreference: voicePreference.value,
    voiceURI: voiceURI.value || undefined,
  })
  editing.value = false
}
</script>

<template>
  <div class="profile-overlay" role="dialog" aria-modal="true" aria-labelledby="profile-title" @click.self="emit('close')">
    <section class="profile-panel">
      <header><div><span><StethoscopeIcon :size="18" /></span><div><h2 id="profile-title">选择你的支持医生</h2><p>不同人格会改变沟通方式与语音音色，安全边界保持一致。</p></div></div><button type="button" aria-label="关闭医生设置" @click="emit('close')"><XIcon :size="20" /></button></header>
      <div v-if="!editing" class="profile-grid">
        <button v-for="doctor in profiles" :key="doctor.id" class="profile-option" :class="{ selected: doctor.id === selectedId }" type="button" @click="emit('select', doctor.id)">
          <span class="profile-avatar">{{ doctor.name.slice(0, 1) }}</span>
          <span class="profile-copy"><strong>{{ doctor.name }}<small>{{ doctor.title }}</small></strong><em>{{ doctor.description }}</em><i><Volume2Icon :size="13" />{{ doctor.voicePreference === 'female' ? '柔和女声' : doctor.voicePreference === 'male' ? '沉稳男声' : '自然声音' }}</i></span>
          <CheckIcon v-if="doctor.id === selectedId" class="selected-check" :size="18" />
        </button>
        <button class="add-profile" type="button" @click="editing = true"><PlusIcon :size="20" /><span><strong>自定义医生</strong><small>设置名称、性格和专属声音</small></span></button>
      </div>

      <form v-else class="custom-form" @submit.prevent="save">
        <div class="form-row"><label>医生名称<input v-model="name" maxlength="20" required /></label><label>性格标签<input v-model="title" maxlength="20" required /></label></div>
        <label>简介<input v-model="description" maxlength="100" required /></label>
        <label>沟通方式<textarea v-model="instruction" rows="4" maxlength="300" required></textarea></label>
        <div class="form-row"><label>声音类型<select v-model="voicePreference"><option value="female">柔和女声</option><option value="male">沉稳男声</option><option value="neutral">自然声音</option></select></label><label>系统音色<select v-model="voiceURI"><option value="">自动匹配</option><option v-for="voice in voices" :key="voice.voiceURI" :value="voice.voiceURI">{{ voice.name }}</option></select></label></div>
        <div class="form-actions"><button type="button" @click="editing = false">返回</button><button class="save-profile" type="submit"><CheckIcon :size="16" />保存并使用</button></div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.profile-overlay { position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; padding: 24px; background: rgb(23 38 36 / 48%); backdrop-filter: blur(3px); }.profile-panel { width: min(760px, 100%); max-height: min(720px, calc(100vh - 48px)); overflow-y: auto; border-radius: 8px; background: var(--surface); box-shadow: 0 24px 70px rgb(23 38 36 / 25%); }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 22px; border-bottom: 1px solid var(--line); }header > div { display: flex; gap: 12px; }header > div > span { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 7px; color: var(--teal); background: var(--teal-soft); }h2 { margin: 0; font-size: 20px; }header p { margin: 5px 0 0; color: var(--ink-soft); font-size: 11px; }header > button { display: grid; place-items: center; padding: 7px; border: 0; color: var(--ink-soft); background: transparent; cursor: pointer; }
.profile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 18px; }.profile-option, .add-profile { position: relative; min-height: 126px; display: flex; align-items: flex-start; gap: 12px; padding: 15px; border: 1px solid var(--line); border-radius: 7px; text-align: left; color: var(--ink); background: var(--surface); cursor: pointer; }.profile-option:hover, .profile-option.selected { border-color: var(--teal); background: var(--teal-soft); }.profile-avatar { width: 38px; height: 38px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 50%; color: white; background: var(--teal); font-weight: 700; }.profile-copy { min-width: 0; display: grid; gap: 7px; }.profile-copy strong { display: flex; align-items: baseline; gap: 7px; font-size: 13px; }.profile-copy small { color: var(--teal); font-size: 9px; }.profile-copy em { color: var(--ink-soft); font-size: 10px; font-style: normal; line-height: 1.55; }.profile-copy i { display: flex; align-items: center; gap: 5px; color: var(--ink-soft); font-size: 9px; font-style: normal; }.selected-check { position: absolute; top: 12px; right: 12px; color: var(--teal); }.add-profile { align-items: center; justify-content: center; color: var(--teal); border-style: dashed; }.add-profile span { display: grid; gap: 5px; }.add-profile small { color: var(--ink-soft); font-size: 9px; }
.custom-form { display: grid; gap: 14px; padding: 22px; }.custom-form label { display: grid; gap: 6px; color: var(--ink-soft); font-size: 10px; }.form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }input, textarea, select { width: 100%; padding: 10px 11px; border: 1px solid var(--line); border-radius: 6px; color: var(--ink); background: white; }textarea { resize: vertical; line-height: 1.6; }.form-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 4px; }.form-actions button { min-height: 38px; padding: 0 14px; border: 1px solid var(--line); border-radius: 6px; color: var(--ink-soft); background: var(--surface); cursor: pointer; }.form-actions .save-profile { display: flex; align-items: center; gap: 6px; color: white; border-color: var(--teal); background: var(--teal); }
@media (max-width: 620px) { .profile-overlay { padding: 10px; }.profile-panel { max-height: calc(100vh - 20px); }.profile-grid, .form-row { grid-template-columns: 1fr; }header { padding: 17px; }.profile-grid { padding: 12px; }.custom-form { padding: 16px; } }
</style>
