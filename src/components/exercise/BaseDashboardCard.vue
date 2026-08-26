<script setup>
// 검색박스와 리스트박스가 공유하는 카드 프레임(제목+테두리+패딩), 내용은 슬롯방식으로 Props 주입
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="dashboard-card">
    <h3 class="dashboard-card__title">{{ title }}</h3>
    <div class="dashboard-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.dashboard-card__title {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}
</style>
