<script setup>
// 상단 날씨 배너 — 날씨 상징 배경(그라디언트 + 이모지)과 수치를 보여줌
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'

const props = defineProps({
  city: { type: Object, default: null },
  weather: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const configStore = useConfigStore()

// 기존 날씨설정(맑음/흐림/비)보다 세밀하게 디벨롭
const ICON_BY_MAIN = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
}

const GRADIENT_BY_MAIN = {
  Clear: 'linear-gradient(160deg, #ffd97a, #ff9a4d 60%, #7a4a1e)',
  Clouds: 'linear-gradient(160deg, #cfd8dc, #90a4ae 60%, #37474f)',
  Rain: 'linear-gradient(160deg, #6b8ca8, #3d5a73 60%, #16232c)',
  Drizzle: 'linear-gradient(160deg, #9fb8c9, #5c7c91 60%, #253540)',
  Thunderstorm: 'linear-gradient(160deg, #545b7a, #2d3148 60%, #0e0f18)',
  Snow: 'linear-gradient(160deg, #eef3f7, #b7c7d1 60%, #5c6b73)',
  Mist: 'linear-gradient(160deg, #cfd3d4, #9aa1a3 60%, #454b4c)',
  Fog: 'linear-gradient(160deg, #cfd3d4, #9aa1a3 60%, #454b4c)',
}

const icon = computed(() => ICON_BY_MAIN[props.weather?.main] ?? '🌤️')
const gradient = computed(() => GRADIENT_BY_MAIN[props.weather?.main] ?? 'var(--film-surface-100)')
const displayTemp = computed(() =>
  props.weather ? `${configStore.toDisplayTemp(props.weather.temp)}${configStore.unitSymbol}` : '',
)
</script>

<template>
  <div class="weather-hero" :style="{ backgroundImage: city ? gradient : 'none' }">
    <p v-if="loading && !weather">날씨를 가져오는 중…</p>
    <template v-else-if="city && weather">
      <div class="headline">
        <span class="icon">{{ icon }}</span>
        <div>
          <strong>{{ city.name }}</strong>
          <span class="country">{{ city.country }}</span>
        </div>
      </div>
      <p class="detail">
        {{ displayTemp }} · {{ weather.description }} · 습도 {{ weather.humidity }}%
        <span class="source-badge" :class="weather.source">
          {{ weather.source === 'live' ? '실시간' : '목 데이터' }}
        </span>
      </p>
    </template>
    <p v-else class="placeholder">도시를 검색하거나 도시 찾기에서 선택하세요.</p>
  </div>
</template>

<style scoped>
.weather-hero {
  padding: 1.5rem;
  border-radius: var(--film-radius-lg);
  background-color: var(--film-surface-100);
  background-size: cover;
  color: #fff;
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
}

.headline {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.icon {
  font-size: 2rem;
}

.headline strong {
  display: block;
  font-size: 1.2rem;
}

.country {
  font-size: 0.8rem;
  opacity: 0.85;
}

.detail {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.95;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.source-badge {
  font-size: 0.68rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.placeholder {
  margin: 0;
  color: var(--film-text-muted);
}
</style>
