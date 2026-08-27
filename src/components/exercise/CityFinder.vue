<script setup>
// 도시를 지역별로 묶어 보여주는 팝업. 오버레이·ESC·포커스 트랩·스크롤 락은 el-dialog가 맡고,
// 지역별 칩 목록만 자체 마크업으로 채움.
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  regions: { type: Array, required: true },
})

const emit = defineEmits(['close', 'select'])

// el-dialog는 v-model로 열림 상태를 양방향 바인딩하므로, 부모의 visible/close를 프록시로 연결
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    if (!value) emit('close')
  },
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="도시 찾기" width="28rem">
    <div class="region-list">
      <section v-for="group in regions" :key="group.region" class="region-block">
        <h4>{{ group.region }}</h4>
        <div class="city-chips">
          <button
            v-for="city in group.cities"
            :key="`${city.countryCode}-${city.name}`"
            type="button"
            class="city-chip"
            @click="emit('select', city)"
          >
            <span class="chip-country">{{ city.country }}</span>
            {{ city.name }}
          </button>
        </div>
      </section>
    </div>
  </el-dialog>
</template>

<style scoped>
.region-list {
  max-height: 60vh;
  overflow-y: auto;
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

.chip-country {
  font-size: 0.68rem;
  color: var(--weather-muted-text);
  margin-right: 0.35rem;
}
</style>
