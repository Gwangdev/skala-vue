// 검색·즐겨찾기·방문 이력·필름 매칭 상태를 홈(WeatherHomeView)과 전체 도시 보기
// (WeatherCitiesView)가 공유해야 해서 만든 composable. ref를 함수 안이 아니라
// 모듈 최상단에 선언해 둔 게 핵심 — 그래야 이 함수를 호출하는 모든 컴포넌트가
// 같은 상태를 참조한다(호출할 때마다 새 상태를 만드는 일반적인 composable과 다름).
// 새로고침하면 초기화되는 한계가 있어, 다음 실습(Pinia)에서 정식 스토어로 옮긴다.
import { computed, ref, watch } from 'vue'
import { weatherCities, filmMatches } from '../data/weatherCities.js'
import { groupByRegion, pickRepresentativeCities } from '../components/exercise/regionUtils.js'

const searchQuery = ref('')
const selectedCityId = ref('')
const favoritesOnly = ref(false)
const favorites = ref([])
const showFinder = ref(false)
const visitHistory = ref([])
const filmMatchLog = ref([])

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherCities
  return weatherCities.filter((city) => city.name.includes(keyword))
})

const selectedCity = computed(
  () => weatherCities.find((city) => city.id === selectedCityId.value) ?? null,
)

const matchedFilm = computed(() => {
  if (!selectedCity.value) return ''
  return filmMatches[selectedCity.value.status] ?? '추천 필름 준비 중'
})

watch(matchedFilm, (newFilm) => {
  if (!newFilm || !selectedCity.value) return
  filmMatchLog.value = [`${selectedCity.value.name} → ${newFilm}`, ...filmMatchLog.value].slice(
    0,
    5,
  )
})

// 전체 도시 보기 상단에 먼저 보여줄 목록 — 방문 이력을 최신순으로, 그다음
// 즐겨찾기를 붙인다(중복 도시는 첫 등장만 남긴다)
const priorityCities = computed(() => {
  const seen = new Set()
  const result = []

  for (const id of visitHistory.value) {
    const city = weatherCities.find((item) => item.id === id)
    if (!city || seen.has(city.id)) continue
    seen.add(city.id)
    result.push(city)
  }

  for (const id of favorites.value) {
    const city = weatherCities.find((item) => item.id === id)
    if (!city || seen.has(city.id)) continue
    seen.add(city.id)
    result.push(city)
  }

  return result
})

const regionGroups = computed(() => groupByRegion(weatherCities))

// priorityCities에 없는 도시들로 지역별 대표 하나씩 채운다 — 한 지역이 소진되면
// (예: 도시가 하나뿐인 지역을 이미 탐색) regionUtils.js가 다른 지역 도시로 대체한다
const representativeCities = computed(() => {
  const seenIds = new Set(priorityCities.value.map((city) => city.id))
  return pickRepresentativeCities(weatherCities, seenIds, regionGroups.value.length)
})

const handleUpdateQuery = (value) => {
  searchQuery.value = value
}

const selectCity = (city) => {
  selectedCityId.value = city.id
  const existingIndex = visitHistory.value.indexOf(city.id)
  if (existingIndex !== -1) visitHistory.value.splice(existingIndex, 1)
  visitHistory.value.unshift(city.id)
}

const toggleFavorite = (city) => {
  const index = favorites.value.indexOf(city.id)
  if (index === -1) favorites.value.push(city.id)
  else favorites.value.splice(index, 1)
}

const jumpToCity = (city) => {
  selectCity(city)
  searchQuery.value = city.name
}

const closeFinder = () => {
  showFinder.value = false
}

const selectFromFinder = (city) => {
  jumpToCity(city)
  closeFinder()
}

export function useWeatherDashboard() {
  return {
    weatherCities,
    searchQuery,
    selectedCityId,
    favoritesOnly,
    favorites,
    showFinder,
    visitHistory,
    filteredWeatherList,
    selectedCity,
    matchedFilm,
    filmMatchLog,
    priorityCities,
    regionGroups,
    representativeCities,
    handleUpdateQuery,
    selectCity,
    toggleFavorite,
    jumpToCity,
    closeFinder,
    selectFromFinder,
  }
}
