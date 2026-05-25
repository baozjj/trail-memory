<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { getApiErrorMessage } from '@/api/http'
import { useAdminAuthStore } from '@/stores/admin-auth'

const router = useRouter()
const route = useRoute()
const authStore = useAdminAuthStore()

const submitting = ref(false)
const form = reactive({
  email: 'admin@trail.local',
  password: '',
})

async function onSubmit({ validateResult }: { validateResult: boolean }) {
  if (validateResult !== true) return

  submitting.value = true
  try {
    await authStore.login({ email: form.email.trim(), password: form.password })
    MessagePlugin.success('登录成功')
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.replace(redirect)
  } catch (err) {
    MessagePlugin.error(getApiErrorMessage(err, '登录失败'))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <t-card title="管理端登录" class="login-page__card">
      <t-form :data="form" label-width="64px" @submit="onSubmit">
        <t-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱' }]">
          <t-input v-model="form.email" placeholder="admin@trail.local" />
        </t-form-item>
        <t-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <t-input v-model="form.password" type="password" placeholder="密码" />
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit" block :loading="submitting">登录</t-button>
        </t-form-item>
      </t-form>
      <p class="login-page__hint">开发环境种子账号：admin@trail.local / admin</p>
    </t-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--tm-color-bg-shell);
}

.login-page__card {
  width: 100%;
  max-width: 420px;
}

.login-page__hint {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--tm-color-text-tertiary);
}
</style>
