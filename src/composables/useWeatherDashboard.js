// journeyStore의 원본 데이터(favorites/visitHistory)로 화면에 뭘 어떻게 배치할지 계산하는
// 구성 로직만 남긴 composable. 상태 자체는 journeyStore가 갖고 있다
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { weatherCities } from '../data/weatherCities.js'
import { groupByRegion, pickRepresentativeCities } from '../components/exercise/regionUtils.js'
import { useJourneyStore } from '../stores/journeyStore.js'

const journeyStore = useJourneyStore()
const { favorites, visitHistory, searchQuery, selectedCityId } = storeToRefs(journeyStore)

// 전체 도시 보기 상단에 먼저 보여줄 목록 정리 - 방문순서 -> 즐겨찾기
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

// priorityCities에 없는 도시들로 지역별 대표 하나씩 채우는 방식으로 설계
const representativeCities = computed(() => {
  const seenIds = new Set(priorityCities.value.map((city) => city.id))
  return pickRepresentativeCities(weatherCities, seenIds, regionGroups.value.length)
})

const isFavorite = journeyStore.isFavorite
const selectCity = journeyStore.selectCity
const toggleFavorite = journeyStore.toggleFavorite
const jumpToCity = journeyStore.jumpToCity

export function useWeatherDashboard() {
  return {
    searchQuery,
    selectedCityId,
    priorityCities,
    regionGroups,
    representativeCities,
    isFavorite,
    selectCity,
    toggleFavorite,
    jumpToCity,
  }
}
