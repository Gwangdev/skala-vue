<script setup>
import { ref } from 'vue'

// 과제 지문 활용 + 개수 추가
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, icon: '☀️' },
  { id: 'city_02', name: '부산', temp: 24, status: '흐림', humidity: 68, icon: '☁️' },
  { id: 'city_03', name: '제주', temp: 26, status: '비', humidity: 80, icon: '🌧️' },
  { id: 'city_04', name: '대전', temp: 22, status: '맑음', humidity: 50, icon: '☀️' },
  { id: 'city_05', name: '강릉', temp: 20, status: '흐림', humidity: 60, icon: '☁️' },
  { id: 'city_06', name: '광주', temp: 27, status: '맑음', humidity: 58, icon: '☀️' },
])

const searchQuery = ref('')
const confirmedQuery = ref('')
const selectedCity = ref('')
const hoveredCityId = ref('')
const favoritesOnly = ref(false)
const favorites = ref([])
const introHtml = ref('카드를 클릭하면 <strong>선택 도시</strong>가 하단 상태바에 표시됩니다.')

// 양방향 바인딩 및 한글 처리
const updateSearchQuery = (e) => {
  searchQuery.value = e.target.value
}

// @submit.prevent 대상: Enter로 검색어를 확정할 때 폼의 기본 새로고침 차단
const confirmSearch = () => {
  confirmedQuery.value = searchQuery.value
}

// @keyup.esc 대상: 검색창 선택 상태에서 ESC누르면 검색어 비우기
const clearSearch = () => {
  searchQuery.value = ''
  confirmedQuery.value = ''
}

const selectCity = (name) => {
  selectedCity.value = `${name}이(가) 선택되었습니다.`
}

// 상세보기 버튼에서 버블링 발생 방지 → 템플릿에서 @click.stop
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((favoriteId) => favoriteId !== id)
  } else {
    favorites.value.push(id)
  }
}
</script>

<template>
  <div v-cloak class="practice-section weather-mockup">
    <p v-once class="hint">이 안내문은 최초 렌더링 시 한 번만 표시됩니다 (v-once).</p>
    <p v-html="introHtml"></p>

    <h3>검색</h3>
    <form @submit.prevent="confirmSearch">
      <input
        type="text"
        :value="searchQuery"
        @input="updateSearchQuery"
        @keyup.esc="clearSearch"
        placeholder="도시 이름으로 검색 후 Enter"
      />
      <button type="submit">검색 확정</button>
    </form>
    <p v-text="'현재 검색어: ' + searchQuery"></p>
    <p v-if="confirmedQuery">Enter로 확정한 검색어: {{ confirmedQuery }}</p>
    <p v-if="!searchQuery">전체 {{ weatherList.length }}개 도시</p>

    <label>
      <input type="checkbox" v-model="favoritesOnly" />
      즐겨찾기만 보기
    </label>

    <h3>도시별 날씨</h3>
    <p class="hint" v-pre>카드 이름은 {{ item.name }} 형태의 mustache 문법으로 출력됩니다.</p>
    <div class="card-list">
      <div
        v-for="item in weatherList"
        v-show="!favoritesOnly || favorites.includes(item.id)"
        :key="item.id"
        class="weather-card"
        :class="{ hot: item.temp >= 25, hovered: hoveredCityId === item.id }"
        @click="selectCity(item.name)"
        @mouseenter="hoveredCityId = item.id"
        @mouseleave="hoveredCityId = ''"
      >
        <button class="favorite-btn" @click.stop="toggleFavorite(item.id)">
          <span v-if="favorites.includes(item.id)">⭐</span>
          <span v-else>☆</span>
        </button>
        <h4>{{ item.icon }} {{ item.name }}</h4>
        <p>{{ item.temp }}°C / 습도 {{ item.humidity }}%</p>
        <p>{{ item.status }}</p>
        <p v-if="item.temp >= 25" class="temp-hot">🔥 더움 (25도 이상)</p>
        <p v-else class="temp-cool">❄️ 선선함 (25도 미만)</p>
        <p v-show="hoveredCityId === item.id" class="tooltip">클릭하면 이 도시가 선택됩니다 →</p>
        <button @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </div>
    </div>

    <h3>상태바</h3>
    <p v-if="selectedCity" class="status-bar">{{ selectedCity }}</p>
    <p v-else class="status-bar">카드를 클릭해 도시를 선택하세요.</p>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none !important;
}

.hint {
  font-size: 0.8rem;
  color: #868e96;
}

.weather-mockup .card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0.75rem 0;
}

.weather-card {
  position: relative;
  width: 180px;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  background-color: #f0f6ff;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.weather-card.hot {
  background-color: #fff1ec;
}

.weather-card.hovered {
  background-color: #e7f5ff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transform: scale(1.05);
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
  color: #d9480f;
  font-weight: bold;
}

.temp-cool {
  color: #1971c2;
}

.tooltip {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #495057;
}

.status-bar {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: #f8f9fa;
}
</style>
