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
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: calc(56px + env(safe-area-inset-top, 0px)) var(--tm-spacing-page-x)
    calc(28px + env(safe-area-inset-bottom, 0px));
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
  font-size: var(--tm-font-size-title-lg);
  font-weight: 600;
  letter-spacing: var(--tm-letter-spacing-tight);
  line-height: 1.12;
  color: var(--tm-color-text-primary);
}

.auth-shell__subtitle {
  margin: 10px 0 0;
  max-width: 20em;
  font-size: var(--tm-font-size-body);
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: var(--tm-letter-spacing-normal);
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
  font-size: var(--tm-font-size-subhead);
  line-height: 1.4;
  letter-spacing: var(--tm-letter-spacing-normal);
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
