<script setup lang="ts">
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import ProfileHeader from './components/profile-header/index.vue'
import ProfileStats from './components/profile-stats/index.vue'
import ProfileSettingsRow from './components/profile-settings-row/index.vue'
import { useProfilePage } from './hooks'
import { LOGOUT_LABEL, SHOW_CARD_LABEL } from './const'

const {
  nickname,
  signature,
  avatarDisplayUrl,
  sealedCount,
  showCard,
  onSignatureUpdate,
  onEditAvatar,
  onTabChange,
  onLogout,
} = useProfilePage()
</script>

<template>
  <MobilePage with-tab-bar>
    <div class="profile">
      <ProfileHeader
        :avatar-display-url="avatarDisplayUrl"
        :nickname="nickname"
        :signature="signature"
        @update:signature="onSignatureUpdate"
        @edit-avatar="onEditAvatar"
      />

      <ProfileStats :count="sealedCount" />

      <section class="profile__settings">
        <ProfileSettingsRow v-model="showCard" :label="SHOW_CARD_LABEL" />
      </section>

      <div class="profile__spacer" aria-hidden="true" />

      <button type="button" class="profile__logout" @click="onLogout">
        {{ LOGOUT_LABEL }}
      </button>
    </div>

    <FloatingTabBar active="user" @change="onTabChange" />
  </MobilePage>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 88px - env(safe-area-inset-bottom, 0px));
  padding: 8px 24px 0;
}

.profile__settings {
  padding-top: 8px;
}

.profile__spacer {
  flex: 1;
  min-height: 24px;
}

.profile__logout {
  width: 100%;
  height: 48px;
  margin: 0 0 calc(8px + env(safe-area-inset-bottom, 0px));
  padding: 0;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--tm-color-text-meta);
  cursor: pointer;
}

.profile__logout:active {
  opacity: 0.7;
}
</style>
