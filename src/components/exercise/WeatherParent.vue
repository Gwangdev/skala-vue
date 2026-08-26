<script setup>
// WeatherComposition.vue를 4개 컴포넌트로 분리하여 구조 재사용성 향상
import { ref, computed, watch } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import CityFinder from './CityFinder.vue'
import { groupByRegion, pickRepresentativeCities } from './regionUtils.js'

// 기존 6개 도시 데이터에 지역별로 데이터를 추가해 13개로 늘리고 region 필드를 함께 추가, 지역별 조회 기능 개발
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    region: '수도권',
    temp: 28,
    status: '맑음',
    humidity: 55,
    icon: '☀️',
  },
  {
    id: 'city_02',
    name: '인천',
    region: '수도권',
    temp: 27,
    status: '흐림',
    humidity: 62,
    icon: '☁️',
  },
  {
    id: 'city_03',
    name: '수원',
    region: '수도권',
    temp: 26,
    status: '맑음',
    humidity: 59,
    icon: '☀️',
  },
  {
    id: 'city_04',
    name: '부산',
    region: '영남권',
    temp: 24,
    status: '흐림',
    humidity: 68,
    icon: '☁️',
  },
  {
    id: 'city_05',
    name: '대구',
    region: '영남권',
    temp: 29,
    status: '맑음',
    humidity: 48,
    icon: '☀️',
  },
  {
    id: 'city_06',
    name: '울산',
    region: '영남권',
    temp: 25,
    status: '맑음',
    humidity: 52,
    icon: '☀️',
  },
  {
    id: 'city_07',
    name: '광주',
    region: '호남권',
    temp: 27,
    status: '맑음',
    humidity: 58,
    icon: '☀️',
  },
  {
    id: 'city_08',
    name: '전주',
    region: '호남권',
    temp: 23,
    status: '흐림',
    humidity: 65,
    icon: '☁️',
  },
  {
    id: 'city_09',
    name: '대전',
    region: '충청권',
    temp: 22,
    status: '맑음',
    humidity: 50,
    icon: '☀️',
  },
  {
    id: 'city_10',
    name: '청주',
    region: '충청권',
    temp: 21,
    status: '흐림',
    humidity: 63,
    icon: '☁️',
  },
  {
    id: 'city_11',
    name: '강릉',
    region: '강원권',
    temp: 20,
    status: '흐림',
    humidity: 60,
    icon: '☁️',
  },
  {
    id: 'city_12',
    name: '춘천',
    region: '강원권',
    temp: 18,
    status: '맑음',
    humidity: 54,
    icon: '☀️',
  },
  {
    id: 'city_13',
    name: '제주',
    region: '제주권',
    temp: 26,
    status: '비',
    humidity: 80,
    icon: '🌧️',
  },
])

const searchQuery = ref('')
const selectedCityId = ref('')
const favoritesOnly = ref(false)
const favorites = ref([])
const viewMode = ref('search') // 'search' | 'all'
const showFinder = ref(false)

// 방문 이력 개발 - 선택할 때마다 맨 앞으로(최근 순, 중복 없음). 전체 도시 보기 기능에서 순서 기준으로 활용
const visitHistory = ref([])

// searchQuery가 바뀔 때마다 재계산 - 입력마다 실시간으로 필터링하여 UX 향상
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(keyword))
})

const handleUpdateQuery = (value) => {
  searchQuery.value = value
}

// 날씨 상태별 추천 필름 매칭
const FILM_MATCH = {
  맑음: '코닥 포트라 400 — 쨍한 대비, 선명한 채도',
  흐림: '일포드 HP5 (흑백) — 부드러운 톤, 인물 사진에 적합',
  비: '시네스틸 800T — 고감도, 저조도 대응',
}

const selectedCity = computed(
  () => weatherList.value.find((c) => c.id === selectedCityId.value) ?? null,
)

const matchedFilm = computed(() => {
  if (!selectedCity.value) return ''
  return FILM_MATCH[selectedCity.value.status] ?? '추천 필름 준비 중'
})

const filmMatchLog = ref([])

watch(matchedFilm, (newFilm) => {
  if (!newFilm || !selectedCity.value) return
  filmMatchLog.value = [`${selectedCity.value.name} → ${newFilm}`, ...filmMatchLog.value].slice(
    0,
    5,
  )
})

// 도시를 선택했다는 의미(선택 상태 갱신 + 방문 이력에 추가)는 검색 목록이든 전체 도시
// 보기든 동일해서 하나로 모았다. 전체 도시 보기·도시 찾기에서는 jumpToCity가 이 함수를
// 감싸 검색 화면 전환까지 같이 처리한다.
const selectCity = (city) => {
  selectedCityId.value = city.id
  const existingIndex = visitHistory.value.indexOf(city.id)
  if (existingIndex !== -1) visitHistory.value.splice(existingIndex, 1)
  visitHistory.value.unshift(city.id)
}

const showDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}

const toggleFavorite = (city) => {
  const index = favorites.value.indexOf(city.id)
  if (index === -1) favorites.value.push(city.id)
  else favorites.value.splice(index, 1)
}

// 전체 도시 보기 페이지 개발 - 우선 목록(방문 이력 + 즐겨찾기) 선정
const priorityCities = computed(() => {
  const seen = new Set()
  const result = []
  for (const id of visitHistory.value) {
    const city = weatherList.value.find((c) => c.id === id)
    if (!city || seen.has(city.id)) continue
    seen.add(city.id)
    result.push(city)
  }
  for (const id of favorites.value) {
    if (seen.has(id)) continue
    const city = weatherList.value.find((c) => c.id === id)
    if (!city) continue
    seen.add(city.id)
    result.push(city)
  }
  return result
})

const regionGroups = computed(() => groupByRegion(weatherList.value))

// 전체 도시 보기의 지역별 대표 도시 - regionUtils.js을 통해 라운드로빈 기능 구현
const representativeCities = computed(() => {
  const seenIds = new Set(priorityCities.value.map((c) => c.id))
  return pickRepresentativeCities(weatherList.value, seenIds, regionGroups.value.length)
})

// 전체 도시 보기/도시 찾기에서 도시를 고르면 검색 화면으로 돌아와 선택 상태로 반영
const jumpToCity = (city) => {
  selectCity(city)
  searchQuery.value = city.name
  viewMode.value = 'search'
}

const closeFinder = () => {
  showFinder.value = false
}

const selectFromFinder = (city) => {
  jumpToCity(city)
  closeFinder()
}
</script>

<template>
  <div class="weather-parent">
    <p class="hint">실습 3(WeatherComposition)의 구성요소를 4개 컴포넌트로 나눴다.</p>

    <div class="view-toggle">
      <button type="button" :class="{ active: viewMode === 'search' }" @click="viewMode = 'search'">
        검색 대시보드
      </button>
      <button type="button" :class="{ active: viewMode === 'all' }" @click="viewMode = 'all'">
        전체 도시 보기
      </button>
    </div>

    <section v-if="viewMode === 'search'">
      <BaseDashboardCard title="검색">
        <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
        <p v-if="!searchQuery" class="result-count">전체 {{ weatherList.length }}개 도시</p>
        <p v-else-if="filteredWeatherList.length === 0" class="result-count">
          '{{ searchQuery }}'와 일치하는 도시가 없습니다.
        </p>
        <p v-else class="result-count">검색 결과 {{ filteredWeatherList.length }}개 도시</p>
        <label class="favorites-only">
          <input type="checkbox" v-model="favoritesOnly" />
          즐겨찾기만 보기
        </label>
        <button type="button" class="finder-btn" @click="showFinder = true">
          지역별 도시 찾기
        </button>
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
    </section>

    <section v-else class="all-cities-section">
      <h3 v-if="priorityCities.length > 0">최근 탐색 · 즐겨찾기</h3>
      <div v-if="priorityCities.length > 0" class="city-grid">
        <WeatherCard
          v-for="city in priorityCities"
          :key="city.id"
          :city="city"
          variant="grid"
          :is-favorite="favorites.includes(city.id)"
          @select-card="jumpToCity"
          @toggle-favorite="toggleFavorite"
        />
      </div>

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
          @select-card="jumpToCity"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <h3>상태바</h3>
    <p v-if="selectedCity" class="status-bar">{{ selectedCity.name }}이(가) 선택되었습니다.</p>
    <p v-else class="status-bar">카드를 클릭해 도시를 선택하세요.</p>

    <h3>오늘 날씨에 맞는 필름 추천</h3>
    <p v-if="matchedFilm" class="status-bar">🎞️ {{ matchedFilm }}</p>
    <p v-else class="status-bar">도시를 선택하면 추천 필름을 안내합니다.</p>
    <ul v-if="filmMatchLog.length" class="hint">
      <li v-for="(log, index) in filmMatchLog" :key="index">{{ log }}</li>
    </ul>

    <CityFinder
      :visible="showFinder"
      :regions="regionGroups"
      @close="closeFinder"
      @select="selectFromFinder"
    />
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.8rem;
  color: var(--weather-muted-text);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0 1rem;
}

.view-toggle button {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background-soft);
  cursor: pointer;
}

.view-toggle button.active {
  border-color: var(--weather-accent);
  color: var(--weather-accent);
  font-weight: 600;
}

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

.all-cities-section {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.all-cities-section h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
}

.all-cities-section h3 + h3 {
  margin-top: 1.5rem;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.city-grid + h3 {
  margin-top: 1.5rem;
}

.status-bar {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--weather-panel-bg);
}
</style>
