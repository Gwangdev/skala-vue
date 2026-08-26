<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot 주입 실습</h2>
    <SlotNamedChild>
      <template v-slot:header>
        <h3>Child 주입 제목</h3>
      </template>
      <p>
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur consectetur neque
        dolorum dolore iste ullam, saepe eum alias et aspernatur."
      </p>
    </SlotNamedChild>
  </div>
</template>
