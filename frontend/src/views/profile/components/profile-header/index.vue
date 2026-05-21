<script setup lang="ts">
import { SIGNATURE_PLACEHOLDER } from '../../const'
import type { ProfileHeaderEmits, ProfileHeaderProps } from './types'

defineProps<ProfileHeaderProps>()
const emit = defineEmits<ProfileHeaderEmits>()

function onSignatureInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:signature', target.value)
}

function onEditAvatar() {
  emit('edit-avatar')
}
</script>

<template>
  <header class="profile-header">
    <button type="button" class="profile-header__avatar-btn" @click="onEditAvatar">
      <img class="profile-header__avatar" :src="avatarDisplayUrl" :alt="nickname" />
      <span class="profile-header__avatar-badge">更换头像</span>
    </button>
    <h1 class="profile-header__nickname">{{ nickname }}</h1>
    <div class="profile-header__signature-wrap tm-surface-field">
      <input
        class="profile-header__signature"
        type="text"
        :value="signature"
        :placeholder="SIGNATURE_PLACEHOLDER"
        maxlength="40"
        @input="onSignatureInput"
      />
    </div>
  </header>
</template>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 28px 0 36px;
}

.profile-header__avatar-btn {
  position: relative;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.profile-header__avatar-btn:active {
  opacity: 0.88;
}

.profile-header__avatar {
  display: block;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--tm-color-bg-surface);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.profile-header__avatar-badge {
  position: absolute;
  left: 50%;
  bottom: 4px;
  transform: translateX(-50%);
  padding: 3px 10px;
  border-radius: var(--tm-radius-sm);
  font-size: var(--tm-font-size-caption);
  font-weight: 500;
  color: var(--tm-color-text-on-inverse);
  background: rgba(29, 29, 31, 0.62);
  backdrop-filter: blur(8px);
  white-space: nowrap;
}

.profile-header__nickname {
  margin: 0;
  font-size: var(--tm-font-size-title-sm);
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-tight);
  line-height: 1.2;
  text-align: center;
  color: var(--tm-color-text-primary);
}

.profile-header__signature-wrap {
  width: 100%;
  justify-content: center;
}

.profile-header__signature {
  width: 100%;
  border: none;
  outline: none;
  font-size: var(--tm-font-size-subhead);
  line-height: 1.4;
  background: transparent;
  color: var(--tm-color-text-secondary);
  text-align: center;
}

.profile-header__signature::placeholder {
  color: var(--tm-color-text-placeholder);
}
</style>
