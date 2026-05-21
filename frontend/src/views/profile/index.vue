<script setup lang="ts">
import MobilePage from '@/components/layout/mobile-page/index.vue'
import FloatingTabBar from '@/components/layout/floating-tab-bar/index.vue'
import ProfileHeader from './components/profile-header/index.vue'
import ProfileStats from './components/profile-stats/index.vue'
import AuthorCard from '@/components/article/author-card/index.vue'
import ProfileSettingsRow from './components/profile-settings-row/index.vue'
import { useProfilePage } from './hooks'
import { CARD_PREVIEW_LABEL, LOGOUT_LABEL, SHOW_CARD_LABEL } from './const'

const {
  nickname,
  signature,
  avatarDisplayUrl,
  sealedCount,
  showCard,
  cardPreviewAuthor,
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
        <div v-if="showCard" class="profile__card-preview">
          <p class="profile__card-preview-label">{{ CARD_PREVIEW_LABEL }}</p>
          <AuthorCard :author="cardPreviewAuthor" />
        </div>
      </section>

      <div class="profile__spacer" aria-hidden="true" />

      <button type="button" class="profile__logout" @click="onLogout">
        {{ LOGOUT_LABEL }}
      </button>
    </div>

    <FloatingTabBar active-tab="user" @change="onTabChange" />
  </MobilePage>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 88px - env(safe-area-inset-bottom, 0px));
  padding: 8px var(--tm-spacing-page-x) 0;
}

.profile__settings {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--tm-color-border-subtle);
}

.profile__card-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 2px 12px;
}

.profile__card-preview-label {
  margin: 0;
  font-size: var(--tm-font-size-footnote);
  color: var(--tm-color-text-tertiary);
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
  font-size: var(--tm-font-size-subhead);
  color: var(--tm-color-text-tertiary);
  cursor: pointer;
  transition: opacity var(--tm-duration-fast) ease;
}

.profile__logout:active {
  opacity: 0.65;
}
</style>
