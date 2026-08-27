<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import ToneToggler from '@/components/exercise/ToneToggler.vue'
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <main :data-tone="configStore.tone">
    <header class="app-header">
      <p class="eyebrow">Weather × Film</p>
      <h1>Film Matching 앱</h1>
      <div class="nav-row">
        <nav aria-label="주요 메뉴">
          <RouterLink to="/">검색 대시보드</RouterLink>
          <RouterLink to="/about">서비스 소개</RouterLink>
        </nav>
        <div class="toggler-row">
          <ToneToggler />
          <UnitToggler />
        </div>
      </div>
    </header>
    <!-- 현재 경로에 매칭된 view 컴포넌트가 이 자리에 렌더링된다 -->
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  margin-bottom: 1.5rem;
}
.eyebrow {
  margin: 0;
  color: var(--weather-muted-text);
  font-size: 0.8rem;
}
h1 {
  margin: 0.25rem 0 1rem;
  font-size: 1.6rem;
}
.nav-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.toggler-row {
  display: flex;
  gap: 0.5rem;
}
nav a {
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
nav a.router-link-exact-active {
  border-color: var(--weather-accent);
  color: var(--weather-accent);
  font-weight: 600;
}
</style>
