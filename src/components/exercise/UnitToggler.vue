<script setup>
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <button type="button" class="toggle-btn" @click="configStore.toggleUnit">
    {{ configStore.unit === 'fahrenheit' ? '°C로 보기' : '°F로 보기' }}
  </button>
</template>
