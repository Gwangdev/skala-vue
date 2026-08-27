<script setup>
// 클릭·즐겨찾기·상세보기 이벤트를 emit으로 상위에 전달. 날씨 수치는 weather prop으로 수신
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'
import { regionOf } from '@/data/cities.js'
import { mainToStatusBucket, iconForMain, weatherDetailLabel } from '@/utils/weatherBuckets.js'

const props = defineProps({
  city: { type: Object, required: true },
  weather: { type: Object, default: null },
  isFavorite: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
  variant: { type: String, default: 'list' }, // 'list' | 'grid'
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const hovered = ref(false)
const configStore = useConfigStore()

// hot 판정은 표시 단위와 무관하게 원본 섭씨 기준
const isHot = computed(() => props.weather != null && props.weather.temp >= 25)
const icon = computed(() => iconForMain(props.weather?.main))
const status = computed(() =>
  props.weather ? mainToStatusBucket(props.weather.main) : '불러오는 중',
)
const displayTemp = computed(() =>
  props.weather ? `${configStore.toDisplayTemp(props.weather.temp)}${configStore.unitSymbol}` : '—',
)
</script>

<template>
  <div
    class="weather-card"
    :class="{ hot: isHot, selected: isSelected, hovered, grid: variant === 'grid' }"
    @click="emit('select-card', city)"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <button class="favorite-btn" @click.stop="emit('toggle-favorite', city)">
      <span v-if="isFavorite">⭐</span>
      <span v-else>☆</span>
    </button>

    <template v-if="variant === 'grid'">
      <span class="icon">{{ icon }}</span>
      <strong class="temp">{{ displayTemp }}</strong>
      <span class="name">{{ city.name }}</span>
      <span class="region">{{ city.country }} · {{ regionOf(city) }}</span>
      <span class="status">{{ status }}</span>
    </template>

    <template v-else>
      <h4>{{ icon }} {{ city.name }}</h4>
      <p class="sub">{{ city.country }}</p>
      <template v-if="weather">
        <p>{{ displayTemp }} / 습도 {{ weather.humidity }}%</p>
        <p>{{ status }} ({{ weatherDetailLabel(weather) }})</p>
        <p v-if="isHot" class="temp-hot">🔥 더움 (25도 이상)</p>
        <p v-else class="temp-cool">❄️ 선선함 (25도 미만)</p>
      </template>
      <p v-else class="sub">날씨 불러오는 중…</p>
      <p v-show="hovered" class="tooltip">클릭하면 이 도시가 선택됩니다 →</p>
      <button class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</button>
    </template>
  </div>
</template>

<!-- 카드 기본 스타일은 weather.css 공유, 이 컴포넌트만의 상태(.selected/.detail-btn/grid)만 아래에 추가-->
<style src="@/assets/weather.css" scoped></style>

<style scoped>
.weather-card.selected {
  border-color: var(--weather-accent);
  border-width: 2px;
}

.sub {
  font-size: 0.78rem;
  color: var(--weather-muted-text);
}

.detail-btn {
  margin-top: 0.5rem;
}

.weather-card.grid {
  width: auto;
  min-height: 100px;
  padding: 0.85rem 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  background-color: var(--color-background-soft);
}

.weather-card.grid.hot,
.weather-card.grid.hovered {
  background-color: var(--color-background-soft);
}

.weather-card.grid .icon {
  font-size: 1.2rem;
}

.weather-card.grid .temp {
  font-size: 1.05rem;
}

.weather-card.grid .name {
  font-size: 0.9rem;
  font-weight: 600;
}

.weather-card.grid .region {
  font-size: 0.7rem;
  color: var(--weather-muted-text);
}

.weather-card.grid .status {
  font-size: 0.78rem;
  margin-top: auto;
}
</style>
