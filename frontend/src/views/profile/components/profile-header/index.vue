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
    <div class="profile-header__signature-wrap">
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
  padding: 32px 0 40px;
}

.profile-header__avatar-btn {
  position: relative;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.profile-header__avatar {
  display: block;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--tm-color-bg-muted);
}

.profile-header__avatar-badge {
  position: absolute;
  left: 50%;
  bottom: 4px;
  transform: translateX(-50%);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.52);
  white-space: nowrap;
}

.profile-header__nickname {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  color: var(--tm-color-text-primary);
}

.profile-header__signature-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  background: var(--tm-color-bg-muted);
}

.profile-header__signature {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.4;
  background: transparent;
  color: var(--tm-color-text-secondary);
  text-align: center;
}

.profile-header__signature::placeholder {
  color: var(--tm-color-text-placeholder);
}
</style>
