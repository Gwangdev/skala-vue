<script setup>
// 클릭·즐겨찾기·상세보기 이벤트 발생시 emit으로 WeatherParent에 전달

import { ref } from 'vue'

defineProps({
  city: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
  variant: { type: String, default: 'list' }, // 'list' | 'grid'
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const hovered = ref(false)
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
      <strong class="temp">{{ city.temp }}°C</strong>
      <span class="name">{{ city.name }}</span>
      <span class="region">{{ city.region }}</span>
      <span class="status">{{ city.status }}</span>
    </template>

    <template v-else>
      <h4>{{ city.icon }} {{ city.name }}</h4>
      <p>{{ city.temp }}°C / 습도 {{ city.humidity }}%</p>
      <p>{{ city.status }}</p>
      <p v-if="city.temp >= 25" class="temp-hot">🔥 더움 (25도 이상)</p>
      <p v-else class="temp-cool">❄️ 선선함 (25도 미만)</p>
      <p v-show="hovered" class="tooltip">클릭하면 이 도시가 선택됩니다 →</p>
      <button class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</button>
    </template>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  width: 180px;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--weather-card-bg);
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.weather-card.hot {
  background-color: var(--weather-hot-bg);
}

.weather-card.hovered {
  background-color: var(--weather-card-hover-bg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
}

.weather-card.selected {
  border-color: var(--weather-accent);
  border-width: 2px;
}

.favorite-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}

.temp-hot {
  color: var(--weather-hot-text);
  font-weight: bold;
}

.temp-cool {
  color: var(--weather-cool-text);
}

.tooltip {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--weather-secondary-text);
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

.weather-card.grid.hot {
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
