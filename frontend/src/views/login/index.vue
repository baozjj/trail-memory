<script setup lang="ts">
import { Button } from 'tdesign-mobile-vue'
import AuthField from '@/components/auth/auth-field/index.vue'
import AuthShell from '@/components/auth/auth-shell/index.vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import {
  BRAND_TITLE,
  EMAIL_LABEL,
  EMAIL_PLACEHOLDER,
  LOGIN_TAGLINE,
  PASSWORD_LABEL,
  PASSWORD_PLACEHOLDER,
  REGISTER_HINT,
  REGISTER_LINK,
  SUBMIT_LABEL,
} from './const'
import { useLoginPage } from './hooks'

const { email, password, loading, onSubmit, goRegister } = useLoginPage()
</script>

<template>
  <MobilePage>
    <AuthShell :title="BRAND_TITLE" :subtitle="LOGIN_TAGLINE">
      <form class="login-form" @submit.prevent="onSubmit">
        <div class="login-form__fields">
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
            autocomplete="current-password"
          />
        </div>

        <Button
          class="login-form__submit"
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
        {{ REGISTER_HINT }}
        <button type="button" class="login-form__link" @click="goRegister">
          {{ REGISTER_LINK }}
        </button>
      </template>
    </AuthShell>
  </MobilePage>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.login-form__fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form__submit {
  --td-button-primary-bg-color: var(--tm-color-cta-primary);
  --td-button-primary-active-bg-color: #1a1a1a;
  --td-button-primary-color: var(--tm-color-cta-on-primary);
  --td-button-large-height: 50px;
  --td-button-border-radius: 12px;
  --td-button-font-weight: 600;
  --td-button-font-size: 17px;
  letter-spacing: -0.01em;
}

.login-form__link {
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

.login-form__link:active {
  opacity: 0.65;
}
</style>
