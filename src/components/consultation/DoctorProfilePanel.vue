<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon, PencilIcon, PlusIcon, Volume2Icon } from '@lucide/vue'
import OverlayPanel from '@/components/common/OverlayPanel.vue'
import type { DoctorProfile, VoicePreference } from '@/types/consultation'
const props = defineProps<{
  profiles: DoctorProfile[]
  selectedId: string
  voices: SpeechSynthesisVoice[]
}>()
const emit = defineEmits<{
  select: [id: string]
  save: [profile: Omit<DoctorProfile, 'id' | 'custom'> & { id?: string }]
  close: []
}>()
const editing = ref(false)
const customId = ref<string>()
const name = ref('我的陪伴')
const title = ref('专属陪伴')
const description = ref('按照我喜欢的方式陪我梳理情绪。')
const instruction = ref('温和、简洁，多倾听，先问清楚我的感受再给建议。')
const voicePreference = ref<VoicePreference>('female')
const voiceURI = ref('')
const examples: Record<string, string> = {
  warm: '“不用急着解决，我们先听听你的感受。”',
  rational: '“我们可以先把事实、想法和感受分开看看。”',
  coach: '“你已经做了不少，接下来试一个小步骤。”',
  steady: '“我在听，你可以按自己的节奏说。”',
}
function beginEdit(profile?: DoctorProfile) {
  customId.value = profile?.id
  name.value = profile?.name || '我的陪伴'
  title.value = profile?.title || '专属陪伴'
  description.value = profile?.description || '按照我喜欢的方式陪我梳理情绪。'
  instruction.value = profile?.instruction || '温和、简洁，多倾听，先问清楚我的感受再给建议。'
  voicePreference.value = profile?.voicePreference || 'female'
  voiceURI.value = profile?.voiceURI || ''
  editing.value = true
}
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
}
</script>
<template>
  <OverlayPanel title="选择陪伴风格" @close="emit('close')"
    ><p class="profile-intro">选择让你自在的沟通方式。每一种风格都遵循相同的心理支持与安全边界。</p>
    <div v-if="!editing" class="profile-grid">
      <article
        v-for="doctor in profiles"
        :key="doctor.id"
        class="profile-card"
        :data-style="doctor.id"
        :class="{ selected: doctor.id === selectedId }"
      >
        <button class="profile-option" type="button" @click="emit('select', doctor.id)">
          <span class="profile-avatar">{{ doctor.name.slice(0, 1) }}</span
          ><span class="profile-copy"
            ><strong>{{ doctor.title }}</strong
            ><small>{{ doctor.name }}</small></span
          ><CheckIcon v-if="doctor.id === selectedId" :size="19" class="selected-check" />
          <p>{{ doctor.description }}</p>
          <blockquote>{{ examples[doctor.id] || '“我们按你喜欢的方式，慢慢展开。”' }}</blockquote>
          <span class="voice-label"
            ><Volume2Icon :size="15" />{{
              doctor.voicePreference === 'female'
                ? '柔和女声'
                : doctor.voicePreference === 'male'
                  ? '沉稳男声'
                  : '自然声音'
            }}</span
          ></button
        ><button
          v-if="doctor.custom"
          class="edit-custom"
          type="button"
          aria-label="编辑自定义风格"
          @click="beginEdit(doctor)"
        >
          <PencilIcon :size="16" />编辑
        </button>
      </article>
      <button class="add-profile" type="button" @click="beginEdit()">
        <PlusIcon :size="22" /><span>自定义陪伴风格<small>名称、沟通方式与声音</small></span>
      </button>
    </div>
    <form v-else class="custom-form" @submit.prevent="save">
      <div class="form-row">
        <label>显示名称<input v-model="name" maxlength="20" required /></label
        ><label>风格标签<input v-model="title" maxlength="20" required /></label>
      </div>
      <label>简介<input v-model="description" maxlength="100" required /></label
      ><label>沟通方式<textarea v-model="instruction" rows="3" maxlength="300" required /></label>
      <div class="form-row">
        <label
          >声音类型<select v-model="voicePreference">
            <option value="female">柔和女声</option>
            <option value="male">沉稳男声</option>
            <option value="neutral">自然声音</option>
          </select></label
        ><label
          >系统音色<select v-model="voiceURI">
            <option value="">自动匹配</option>
            <option v-for="voice in voices" :key="voice.voiceURI" :value="voice.voiceURI">
              {{ voice.name }}
            </option>
          </select></label
        >
      </div>
      <div class="form-actions">
        <button class="button" type="button" @click="editing = false">返回</button
        ><button class="button primary" type="submit"><CheckIcon :size="17" />保存并使用</button>
      </div>
    </form></OverlayPanel
  >
</template>
<style scoped>
.profile-intro {
  margin: 0 0 22px;
  color: var(--ink-soft);
  font-size: 14px;
}
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.profile-card {
  position: relative;
  --style-color: var(--teal);
  --style-bg: var(--teal-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
}
.profile-card[data-style='rational'] {
  --style-color: #4d7592;
  --style-bg: #e7eff5;
}
.profile-card[data-style='coach'] {
  --style-color: #b97161;
  --style-bg: #f9eae3;
}
.profile-card[data-style='steady'] {
  --style-color: #927236;
  --style-bg: #f4efde;
}
.profile-card.selected {
  border-color: var(--style-color);
  background: var(--style-bg);
}
.profile-option {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  width: 100%;
  min-height: 220px;
  padding: 18px;
  border: 0;
  background: transparent;
  text-align: left;
}
.profile-avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: white;
  background: var(--style-color);
  font-size: 18px;
}
.profile-copy {
  display: grid;
  gap: 3px;
  align-content: center;
}
.profile-copy strong {
  font-size: 16px;
}
.profile-copy small {
  color: var(--ink-soft);
  font-size: 12px;
}
.selected-check {
  position: absolute;
  top: 18px;
  right: 14px;
  color: var(--style-color);
}
.profile-option p,
blockquote,
.voice-label {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
}
.profile-option p {
  color: var(--ink-soft);
}
blockquote {
  color: var(--style-color);
}
.voice-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 12px;
}
.add-profile {
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  grid-column: 1 / -1;
  padding: 16px;
  border: 1px dashed #afc6b8;
  border-radius: 14px;
  color: var(--teal);
  background: #f4f7ef;
}
.add-profile span {
  display: grid;
  gap: 4px;
  font-size: 14px;
}
.add-profile small {
  color: var(--ink-soft);
  font-size: 12px;
}
.edit-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  min-height: 44px;
  border: 0;
  border-top: 1px solid var(--line);
  border-radius: 0 0 14px 14px;
  background: transparent;
  font-size: 12px;
}
.custom-form {
  display: grid;
  gap: 18px;
}
.custom-form label {
  display: grid;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 14px;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
input,
textarea,
select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  background: white;
  font-size: 16px;
}
textarea {
  resize: vertical;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
@media (max-width: 600px) {
  .profile-grid,
  .form-row {
    grid-template-columns: 1fr;
  }
  .profile-option {
    min-height: auto;
    gap: 10px;
  }
}
</style>
