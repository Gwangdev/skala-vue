// 외부에서 받아온 날씨 데이터를 모아두는 store. journeyStore(사용자 여정 — 즐겨찾기·방문 이력)와 분리
import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getWeatherForCity, getCityForecast } from '@/services/weatherApi.js'
import { getSunTimesForCity } from '@/services/sunApi.js'

export const useWeatherStore = defineStore('weather', () => {
  // 도시 이름 → 현재 날씨 객체(로딩 중이면 없음)
  const current = reactive({})
  // 도시 이름 → { forecast, sun } 상세 데이터
  const detail = reactive({})

  function weatherFor(name) {
    return current[name] ?? null
  }

  function detailFor(name) {
    return detail[name] ?? null
  }

  // 도시 하나의 현재 날씨. 이미 캐시에 있으면 그대로 반환.
  async function loadWeather(city) {
    if (current[city.name]) return current[city.name]
    const weather = await getWeatherForCity(city)
    current[city.name] = weather
    return weather
  }

  // 여러 도시를 병렬로. 아직 캐시에 없는 것만 실제로 호출됨.
  async function loadWeatherForCities(cities) {
    const missing = cities.filter((city) => !current[city.name])
    await Promise.all(missing.map((city) => loadWeather(city)))
  }

  // 일출/일몰은 실패해도 예보까지 같이 날리지 않도록 개별적으로 삼킴
  async function loadSunTimes(city) {
    try {
      return await getSunTimesForCity(city)
    } catch (error) {
      console.warn(`[weatherStore] 일출/일몰 조회 실패: ${city.name}`, error)
      return null
    }
  }

  // 상세 화면 진입 시 — 현재 날씨 + 예보 + 일출/일몰을 한 번에 채움.
  async function loadDetail(city) {
    await loadWeather(city)
    if (detail[city.name]) return detail[city.name]
    const [forecast, sun] = await Promise.all([getCityForecast(city), loadSunTimes(city)])
    detail[city.name] = { forecast, sun }
    return detail[city.name]
  }

  return {
    current,
    detail,
    weatherFor,
    detailFor,
    loadWeather,
    loadWeatherForCities,
    loadDetail,
  }
})
