<script setup>
import { RouterLink } from 'vue-router'

// vite --mode로 주입되는 라벨. 모드 파일이 없으면 Vite 기본값(MODE)으로 떨어짐
const buildMode = import.meta.env.VITE_APP_MODE ?? import.meta.env.MODE
</script>

<template>
  <section class="about-view">
    <h2>Film Matching 앱</h2>
    <p>도시별 날씨를 확인하고, 빛과 날씨에 어울리는 필름을 알려주는 서비스입니다.</p>
    <p>
      검색 대시보드 한 화면에서 도시를 찾고, 최근 탐색·즐겨찾기와 국가별 대표 도시를 함께 봅니다.
      도시를 고르면 상세 주소로 이동해 예보·대기오염·일출 정보와 노출 계산을 확인할 수 있습니다.
    </p>
    <p class="build-mode">빌드 모드: {{ buildMode }}</p>
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
.build-mode {
  font-size: 0.8rem;
  color: var(--weather-muted-text);
}
</style>
