<script setup>
// router/index.js의 catch-all route(path: '/:pathMatch(.*)*')가 매핑하는 화면
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="not-found-view">
    <p class="code">404</p>
    <h2>요청한 화면을 찾을 수 없습니다.</h2>
    <p>
      <code>{{ route.fullPath }}</code> 주소는 등록되어 있지 않습니다.
    </p>
    <RouterLink to="/">대시보드로 이동하기</RouterLink>
  </section>
</template>

<style scoped>
.not-found-view {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
}
.code {
  margin: 0;
  color: var(--weather-accent);
  font-size: 1.4rem;
  font-weight: 700;
}
</style>
