<script setup>
// 도시를 지역별로 묶어 보여주는 팝업창 구현
defineProps({
  visible: { type: Boolean, default: false },
  regions: { type: Array, required: true },
})

const emit = defineEmits(['close', 'select'])
</script>

<template>
  <div v-if="visible" class="finder-overlay" @click.self="emit('close')">
    <div class="finder-panel">
      <header class="finder-header">
        <h3>도시 찾기</h3>
        <button type="button" class="close-btn" @click="emit('close')">✕</button>
      </header>
      <div class="region-list">
        <section v-for="group in regions" :key="group.region" class="region-block">
          <h4>{{ group.region }}</h4>
          <div class="city-chips">
            <button
              v-for="city in group.cities"
              :key="city.id"
              type="button"
              class="city-chip"
              @click="emit('select', city)"
            >
              {{ city.icon }} {{ city.name }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.finder-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.finder-panel {
  width: min(28rem, 90vw);
  max-height: 70vh;
  overflow-y: auto;
  background: var(--color-background);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.finder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.75rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.region-block {
  padding: 0.6rem 0;
}

.region-block h4 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: var(--weather-muted-text);
}

.city-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.city-chip {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  cursor: pointer;
}

.city-chip:hover {
  border-color: var(--weather-accent);
}
</style>
