// 즐겨찾기·방문 이력·검색어·선택 도시 관리(새로고침 초기화 방지 + 페이지 간 공유)
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef.js'
import { findCityByName } from '@/data/cities.js'

const FAVORITES_KEY = 'weather-favorites'
const VISIT_HISTORY_KEY = 'weather-visit-history'
const VISIT_LIMIT = 8 // 방문 이력은 "최근"만 — 대시보드가 방문 도시마다 API를 부르므로 무한정 쌓이면 안 됨

// 문자열이면서 현재 목록에 있는 도시 이름만 남김(이전 실습의 id 형태 값·삭제된 도시 정리)
function parseCityNames(raw) {
  try {
    const value = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return value.filter((item) => typeof item === 'string' && findCityByName(item))
  } catch {
    return []
  }
}

export const useJourneyStore = defineStore('journey', () => {
  const favorites = usePersistedRef(FAVORITES_KEY, [], {
    parse: parseCityNames,
    serialize: JSON.stringify,
  })
  const visitHistory = usePersistedRef(VISIT_HISTORY_KEY, [], {
    parse: (raw) => parseCityNames(raw).slice(0, VISIT_LIMIT), // 이전에 쌓인 긴 이력도 로드 시 잘라냄
    serialize: JSON.stringify,
  })
  const searchQuery = ref('')
  const selectedCityName = ref('')

  const isFavorite = computed(() => (cityName) => favorites.value.includes(cityName))

  function toggleFavorite(city) {
    const index = favorites.value.indexOf(city.name)
    if (index === -1) favorites.value.push(city.name)
    else favorites.value.splice(index, 1)
  }

  function visitCity(city) {
    const existingIndex = visitHistory.value.indexOf(city.name)
    if (existingIndex !== -1) visitHistory.value.splice(existingIndex, 1)
    visitHistory.value.unshift(city.name)
    if (visitHistory.value.length > VISIT_LIMIT) visitHistory.value.length = VISIT_LIMIT
  }

  function selectCity(city) {
    selectedCityName.value = city.name
    visitCity(city)
  }

  function clearSelection() {
    selectedCityName.value = ''
  }

  function jumpToCity(city) {
    selectCity(city)
    searchQuery.value = city.name
  }

  return {
    favorites,
    visitHistory,
    searchQuery,
    selectedCityName,
    isFavorite,
    toggleFavorite,
    visitCity,
    selectCity,
    clearSelection,
    jumpToCity,
  }
})
