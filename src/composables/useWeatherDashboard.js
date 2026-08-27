// journeyStore의 원본 데이터(favorites/visitHistory)로 화면에 도시를 어떻게 배치할지
// 계산하는 구성 로직. 사용자가 조작한 데이터 자체는 journeyStore, API 날씨 데이터는 weatherStore가 가짐.
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { cityDirectory, findCityByName } from '@/data/cities.js'
import { groupByRegion, pickRepresentativeCities } from '@/components/exercise/regionUtils.js'
import { useJourneyStore } from '@/stores/journeyStore.js'

const journeyStore = useJourneyStore()
const { favorites, visitHistory, searchQuery, selectedCityName } = storeToRefs(journeyStore)

// 전체 도시 보기 상단에 먼저 보여줄 목록 - 방문 순서 -> 즐겨찾기
const priorityCities = computed(() => {
  const seen = new Set()
  const result = []
  for (const name of [...visitHistory.value, ...favorites.value]) {
    if (seen.has(name)) continue
    const city = findCityByName(name)
    if (!city) continue
    seen.add(name)
    result.push(city)
  }
  return result
})

const regionGroups = computed(() => groupByRegion(cityDirectory))

// priorityCities에 없는 도시로 국가별 대표 하나씩 채움
const representativeCities = computed(() => {
  const seenNames = new Set(priorityCities.value.map((city) => city.name))
  const countryCount = new Set(cityDirectory.map((city) => city.countryCode)).size
  return pickRepresentativeCities(cityDirectory, seenNames, countryCount)
})

const isFavorite = journeyStore.isFavorite
const selectCity = journeyStore.selectCity
const clearSelection = journeyStore.clearSelection
const toggleFavorite = journeyStore.toggleFavorite
const jumpToCity = journeyStore.jumpToCity

export function useWeatherDashboard() {
  return {
    searchQuery,
    selectedCityName,
    priorityCities,
    regionGroups,
    representativeCities,
    isFavorite,
    selectCity,
    clearSelection,
    toggleFavorite,
    jumpToCity,
  }
}
