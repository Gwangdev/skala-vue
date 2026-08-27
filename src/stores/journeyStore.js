// useWeatherDashboard.js가 모듈 단위 ref로 들고 있던 데이터 중 즐겨찾기·방문이력·검색어·선택 도시를 관리(새로고침 초기화 방지 + 페이지 간 공유)
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef.js'

const FAVORITES_KEY = 'weather-favorites'
const VISIT_HISTORY_KEY = 'weather-visit-history'

function parseIds(raw) {
  try {
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export const useJourneyStore = defineStore('journey', () => {
  const favorites = usePersistedRef(FAVORITES_KEY, [], { parse: parseIds, serialize: JSON.stringify })
  const visitHistory = usePersistedRef(VISIT_HISTORY_KEY, [], {
    parse: parseIds,
    serialize: JSON.stringify,
  })
  const searchQuery = ref('')
  const selectedCityId = ref('')

  // favorites.includes(city.id) 중복 계산 방지용 getter
  const isFavorite = computed(() => (cityId) => favorites.value.includes(cityId))

  function toggleFavorite(city) {
    const index = favorites.value.indexOf(city.id)
    if (index === -1) favorites.value.push(city.id)
    else favorites.value.splice(index, 1)
  }

  function visitCity(city) {
    const existingIndex = visitHistory.value.indexOf(city.id)
    if (existingIndex !== -1) visitHistory.value.splice(existingIndex, 1)
    visitHistory.value.unshift(city.id)
  }

  function selectCity(city) {
    selectedCityId.value = city.id
    visitCity(city)
  }

  function jumpToCity(city) {
    selectCity(city)
    searchQuery.value = city.name
  }

  return {
    favorites,
    visitHistory,
    searchQuery,
    selectedCityId,
    isFavorite,
    toggleFavorite,
    visitCity,
    selectCity,
    jumpToCity,
  }
})
