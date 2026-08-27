<script setup>
// 실습4의 viewMode 토글을 /cities 라우트로 분리한 페이지. API데이터로 바꾸면서 
// 화면에 올라온 도시(방문·즐겨찾기 + 대표)만 weatherStore로 조회되도록 수정
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { useWeatherDashboard } from '@/composables/useWeatherDashboard.js'
import { useWeatherStore } from '@/stores/weatherStore.js'

const router = useRouter()
const { priorityCities, representativeCities, isFavorite, jumpToCity, toggleFavorite } =
  useWeatherDashboard()
const weatherStore = useWeatherStore()

const shownCities = computed(() => [...priorityCities.value, ...representativeCities.value])
watch(shownCities, (cities) => weatherStore.loadWeatherForCities(cities), { immediate: true })

// 카드를 고르면 검색 화면 상태를 갱신한 뒤 그 화면으로 돌아감
const selectAndReturnHome = (city) => {
  jumpToCity(city)
  router.push('/')
}
</script>

<template>
  <section class="all-cities-section">
    <h2>전체 도시 보기</h2>
    <p class="hint">최근 탐색과 즐겨찾기를 우선으로, 국가별 대표 도시를 이어서 보여줍니다.</p>
    <template v-if="priorityCities.length > 0">
      <h3>최근 탐색 · 즐겨찾기</h3>
      <div class="city-grid">
        <WeatherCard
          v-for="city in priorityCities"
          :key="city.name"
          :city="city"
          :weather="weatherStore.weatherFor(city.name)"
          variant="grid"
          :is-favorite="isFavorite(city.name)"
          @select-card="selectAndReturnHome"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </template>
    <h3>국가별 대표 도시</h3>
    <p v-if="representativeCities.length === 0" class="hint">
      모든 국가의 도시를 이미 탐색했습니다.
    </p>
    <div class="city-grid">
      <WeatherCard
        v-for="city in representativeCities"
        :key="city.name"
        :city="city"
        :weather="weatherStore.weatherFor(city.name)"
        variant="grid"
        :is-favorite="isFavorite(city.name)"
        @select-card="selectAndReturnHome"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </section>
</template>

<!-- .hint는 weather.css 공유, 이 화면만에 필요한 style만 남김 -->
<style src="@/assets/weather.css" scoped></style>

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
</style>
