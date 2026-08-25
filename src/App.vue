<script setup>
import WeatherComposition from '@/components/exercise/WeatherComposition.vue'
</script>

<template>
  <main>
    <h1>skala-vue — Weather 앱</h1>

    <section>
      <h2>Weather Composition (실습 3)</h2>
      <WeatherComposition />
    </section>
  </main>
</template>

<style scoped>
h1 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}

section {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

section h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}
</style>
