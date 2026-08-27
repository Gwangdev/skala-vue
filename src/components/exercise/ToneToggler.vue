<script setup>
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <button type="button" class="toggle-btn" @click="configStore.toggleTone">
    {{ configStore.tone === 'mono' ? '컬러로 보기' : '흑백으로 보기' }}
  </button>
</template>
