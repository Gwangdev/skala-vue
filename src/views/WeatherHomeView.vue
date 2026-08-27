<script setup>
// 검색 대시보드. 검색어가 있으면 이름 부분일치 결과, 없으면 최근 탐색·즐겨찾기 +
// 국가별 대표 도시를 한 화면에서 보여줌(실습5의 /cities 화면을 여기로 합침).
// 도시 목록 데이터는 이름만 갖고, 날씨는 화면에 실제로 보이는 도시만 API로 조회.
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import CityFinder from '@/components/exercise/CityFinder.vue'
import FilmStrip from '@/components/exercise/FilmStrip.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherHero from '@/components/exercise/WeatherHero.vue'
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
const searchResults = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return []
  return cityDirectory.filter((city) => city.name.includes(keyword))
})
const hasQuery = computed(() => searchQuery.value.trim().length > 0)

// 날씨를 조회할 대상 (화면에 실제로 올라오는 도시만 로딩되도록)
const citiesInView = computed(() =>
  hasQuery.value ? searchResults.value : [...priorityCities.value, ...representativeCities.value],
)

// Mock 데이터로 내려간 도시가 있으면 세션당 한 번만 알림
let mockNoticeShown = false
watch(
  citiesInView,
  async (cities) => {
    await weatherStore.loadWeatherForCities(cities)
    if (mockNoticeShown) return
    const usingMock = cities.some((city) => weatherStore.weatherFor(city.name)?.source === 'mock')
    if (!usingMock) return
    mockNoticeShown = true
    ElMessage.warning('실시간 날씨를 받지 못한 도시는 임시(Mock) 데이터로 표시됩니다.')
  },
  { immediate: true },
)

const visibleInFavoritesFilter = (city) => !favoritesOnly.value || isFavorite(city.name)

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

const selectFromFinder = (city) => {
  jumpToCity(city)
  showFinder.value = false
}

const showDetail = (city) => router.push('/weather/' + encodeURIComponent(city.name))

// 검색창에 포커스가 없을 때도 ESC로 선택을 취소(실습7에서 추가한 동작).
// 도시 찾기 팝업의 ESC는 el-dialog가 맡으므로 여기서 다루지 않음.
const handleEscape = (event) => {
  if (event.key !== 'Escape') return
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
      <p v-if="!hasQuery" class="result-count">전체 {{ cityDirectory.length }}개 도시</p>
      <p v-else-if="searchResults.length === 0" class="result-count">
        '{{ searchQuery }}'와 일치하는 도시가 없습니다.
      </p>
      <p v-else class="result-count">검색 결과 {{ searchResults.length }}개 도시</p>
      <label class="favorites-only">
        <input v-model="favoritesOnly" type="checkbox" />
        즐겨찾기만 보기
      </label>
      <button type="button" class="finder-btn" @click="showFinder = true">지역별 도시 찾기</button>
    </BaseDashboardCard>

    <BaseDashboardCard title="도시별 날씨">
      <template v-if="hasQuery">
        <div class="card-list">
          <WeatherCard
            v-for="city in searchResults"
            v-show="visibleInFavoritesFilter(city)"
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
      </template>
      <template v-else>
        <template v-if="priorityCities.length > 0">
          <h4 class="group-label">최근 탐색 · 즐겨찾기</h4>
          <div class="card-list">
            <WeatherCard
              v-for="city in priorityCities"
              v-show="visibleInFavoritesFilter(city)"
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
        </template>
        <h4 class="group-label">국가별 대표 도시</h4>
        <p v-if="representativeCities.length === 0" class="hint">모든 국가의 도시를 이미 탐색했습니다.</p>
        <div class="card-list">
          <WeatherCard
            v-for="city in representativeCities"
            v-show="visibleInFavoritesFilter(city)"
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
      </template>
    </BaseDashboardCard>

    <section class="weather-status">
      <WeatherHero :city="selectedCity" :weather="selectedWeather" />
      <h3>오늘 날씨에 맞는 필름 추천</h3>
      <p v-if="matchedFilm" class="status-bar">🎞️ {{ matchedFilm }}</p>
      <p v-else-if="selectedCity" class="status-bar">날씨를 불러오는 중입니다…</p>
      <p v-else class="status-bar">도시를 선택하면 추천 필름을 안내합니다.</p>
      <ul v-if="filmMatchLog.length" class="hint">
        <li v-for="(log, index) in filmMatchLog" :key="index">{{ log }}</li>
      </ul>
    </section>

    <section class="film-zone">
      <h3>필름 스트립</h3>
      <p class="hint">프레임 위에서 마우스를 움직이면 루페로 확대되고, 클릭하면 상세가 열립니다.</p>
      <FilmStrip />
    </section>

    <CityFinder :visible="showFinder" :regions="regionGroups" @close="showFinder = false" @select="selectFromFinder" />
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
.group-label {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
}
.weather-status h3,
.film-zone h3 {
  margin-top: 1.25rem;
  font-size: 0.95rem;
}
.film-zone {
  margin-top: 1rem;
}
.film-zone .hint {
  margin: 0.25rem 0 0.75rem;
}
</style>
