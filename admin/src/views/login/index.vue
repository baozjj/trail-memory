<script setup lang="ts">
import { ref } from 'vue'
import { http, getApiErrorMessage } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'

const healthStatus = ref<string | null>(null)
const healthLoading = ref(false)

async function checkHealth() {
  healthLoading.value = true
  healthStatus.value = null
  try {
    const { data } = await http.get<ApiSuccessBody<{ status: string; scope: string }>>(
      '/api/admin/health',
    )
    healthStatus.value = `${data.data.status} (${data.data.scope})`
  } catch (err) {
    healthStatus.value = getApiErrorMessage(err, '健康检查失败')
  } finally {
    healthLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <t-card title="管理端登录" class="login-page__card">
      <p class="login-page__lead">管理员登录与鉴权将在 <strong>M01</strong> 实现。</p>
      <t-alert theme="info" message="当前为 M00 占位页，无需 Token 即可浏览布局路由。" />
      <div class="login-page__actions">
        <t-button theme="primary" :loading="healthLoading" @click="checkHealth">
          检测 Admin API
        </t-button>
      </div>
      <p v-if="healthStatus" class="login-page__status">/api/admin/health → {{ healthStatus }}</p>
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

.login-page__lead {
  margin: 0 0 16px;
  color: var(--tm-color-text-secondary);
  line-height: 1.6;
}

.login-page__actions {
  margin-top: 20px;
}

.login-page__status {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--tm-color-text-tertiary);
}
</style>
