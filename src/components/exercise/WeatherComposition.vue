<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

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
const selectedCityId = ref('')
const hoveredCityId = ref('')
const favoritesOnly = ref(false)
const favorites = ref([])
const introHtml = ref('카드를 클릭하면 <strong>선택 도시</strong>가 하단 상태바에 표시됩니다.')

// searchQuery가 바뀔 때만 재계산 - 도시 이름에 검색어가 포함된 항목만 필터링
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(keyword))
})

// 양방향 바인딩 및 한글 처리
const updateSearchQuery = (e) => {
  searchQuery.value = e.target.value
}

// watchEffect: 감시 대상을 따로 지정하지 않아도 내부에서 참조한 searchQuery를 자동 추적
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: ${searchQuery.value}`)
})

// @submit.prevent 대상: Enter로 검색어를 확정할 때 폼의 기본 새로고침 차단
const confirmSearch = () => {
  confirmedQuery.value = searchQuery.value
}

// @keyup.esc 대상: 검색창 선택 상태에서 ESC누르면 검색어 비우기
const clearSearch = () => {
  searchQuery.value = ''
  confirmedQuery.value = ''
}

const selectCity = (item) => {
  selectedCity.value = `${item.name}이(가) 선택되었습니다.`
  selectedCityId.value = item.id
}

// watch: selectedCity를 감시 - 상태바 문구가 바뀔 때만 실행되고 이전/현재 값을 함께 받음
watch(selectedCity, (newValue, oldValue) => {
  console.log(`[watch] 상태바 문구 변경: [${oldValue}] → [${newValue}]`)
})

// 날씨 상태별(맑음/흐림/비) 특징을 고려해서 추천 필름 매칭
const FILM_MATCH = {
  맑음: '코닥 포트라 400 — 쨍한 대비, 선명한 채도',
  흐림: '일포드 HP5 (흑백) — 부드러운 톤, 인물 사진에 적합',
  비: '시네스틸 800T — 고감도, 저조도 대응',
}

// selectedCityId가 바뀔 때만 재계산 — 선택된 도시의 날씨 상태에 맞는 필름 추천
const matchedFilm = computed(() => {
  const city = weatherList.value.find((item) => item.id === selectedCityId.value)
  if (!city) return ''
  return FILM_MATCH[city.status] ?? '추천 필름 준비 중'
})

const filmMatchLog = ref([])

// watch: matchedFilm(파생값)을 감시 - 새로 매칭될 때마다 히스토리에 누적, 최근 5개만 유지
watch(matchedFilm, (newFilm) => {
  if (!newFilm) return
  filmMatchLog.value = [`${selectedCity.value} ${newFilm}`, ...filmMatchLog.value].slice(0, 5)
})

// 상세보기 버튼에서 버블링 발생 방지 - 템플릿에서 @click.stop 처리
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
  <div v-cloak class="practice-section weather-composition">
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
    <p v-else-if="filteredWeatherList.length === 0">검색 결과와 일치하는 도시가 없습니다.</p>
    <p v-else>검색 결과 {{ filteredWeatherList.length }}개 도시</p>

    <label>
      <input type="checkbox" v-model="favoritesOnly" />
      즐겨찾기만 보기
    </label>

    <h3>도시별 날씨</h3>
    <p class="hint" v-pre>카드 이름은 {{ item.name }} 형태의 mustache 문법으로 출력됩니다.</p>
    <div class="card-list">
      <div
        v-for="item in filteredWeatherList"
        v-show="!favoritesOnly || favorites.includes(item.id)"
        :key="item.id"
        class="weather-card"
        :class="{ hot: item.temp >= 25, hovered: hoveredCityId === item.id }"
        @click="selectCity(item)"
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

    <h3>오늘 날씨에 맞는 필름 추천</h3>
    <p v-if="matchedFilm" class="status-bar">🎞️ {{ matchedFilm }}</p>
    <p v-else class="status-bar">도시를 선택하면 추천 필름을 안내합니다.</p>
    <ul v-if="filmMatchLog.length" class="hint">
      <li v-for="(log, index) in filmMatchLog" :key="index">{{ log }}</li>
    </ul>
  </div>
</template>

<style src="@/assets/weather.css" scoped></style>
