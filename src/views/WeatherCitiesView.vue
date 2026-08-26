<script setup>
// 실습4에서 WeatherParent 안 viewMode 토글로만 존재하던 "전체 도시 보기"를 /cities 라우트로 연결해서 별도 페이지로 분리함
import { useRouter } from 'vue-router'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { useWeatherDashboard } from '@/composables/useWeatherDashboard.js'

const router = useRouter()
const { favorites, priorityCities, representativeCities, jumpToCity, toggleFavorite } =
  useWeatherDashboard()

// 카드를 고르면 검색 화면 상태를 갱신한 뒤(jumpToCity) 해당 화면으로 돌아간다
const selectAndReturnHome = (city) => {
  jumpToCity(city)
  router.push('/')
}
</script>

<template>
  <section class="all-cities-section">
    <h2>전체 도시 보기</h2>
    <p class="hint">최근 탐색과 즐겨찾기를 우선으로, 지역별 대표 도시를 이어서 보여줍니다.</p>
    <template v-if="priorityCities.length > 0">
      <h3>최근 탐색 · 즐겨찾기</h3>
      <div class="city-grid">
        <WeatherCard
          v-for="city in priorityCities"
          :key="city.id"
          :city="city"
          variant="grid"
          :is-favorite="favorites.includes(city.id)"
          @select-card="selectAndReturnHome"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </template>
    <h3>지역별 대표 도시</h3>
    <p v-if="representativeCities.length === 0" class="hint">
      모든 지역의 도시를 이미 탐색했습니다.
    </p>
    <div class="city-grid">
      <WeatherCard
        v-for="city in representativeCities"
        :key="city.id"
        :city="city"
        variant="grid"
        :is-favorite="favorites.includes(city.id)"
        @select-card="selectAndReturnHome"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </section>
</template>

<style scoped>
.all-cities-section {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}
h2 {
  margin: 0;
  font-size: 1.1rem;
}
h3 {
  margin: 1.5rem 0 0.75rem;
  font-size: 0.95rem;
}
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}
.hint {
  font-size: 0.8rem;
  color: var(--weather-muted-text);
}
</style>
