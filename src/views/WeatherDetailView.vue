<script setup>
// 현재 onMounted()를 통해서 라우트 주소를 받아오고 있지만 같은 라우트에서 cityId만 바뀌면 컴포넌트가 재사용돼 
// onMounted가 다시 실행되지 않으므로 나중에 city간 이동하는 링크가 추가되면 city.value가 갱신되지 않는 문제가 생길 것으로 예상됨.
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { weatherCities, filmMatches } from '@/data/weatherCities.js'

const route = useRoute()
const city = ref(null)

onMounted(() => {
  city.value = weatherCities.find((item) => item.id === route.params.cityId) ?? null
})
</script>

<template>
  <section class="detail-view">
    <template v-if="city">
      <p class="eyebrow">{{ city.region }} 기상 관측</p>
      <h2>{{ city.icon }} {{ city.name }}</h2>
      <dl>
        <div>
          <dt>현재 기온</dt>
          <dd>{{ city.temp }}°C</dd>
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
