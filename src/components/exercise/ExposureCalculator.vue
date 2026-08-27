<script setup>
// 선택 도시의 날씨를 광량 조건으로 바꾸고, 사용자가 고른 조리개·최대 셔터스피드로 "이 조건에서 과다노출 없이 쓸 수 있는 최대 ISO"를 구해 보유 필름 후보를 좁힘.
import { computed, ref } from 'vue'
import { films } from '@/data/films.js'
import { maxIsoForAperture, weatherToLightEV100, filmsWithinIso } from '@/utils/exposure.js'

const props = defineProps({
  weather: { type: Object, default: null },
})

// 필름카메라에서 흔히 쓰는 값을 배열로 제공
const APERTURE_OPTIONS = [1.2, 1.8, 2.8, 4, 5.6, 8, 11, 16]
const SHUTTER_OPTIONS = [1000, 2000, 4000, 8000]

const aperture = ref(2.8)
const maxShutterDenom = ref(2000)

const lightEV100 = computed(() =>
  props.weather
    ? weatherToLightEV100({ main: props.weather.main, cloudsPercent: props.weather.cloudsPercent })
    : null,
)

const maxIso = computed(() =>
  lightEV100.value === null
    ? null
    : maxIsoForAperture({
        lightEV100: lightEV100.value,
        aperture: aperture.value,
        maxShutterDenom: maxShutterDenom.value,
      }),
)

const candidates = computed(() =>
  maxIso.value === null ? [] : filmsWithinIso(films, maxIso.value),
)
</script>

<template>
  <div class="exposure-calc">
    <h4>노출 기반 필름 계산</h4>
    <p v-if="!weather" class="hint">날씨를 불러오면 그 광량 기준으로 계산합니다.</p>
    <template v-else>
      <div class="controls">
        <label>
          조리개
          <select v-model.number="aperture">
            <option v-for="value in APERTURE_OPTIONS" :key="value" :value="value">f/{{ value }}</option>
          </select>
        </label>
        <label>
          최대 셔터스피드
          <select v-model.number="maxShutterDenom">
            <option v-for="value in SHUTTER_OPTIONS" :key="value" :value="value">1/{{ value }}</option>
          </select>
        </label>
      </div>

      <p class="result">
        이 조건에서 과다노출 없이 쓸 수 있는 최대 ISO:
        <strong>{{ Math.floor(maxIso) }}</strong>
      </p>

      <p v-if="candidates.length === 0" class="hint">
        이 조리개·셔터 조합으로는 보유 필름 중 맞는 게 없습니다...
      </p>
      <ul v-else class="candidate-list">
        <li v-for="film in candidates" :key="film.id">
          {{ film.name }} (ISO {{ film.iso }}) — {{ film.tone }}
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.exposure-calc {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 6px;
}
.exposure-calc h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
}
.hint {
  margin: 0;
  font-size: 0.82rem;
  color: var(--weather-muted-text);
}
.controls {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}
.controls label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--weather-muted-text);
}
.result {
  font-size: 0.85rem;
  margin: 0 0 0.5rem;
}
.candidate-list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.82rem;
}
</style>
