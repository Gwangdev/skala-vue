<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="about-view">
    <h2>Film Matching 앱</h2>
    <p>도시별 날씨를 확인하고, 빛과 날씨에 어울리는 필름을 알려주는 서비스입니다.</p>
    <p>
      검색 대시보드와 전체 도시 보기는 각각의 주소를 Route하여 필요한 화면을 바로 다시 열 수
      있도록 만들었습니다.
    </p>
    <RouterLink to="/">메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.about-view {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
}
h2 {
  margin-top: 0;
}
</style>
