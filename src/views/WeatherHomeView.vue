<script setup>
// 실습4의 WeatherParent를 대체하는 페이지(view)로, Router를 통해 각 페이지별로 이동하도록 구현
// 별도 페이지(View)들을 새로 할당함으로써 각 페이지별 url을 통해 외부 공유가 가능해졌으나 주소(링크) 관리, 상태 기록 관리 등의 이슈가 함께 발생했음
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import CityFinder from '@/components/exercise/CityFinder.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { useWeatherDashboard } from '@/composables/useWeatherDashboard.js'

const router = useRouter()
const {
  weatherCities,
  searchQuery,
  selectedCityId,
  favoritesOnly,
  favorites,
  showFinder,
  filteredWeatherList,
  selectedCity,
  matchedFilm,
  filmMatchLog,
  regionGroups,
  handleUpdateQuery,
  selectCity,
  toggleFavorite,
  closeFinder,
  selectFromFinder,
} = useWeatherDashboard()

// 실습4까지 window.alert()로 처리하던 부분을 Programmatic Navigation으로 교체
const showDetail = (city) => router.push('/weather/' + city.id)
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="검색">
      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
      <p v-if="!searchQuery" class="result-count">전체 {{ weatherCities.length }}개 도시</p>
      <p v-else-if="filteredWeatherList.length === 0" class="result-count">
        '{{ searchQuery }}'와 일치하는 도시가 없습니다.
      </p>
      <p v-else class="result-count">검색 결과 {{ filteredWeatherList.length }}개 도시</p>
      <label class="favorites-only">
        <input v-model="favoritesOnly" type="checkbox" />
        즐겨찾기만 보기
      </label>
      <button type="button" class="finder-btn" @click="showFinder = true">지역별 도시 찾기</button>
    </BaseDashboardCard>

    <BaseDashboardCard title="도시별 날씨">
      <div class="card-list">
        <WeatherCard
          v-for="city in filteredWeatherList"
          v-show="!favoritesOnly || favorites.includes(city.id)"
          :key="city.id"
          :city="city"
          :is-favorite="favorites.includes(city.id)"
          :is-selected="selectedCityId === city.id"
          @select-card="selectCity"
          @click-detail="showDetail"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </BaseDashboardCard>

    <section class="weather-status">
      <h3>상태바</h3>
      <p v-if="selectedCity" class="status-bar">{{ selectedCity.name }}이(가) 선택되었습니다.</p>
      <p v-else class="status-bar">카드를 클릭해 도시를 선택하세요.</p>
      <h3>오늘 날씨에 맞는 필름 추천</h3>
      <p v-if="matchedFilm" class="status-bar">🎞️ {{ matchedFilm }}</p>
      <p v-else class="status-bar">도시를 선택하면 추천 필름을 안내합니다.</p>
      <ul v-if="filmMatchLog.length" class="hint">
        <li v-for="(log, index) in filmMatchLog" :key="index">{{ log }}</li>
      </ul>
    </section>

    <CityFinder
      :visible="showFinder"
      :regions="regionGroups"
      @close="closeFinder"
      @select="selectFromFinder"
    />
  </div>
</template>

<style scoped>
.result-count {
  margin-top: 0.6rem;
  font-size: 0.85rem;
}
.favorites-only {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
}
.finder-btn {
  margin-top: 0.75rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-soft);
  cursor: pointer;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.weather-status h3 {
  margin-top: 1.25rem;
  font-size: 0.95rem;
}
.status-bar {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--weather-panel-bg);
}
.hint {
  font-size: 0.8rem;
  color: var(--weather-muted-text);
}
</style>
