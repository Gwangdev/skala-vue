<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { weatherCities, filmMatches } from '@/data/weatherCities.js'
import { useConfigStore } from '@/stores/configStore.js'

const route = useRoute()
const city = ref(null)
const configStore = useConfigStore()

// cityId만 바뀌는 라우트 이동은 컴포넌트를 재사용해 onMounted가 다시 안 돎 — params를 감시
watch(
  () => route.params.cityId,
  (cityId) => {
    city.value = weatherCities.find((item) => item.id === cityId) ?? null
  },
  { immediate: true },
)
</script>

<template>
  <section class="detail-view">
    <template v-if="city">
      <p class="eyebrow">{{ city.region }} 기상 관측</p>
      <h2>{{ city.icon }} {{ city.name }}</h2>
      <dl>
        <div>
          <dt>현재 기온</dt>
          <dd>{{ configStore.toDisplayTemp(city.temp) }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div>
          <dt>날씨</dt>
          <dd>{{ city.status }}</dd>
        </div>
        <div>
          <dt>습도</dt>
          <dd>{{ city.humidity }}%</dd>
        </div>
        <div>
          <dt>추천 필름</dt>
          <dd>{{ filmMatches[city.status] ?? '추천 필름 준비 중' }}</dd>
        </div>
      </dl>
    </template>
    <template v-else>
      <h2>도시 정보를 찾을 수 없습니다.</h2>
      <p>주소의 도시 코드가 현재 mock 데이터에 없습니다.</p>
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
</style>
