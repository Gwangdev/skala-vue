<script setup>
// 필름 프레임 클릭 시 뜨는 확대 뷰. 오버레이·ESC·포커스 트랩·스크롤 락은 el-dialog가 맡고,
// 여기 남은 건 내용(이미지 + ISO·톤·설명)만 정리
import { computed } from 'vue'

const props = defineProps({
  film: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const visible = computed({
  get: () => props.film !== null,
  set: (value) => {
    if (!value) emit('close')
  },
})
</script>

<template>
  <el-dialog v-model="visible" :title="film?.name ?? ''" width="42rem">
    <div v-if="film" class="lightbox-body">
      <img :src="film.image" :alt="`${film.name} 확대 이미지`" />
      <div class="info">
        <dl>
          <div>
            <dt>ISO</dt>
            <dd>{{ film.iso }}</dd>
          </div>
          <div>
            <dt>톤</dt>
            <dd>{{ film.tone }}</dd>
          </div>
        </dl>
        <p>{{ film.note }}</p>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.lightbox-body {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 260px);
  gap: 1.5rem;
}

.lightbox-body img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 8px;
}

.info dl {
  display: flex;
  gap: 1.25rem;
  margin: 0 0 1rem;
}

.info dt {
  font-size: 0.72rem;
  color: var(--weather-muted-text);
}

.info dd {
  margin: 0;
  font-weight: 600;
}

.info p {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--weather-muted-text);
}

@media (max-width: 640px) {
  .lightbox-body {
    grid-template-columns: 1fr;
  }
}
</style>
