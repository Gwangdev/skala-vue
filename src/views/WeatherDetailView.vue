<script setup>
// 도시 상세 뷰
// 진입 시 loadDetail(city)로 현재 날씨 + 예보 + 대기오염 + 일출/일몰을 한 번에 호출
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ExposureCalculator from '@/components/exercise/ExposureCalculator.vue'
import FilmStrip from '@/components/exercise/FilmStrip.vue'
import WeatherHero from '@/components/exercise/WeatherHero.vue'
import { findCityByName, regionOf } from '@/data/cities.js'
import { filmForBucket } from '@/data/films.js'
import { mainToStatusBucket, weatherDetailLabel } from '@/utils/weatherBuckets.js'
import { rankPhotoWindows, toLocalHm } from '@/utils/photoWindows.js'
import { useConfigStore } from '@/stores/configStore.js'
import { useWeatherStore } from '@/stores/weatherStore.js'

const route = useRoute()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const city = ref(null)
const loading = ref(false)

onMounted(async () => {
  const found = findCityByName(decodeURIComponent(route.params.cityName ?? ''))
  city.value = found
  if (!found) return
  loading.value = true
  try {
    await weatherStore.loadDetail(found)
  } finally {
    loading.value = false
  }
})

const weather = computed(() => (city.value ? weatherStore.weatherFor(city.value.name) : null))
const detail = computed(() => (city.value ? weatherStore.detailFor(city.value.name) : null))
const status = computed(() => (weather.value ? mainToStatusBucket(weather.value.main) : ''))
const matchedFilm = computed(() => (status.value ? filmForBucket(status.value) : ''))

const photoWindows = computed(() => {
  if (!detail.value?.forecast) return []
  const tz = weather.value?.timezoneOffset ?? 0
  return rankPhotoWindows(detail.value.forecast).map((win) => {
    const local = new Date(win.at + tz * 1000)
    return { ...win, label: `${local.getUTCMonth() + 1}/${local.getUTCDate()} ${String(local.getUTCHours()).padStart(2, '0')}시` }
  })
})

// 골든아워는 일출 직후·일몰 직전 1시간으로 계산, 일출/일몰·박명은 API가 준 시각 활용
const shiftHours = (iso, hours) => new Date(Date.parse(iso) + hours * 3600 * 1000).toISOString()

// 빛 시간대를 도시 현지 시각으로 표기
const sunRows = computed(() => {
  const sun = detail.value?.sun
  const tz = weather.value?.timezoneOffset ?? 0
  if (!sun) return []
  const hm = (iso) => toLocalHm(iso, tz)
  return [
    { label: '블루아워(아침)', value: `${hm(sun.civilTwilightBegin)}~${hm(sun.sunrise)}` },
    { label: '일출', value: hm(sun.sunrise) },
    { label: '골든아워(아침)', value: `${hm(sun.sunrise)}~${hm(shiftHours(sun.sunrise, 1))}` },
    { label: '골든아워(저녁)', value: `${hm(shiftHours(sun.sunset, -1))}~${hm(sun.sunset)}` },
    { label: '일몰', value: hm(sun.sunset) },
    { label: '블루아워(저녁)', value: `${hm(sun.sunset)}~${hm(sun.civilTwilightEnd)}` },
  ]
})
</script>

<template>
  <section class="detail-view">
    <template v-if="city">
      <p class="eyebrow">{{ city.country }} · {{ regionOf(city) }} 기상 관측</p>
      <WeatherHero :city="city" :weather="weather" :loading="loading" />

      <template v-if="weather">
        <dl>
          <div>
            <dt>현재 기온</dt>
            <dd>{{ configStore.toDisplayTemp(weather.temp) }}{{ configStore.unitSymbol }}</dd>
          </div>
          <div>
            <dt>날씨</dt>
            <dd>{{ status }} ({{ weatherDetailLabel(weather) }})</dd>
          </div>
          <div>
            <dt>습도</dt>
            <dd>{{ weather.humidity }}%</dd>
          </div>
          <div>
            <dt>구름량</dt>
            <dd>{{ weather.cloudsPercent }}%</dd>
          </div>
          <div>
            <dt>추천 필름</dt>
            <dd>{{ matchedFilm }}</dd>
          </div>
        </dl>

        <ExposureCalculator :weather="weather" />

        <section class="sub-block" v-if="photoWindows.length">
          <h3>사진 찍기 좋은 시간</h3>
          <p class="hint">예보 구간 중 구름 적고 대기오염 낮은 순.</p>
          <ul class="window-list">
            <li v-for="win in photoWindows" :key="win.at">
              {{ win.label }} — 구름 {{ win.cloudsPercent }}%,
              대기질 {{ win.aqi ? `${win.aqi}단계` : '정보 없음' }}
              <span class="score">점수 {{ win.score }}</span>
            </li>
          </ul>
        </section>

        <section class="sub-block" v-if="sunRows.length">
          <h3>빛 시간대</h3>
          <dl class="sun-grid">
            <div v-for="row in sunRows" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>
        </section>

        <section class="sub-block">
          <h3>필름 스트립</h3>
          <p class="hint">보유 필름 14종. 프레임에 마우스를 올리면 루페로 확대되고, 클릭하면 상세가 열립니다.</p>
          <FilmStrip />
        </section>
      </template>
    </template>

    <template v-else>
      <h2>도시 정보를 찾을 수 없습니다.</h2>
      <p>주소의 도시 이름이 현재 목록에 없습니다.</p>
    </template>

    <RouterLink to="/">대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.detail-view {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
}
.eyebrow {
  margin: 0;
  color: var(--weather-muted-text);
  font-size: 0.85rem;
}
h2 {
  margin: 0.35rem 0 1.25rem;
}
.eyebrow + .weather-hero {
  margin: 0.35rem 0 1.25rem;
}
dl {
  display: grid;
  gap: 0.75rem;
  margin: 0 0 1.5rem;
}
dl div {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
}
dt {
  color: var(--weather-muted-text);
}
dd {
  margin: 0;
}
.sub-block {
  margin-top: 1.5rem;
}
.sub-block h3 {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
}
.hint {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: var(--weather-muted-text);
}
.window-list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.85rem;
}
.window-list .score {
  color: var(--weather-muted-text);
  font-size: 0.78rem;
  margin-left: 0.4rem;
}
.sun-grid {
  display: grid;
  gap: 0.5rem;
  margin: 0;
}
.sun-grid div {
  grid-template-columns: 8rem 1fr;
}
</style>
