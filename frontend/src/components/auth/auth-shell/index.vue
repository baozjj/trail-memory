<script setup lang="ts">
import type { AuthShellProps } from './types'

defineProps<AuthShellProps>()
</script>

<template>
  <div class="auth-shell">
    <div class="auth-shell__glow" aria-hidden="true" />
    <header class="auth-shell__hero">
      <h1 class="auth-shell__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth-shell__subtitle">{{ subtitle }}</p>
    </header>
    <div class="auth-shell__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="auth-shell__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.auth-shell {
  --tm-auth-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display',
    'Helvetica Neue', sans-serif;
  --tm-auth-surface: #f5f5f7;
  --tm-auth-surface-focus: #ebebed;
  --tm-auth-link: #0071e3;
  --tm-auth-muted: #86868b;
  --tm-auth-radius: 12px;
  --tm-auth-ease: cubic-bezier(0.25, 0.1, 0.25, 1);

  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: calc(56px + env(safe-area-inset-top, 0px)) 28px calc(28px + env(safe-area-inset-bottom, 0px));
  font-family: var(--tm-auth-font);
  -webkit-font-smoothing: antialiased;
  animation: auth-shell-enter 0.72s var(--tm-auth-ease) both;
}

.auth-shell__glow {
  position: absolute;
  top: -120px;
  left: 50%;
  width: min(420px, 100vw);
  height: 280px;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse 80% 70% at 50% 0%,
    rgba(0, 113, 227, 0.07) 0%,
    transparent 72%
  );
  pointer-events: none;
}

.auth-shell__hero {
  position: relative;
  margin-bottom: 44px;
  animation: auth-shell-enter 0.72s var(--tm-auth-ease) 0.06s both;
}

.auth-shell__title {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.022em;
  line-height: 1.12;
  color: var(--tm-color-text-primary);
}

.auth-shell__subtitle {
  margin: 10px 0 0;
  max-width: 20em;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--tm-auth-muted);
}

.auth-shell__body {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: auth-shell-enter 0.72s var(--tm-auth-ease) 0.12s both;
}

.auth-shell__footer {
  margin-top: auto;
  padding-top: 36px;
  text-align: center;
  font-size: 15px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--tm-auth-muted);
  animation: auth-shell-enter 0.72s var(--tm-auth-ease) 0.18s both;
}

@keyframes auth-shell-enter {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
