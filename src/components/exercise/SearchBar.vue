<script setup>
// 입력마다 update-query emit. clearable 지우기 버튼·포커스 스타일은 el-input이 처리.
defineProps({
  query: { type: String, default: '' },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <el-input
    :model-value="query"
    placeholder="도시 이름으로 검색"
    clearable
    @update:model-value="emit('update-query', $event)"
    @keyup.esc="emit('update-query', '')"
  />
</template>
