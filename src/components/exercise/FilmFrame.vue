<script setup>
// hover 이벤트가 발생하면 커서를 따라가는 원형 루페를 띄워서 그 지점만 확대하고,
// 클릭하면 부모로 expand를 올려 라이트박스를 띄움. 루페와 확대 뷰는 같은 이미지를
// 배율만 달리해서 재사용(별도 확대본 없음).
import { ref } from 'vue'

const props = defineProps({
  film: { type: Object, required: true },
})

const emit = defineEmits(['expand'])

const frameEl = ref(null)
const loupeActive = ref(false)
const loupeStyle = ref({})

// 루페 배율(값이 클수록 좁은 영역이 크게 보임)
const LOUPE_ZOOM = 2.6
const LOUPE_SIZE = 140

const moveLoupe = (event) => {
  const rect = frameEl.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 커서가 오른쪽으로 갈수록 배경은 왼쪽으로 밀려야 그 지점이 원 중앙에 옴 (부호 반전)
  const bgX = -(x * LOUPE_ZOOM - LOUPE_SIZE / 2)
  const bgY = -(y * LOUPE_ZOOM - LOUPE_SIZE / 2)

  loupeStyle.value = {
    left: `${x - LOUPE_SIZE / 2}px`,
    top: `${y - LOUPE_SIZE / 2}px`,
    // 따옴표로 감싸야 함 (Vite가 작은 SVG를 인라인 data URI로 넣는데, 그 안의 따옴표·괄호가
    // 따옴표 없는 url()에서는 토큰을 깨뜨림)
    backgroundImage: `url("${props.film.image}")`,
    backgroundSize: `${rect.width * LOUPE_ZOOM}px ${rect.height * LOUPE_ZOOM}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
  }
}
</script>

<template>
  <figure
    ref="frameEl"
    class="frame"
    @mouseenter="loupeActive = true"
    @mouseleave="loupeActive = false"
    @mousemove="moveLoupe"
    @click="emit('expand', film)"
  >
    <div class="sprockets top" aria-hidden="true"></div>

    <img :src="film.image" :alt="`${film.name} 샘플 프레임`" draggable="false" />

    <div class="sprockets bottom" aria-hidden="true"></div>

    <figcaption>
      <strong>{{ film.name }}</strong>
      <span>ISO {{ film.iso }}</span>
    </figcaption>

    <div v-if="loupeActive" class="loupe" :style="loupeStyle"></div>
  </figure>
</template>

<style scoped>
.frame {
  position: relative;
  flex: 0 0 auto;
  width: 220px;
  margin: 0;
  padding: 14px 10px;
  background: var(--film-surface-100);
  border-radius: var(--film-radius-md);
  box-shadow: var(--film-shadow-frame);
  cursor: zoom-in;
  user-select: none;
}

.frame img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: var(--film-radius-sm);
  pointer-events: none;
}

.sprockets {
  height: 8px;
  margin-bottom: 6px;
  background-image: radial-gradient(circle, var(--film-surface-0) 3px, transparent 3px);
  background-repeat: repeat-x;
  background-position: center;
  background-size: 16px 8px;
}

.sprockets.bottom {
  margin-top: 6px;
  margin-bottom: 0;
}

figcaption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 8px;
  font-size: 0.78rem;
  color: var(--film-text-muted);
}

figcaption strong {
  color: var(--film-text);
  font-size: 0.85rem;
}

.loupe {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3px solid var(--film-primary);
  box-shadow:
    0 0 0 2px var(--film-surface-0),
    0 8px 24px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  background-repeat: no-repeat;
}
</style>
