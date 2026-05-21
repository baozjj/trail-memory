<script setup lang="ts">
import { Button } from 'tdesign-mobile-vue'
import AuthField from '@/components/auth/auth-field/index.vue'
import AuthShell from '@/components/auth/auth-shell/index.vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import {
  EMAIL_LABEL,
  EMAIL_PLACEHOLDER,
  LOGIN_HINT,
  LOGIN_LINK,
  PASSWORD_LABEL,
  PASSWORD_PLACEHOLDER,
  REGISTER_TAGLINE,
  REGISTER_TITLE,
  SUBMIT_LABEL,
} from './const'
import { useRegisterPage } from './hooks'

const { email, password, loading, onSubmit, goLogin } = useRegisterPage()
</script>

<template>
  <MobilePage>
    <AuthShell :title="REGISTER_TITLE" :subtitle="REGISTER_TAGLINE">
      <form class="register-form" @submit.prevent="onSubmit">
        <div class="register-form__fields">
          <AuthField
            v-model="email"
            :label="EMAIL_LABEL"
            type="text"
            :placeholder="EMAIL_PLACEHOLDER"
            autocomplete="email"
          />
          <AuthField
            v-model="password"
            :label="PASSWORD_LABEL"
            type="password"
            :placeholder="PASSWORD_PLACEHOLDER"
            autocomplete="new-password"
          />
        </div>

        <Button
          class="register-form__submit"
          theme="primary"
          block
          size="large"
          type="submit"
          :loading="loading"
        >
          {{ SUBMIT_LABEL }}
        </Button>
      </form>

      <template #footer>
        {{ LOGIN_HINT }}
        <button type="button" class="register-form__link" @click="goLogin">
          {{ LOGIN_LINK }}
        </button>
      </template>
    </AuthShell>
  </MobilePage>
</template>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.register-form__fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.register-form__submit {
  --td-button-primary-bg-color: var(--tm-color-cta-primary);
  --td-button-primary-active-bg-color: #1a1a1a;
  --td-button-primary-color: var(--tm-color-cta-on-primary);
  --td-button-large-height: 50px;
  --td-button-border-radius: 12px;
  --td-button-font-weight: 600;
  --td-button-font-size: 17px;
  letter-spacing: -0.01em;
}

.register-form__link {
  margin-left: 6px;
  padding: 0;
  border: none;
  background: none;
  color: var(--tm-auth-link, #0071e3);
  font-size: inherit;
  font-weight: 500;
  letter-spacing: inherit;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.register-form__link:active {
  opacity: 0.65;
}
</style>
