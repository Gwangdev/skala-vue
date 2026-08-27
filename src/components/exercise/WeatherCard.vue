<script setup>
// 클릭·즐겨찾기·상세보기 이벤트 발생시 emit으로 WeatherParent에 전달

import { ref } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'

defineProps({
  city: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
  variant: { type: String, default: 'list' }, // 'list' | 'grid'
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const hovered = ref(false)
const configStore = useConfigStore()
// hot 판정은 표시 단위와 무관하게 원본 섭씨(city.temp) 기준 유지
</script>

<template>
  <div
    class="weather-card"
    :class="{ hot: city.temp >= 25, selected: isSelected, hovered, grid: variant === 'grid' }"
    @click="emit('select-card', city)"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <button class="favorite-btn" @click.stop="emit('toggle-favorite', city)">
      <span v-if="isFavorite">⭐</span>
      <span v-else>☆</span>
    </button>

    <template v-if="variant === 'grid'">
      <span class="icon">{{ city.icon }}</span>
      <strong class="temp">{{ configStore.toDisplayTemp(city.temp) }}{{ configStore.unitSymbol }}</strong>
      <span class="name">{{ city.name }}</span>
      <span class="region">{{ city.region }}</span>
      <span class="status">{{ city.status }}</span>
    </template>

    <template v-else>
      <h4>{{ city.icon }} {{ city.name }}</h4>
      <p>{{ configStore.toDisplayTemp(city.temp) }}{{ configStore.unitSymbol }} / 습도 {{ city.humidity }}%</p>
      <p>{{ city.status }}</p>
      <p v-if="city.temp >= 25" class="temp-hot">🔥 더움 (25도 이상)</p>
      <p v-else class="temp-cool">❄️ 선선함 (25도 미만)</p>
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
