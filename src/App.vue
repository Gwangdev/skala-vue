<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main>
    <header class="app-header">
      <p class="eyebrow">Weather × Film</p>
      <h1>Film Matching 앱</h1>
      <nav aria-label="주요 메뉴">
        <RouterLink to="/">검색 대시보드</RouterLink>
        <RouterLink to="/cities">전체 도시</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
      </nav>
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
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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
