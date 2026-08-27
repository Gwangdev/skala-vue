// unit상태 보존을 위해 localStorage 형성 (새로고침 후에도 유지되도록)
import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef.js'

const UNIT_KEY = 'weather-unit'
const TONE_KEY = 'weather-tone'

export const useConfigStore = defineStore('config', () => {
  const unit = usePersistedRef(UNIT_KEY, 'celsius', {
    parse: (raw) => (raw === 'fahrenheit' ? 'fahrenheit' : 'celsius'),
  })
  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '°F' : '°C'))

  // WeatherCard/WeatherDetailView 각각의 변환 계산 중복을 getter로 통합
  const toDisplayTemp = computed(() => (rawTemp) =>
    unit.value === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : rawTemp,
  )

  // 컬러 모드는 main.css의 컬러 팔레트 사용, 흑백 모드는 별도
  // grayscale 필터로 채도만 지워서 토글되도록 설계
  const tone = usePersistedRef(TONE_KEY, 'color', {
    parse: (raw) => (raw === 'mono' ? 'mono' : 'color'),
  })

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function toggleTone() {
    tone.value = tone.value === 'color' ? 'mono' : 'color'
  }

  return { unit, unitSymbol, toDisplayTemp, tone, toggleUnit, toggleTone }
})
