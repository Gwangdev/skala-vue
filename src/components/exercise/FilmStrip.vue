<script setup>
// 필름 스트립 전체 — 가로 나열 + 드래그 스크롤 + 클릭 시 라이트박스 적용
import { ref } from 'vue'
import { films } from '@/data/films.js'
import FilmFrame from './FilmFrame.vue'
import FilmLightbox from './FilmLightbox.vue'

const trackEl = ref(null)
const isDragging = ref(false)
const dragMoved = ref(false)
const dragStartX = ref(0)
const scrollStartLeft = ref(0)

const expandedFilm = ref(null)

const startDrag = (event) => {
  isDragging.value = true
  dragMoved.value = false
  dragStartX.value = event.clientX
  scrollStartLeft.value = trackEl.value.scrollLeft
}

const onDrag = (event) => {
  if (!isDragging.value) return
  const delta = event.clientX - dragStartX.value
  // 3px 미만 움직임은 클릭으로 취급(드래그 판정과 클릭 판정이 서로를 가리지 않게)
  if (Math.abs(delta) > 3) dragMoved.value = true
  trackEl.value.scrollLeft = scrollStartLeft.value - delta
}

const endDrag = () => {
  isDragging.value = false
}

// 프레임 클릭 시 작동 -> 방금 드래그가 있었으면 클릭으로 넘기지 않음
const handleExpand = (film) => {
  if (dragMoved.value) return
  expandedFilm.value = film
}
</script>

<template>
  <div class="film-strip">
    <div
      ref="trackEl"
      class="track"
      :class="{ dragging: isDragging }"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <FilmFrame v-for="film in films" :key="film.id" :film="film" @expand="handleExpand" />
    </div>

    <FilmLightbox :film="expandedFilm" @close="expandedFilm = null" />
  </div>
</template>

<style scoped>
.film-strip {
  padding: 1.25rem;
  border-radius: var(--film-radius-lg);
  background: var(--film-surface-0);
}

.track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0.25rem 1rem;
  cursor: grab;
  scrollbar-width: thin;
}

.track.dragging {
  cursor: grabbing;
  user-select: none;
}

.track::-webkit-scrollbar {
  height: 6px;
}

.track::-webkit-scrollbar-thumb {
  background: var(--film-surface-300);
  border-radius: 3px;
}
</style>
