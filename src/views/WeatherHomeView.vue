<script setup>
// 검색 대시보드. 도시 목록 데이터는 도시 이름만 보관하고 있고, 날씨는 API를 통해
// 불러오되 화면에 실제로 보이는 도시(검색 결과, 없으면 방문·즐겨찾기+대표 도시)만 조회함.
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import CityFinder from '@/components/exercise/CityFinder.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { cityDirectory, findCityByName } from '@/data/cities.js'
import { filmForBucket } from '@/data/films.js'
import { mainToStatusBucket } from '@/utils/weatherBuckets.js'
import { useWeatherDashboard } from '@/composables/useWeatherDashboard.js'
import { useWeatherStore } from '@/stores/weatherStore.js'

const router = useRouter()
const {
  searchQuery,
  selectedCityName,
  priorityCities,
  representativeCities,
  regionGroups,
  isFavorite,
  selectCity,
  clearSelection,
  toggleFavorite,
  jumpToCity,
} = useWeatherDashboard()
const weatherStore = useWeatherStore()

const favoritesOnly = ref(false)
const showFinder = ref(false)
const filmMatchLog = ref([])

// 검색어가 있으면 이름 부분일치(실습3 실시간 필터링 유지), 없으면 방문·즐겨찾기 + 대표 도시
const displayCities = computed(() => {
  const keyword = searchQuery.value.trim()
  if (keyword) return cityDirectory.filter((city) => city.name.includes(keyword))
  const seen = new Set()
  return [...priorityCities.value, ...representativeCities.value].filter((city) => {
    if (seen.has(city.name)) return false
    seen.add(city.name)
    return true
  })
})

watch(displayCities, (cities) => weatherStore.loadWeatherForCities(cities), { immediate: true })

const selectedCity = computed(() => findCityByName(selectedCityName.value))
const selectedWeather = computed(() => weatherStore.weatherFor(selectedCityName.value))

const matchedFilm = computed(() =>
  selectedWeather.value ? filmForBucket(mainToStatusBucket(selectedWeather.value.main)) : '',
)

watch(matchedFilm, (newFilm) => {
  if (!newFilm || !selectedCity.value) return
  filmMatchLog.value = [`${selectedCity.value.name} → ${newFilm}`, ...filmMatchLog.value].slice(0, 5)
})

const handleUpdateQuery = (value) => {
  searchQuery.value = value
}

const closeFinder = () => {
  showFinder.value = false
}

const selectFromFinder = (city) => {
  jumpToCity(city)
  closeFinder()
}

const showDetail = (city) => router.push('/weather/' + encodeURIComponent(city.name))

// 검색창에 포커스가 없을 때도 ESC로 선택을 취소. 도시 찾기 팝업이 열려 있으면 그것부터 닫음
// (검색창 포커스 상태의 ESC는 SearchBar가 검색어 지우기로 처리)
const handleEscape = (event) => {
  if (event.key !== 'Escape') return
  if (showFinder.value) {
    showFinder.value = false
    return
  }
  const focusedTag = document.activeElement?.tagName
  if (focusedTag === 'INPUT' || focusedTag === 'TEXTAREA') return
  clearSelection()
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => window.removeEventListener('keydown', handleEscape))
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="검색">
      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
      <p v-if="!searchQuery" class="result-count">전체 {{ cityDirectory.length }}개 도시</p>
      <p v-else-if="displayCities.length === 0" class="result-count">
        '{{ searchQuery }}'와 일치하는 도시가 없습니다.
      </p>
      <p v-else class="result-count">검색 결과 {{ displayCities.length }}개 도시</p>
      <label class="favorites-only">
        <input v-model="favoritesOnly" type="checkbox" />
        즐겨찾기만 보기
      </label>
      <button type="button" class="finder-btn" @click="showFinder = true">지역별 도시 찾기</button>
    </BaseDashboardCard>

    <BaseDashboardCard title="도시별 날씨">
      <div class="card-list">
        <WeatherCard
          v-for="city in displayCities"
          v-show="!favoritesOnly || isFavorite(city.name)"
          :key="city.name"
          :city="city"
          :weather="weatherStore.weatherFor(city.name)"
          :is-favorite="isFavorite(city.name)"
          :is-selected="selectedCityName === city.name"
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
      <p v-else-if="selectedCity" class="status-bar">날씨를 불러오는 중입니다…</p>
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

<!-- .card-list/.status-bar/.hint는 weather.css 공유, 이 화면만의 것만 남김 -->
<style src="@/assets/weather.css" scoped></style>

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
.weather-status h3 {
  margin-top: 1.25rem;
  font-size: 0.95rem;
}
</style>
