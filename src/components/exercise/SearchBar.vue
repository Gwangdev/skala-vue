<script setup>
// 입력마다 update-query emit
defineProps({
  query: { type: String, default: '' },
})

const emit = defineEmits(['update-query'])

const updateQuery = (e) => {
  emit('update-query', e.target.value)
}

const clearQuery = () => {
  emit('update-query', '')
}
</script>

<template>
  <input
    type="text"
    :value="query"
    class="search-bar"
    placeholder="도시 이름으로 검색"
    @input="updateQuery"
    @keyup.esc="clearQuery"
  />
</template>

<style scoped>
.search-bar {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}
</style>
