<script setup lang="ts">
import { Button, Input } from 'tdesign-mobile-vue'
import MobilePage from '@/components/layout/mobile-page/index.vue'
import { EMAIL_LABEL, LOGIN_HINT, LOGIN_LINK, PASSWORD_LABEL, SUBMIT_LABEL } from './const'
import { useRegisterPage } from './hooks'

const { email, password, loading, onSubmit, goLogin } = useRegisterPage()
</script>

<template>
  <MobilePage>
    <div class="auth">
      <h1 class="auth__title">注册</h1>

      <form class="auth__form" @submit.prevent="onSubmit">
        <label class="auth__field">
          <span class="auth__label">{{ EMAIL_LABEL }}</span>
          <Input
            v-model="email"
            type="text"
            placeholder="name@example.com"
            autocomplete="email"
            clearable
          />
        </label>

        <label class="auth__field">
          <span class="auth__label">{{ PASSWORD_LABEL }}</span>
          <Input
            v-model="password"
            type="password"
            placeholder="至少 6 位"
            autocomplete="new-password"
            clearable
          />
        </label>

        <Button
          class="auth__submit"
          theme="primary"
          block
          size="large"
          type="submit"
          :loading="loading"
        >
          {{ SUBMIT_LABEL }}
        </Button>
      </form>

      <p class="auth__footer">
        {{ LOGIN_HINT }}
        <button type="button" class="auth__link" @click="goLogin">{{ LOGIN_LINK }}</button>
      </p>
    </div>
  </MobilePage>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: 48px 24px 24px;
}

.auth__title {
  margin: 0 0 40px;
  font-size: 28px;
  font-weight: 600;
  color: var(--tm-color-text-primary);
  text-align: center;
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth__label {
  font-size: 14px;
  color: var(--tm-color-text-meta);
}

.auth__submit {
  margin-top: 8px;
}

.auth__footer {
  margin-top: auto;
  padding-top: 32px;
  text-align: center;
  font-size: 14px;
  color: var(--tm-color-text-meta);
}

.auth__link {
  margin-left: 4px;
  padding: 0;
  border: none;
  background: none;
  color: var(--tm-color-brand);
  font-size: inherit;
  cursor: pointer;
}
</style>
