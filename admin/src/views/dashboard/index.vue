<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http, getApiErrorMessage } from '@/api/http'
import type { ApiSuccessBody } from '@/types/api'

const healthOk = ref<boolean | null>(null)
const healthError = ref<string | null>(null)

onMounted(async () => {
  try {
    const { data } = await http.get<ApiSuccessBody<{ status: string; scope: string }>>(
      '/api/admin/health',
    )
    healthOk.value = data.data.status === 'ok' && data.data.scope === 'admin'
  } catch (err) {
    healthOk.value = false
    healthError.value = getApiErrorMessage(err)
  }
})
</script>

<template>
  <t-card title="运营看板">
    <p>指标与趋势将在 <strong>M06</strong> 实现。</p>
    <t-divider />
    <p v-if="healthOk === true" class="dashboard__health dashboard__health--ok">
      后端 Admin 健康检查已通过。
    </p>
    <p v-else-if="healthOk === false" class="dashboard__health dashboard__health--err">
      后端 Admin 健康检查失败：{{ healthError ?? '未知错误' }}
    </p>
    <p v-else class="dashboard__health">正在检测后端…</p>
  </t-card>
</template>

<style scoped>
.dashboard__health {
  margin: 0;
  font-size: 14px;
}

.dashboard__health--ok {
  color: #2ba471;
}

.dashboard__health--err {
  color: var(--tm-color-danger);
}
</style>
