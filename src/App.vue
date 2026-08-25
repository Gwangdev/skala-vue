<script setup>
import VBind from '@/components/practices/basic/v-Bind.vue'
import VBindClass from '@/components/practices/basic/v-Bind-Class.vue'
import VBindStyle from '@/components/practices/basic/v-Bind-Style.vue'
import VText from '@/components/practices/basic/v-Text.vue'
import VHtml from '@/components/practices/basic/v-Html.vue'
import VHtmlXss from '@/components/practices/basic/v-Html-Xss.vue'
import VIf from '@/components/practices/basic/v-If.vue'
import VShow from '@/components/practices/basic/v-Show.vue'
import VFor from '@/components/practices/basic/v-For.vue'
import VPre from '@/components/practices/basic/v-Pre.vue'
import VCloak from '@/components/practices/basic/v-Cloak.vue'
import VOnce from '@/components/practices/basic/v-Once.vue'
import VMemo from '@/components/practices/basic/v-Memo.vue'
import VOnEventHandler from '@/components/practices/basic/v-onEventHandler.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'
import VModel from '@/components/practices/basic/v-Model.vue'
import FormElements from '@/components/practices/basic/FormElements.vue'
import ModelModifier from '@/components/practices/basic/ModelModifier.vue'
</script>

<template>
  <main>
    <h1>skala-vue 실습 (Day 2)</h1>

    <section>
      <h2>v-on (이벤트 핸들링)</h2>
      <VOnEventHandler />
      <EventObject />
      <EventModifier />
    </section>

    <section>
      <h2>v-model (폼 바인딩)</h2>
      <VModel />
      <FormElements />
      <ModelModifier />
    </section>

    <section>
      <h2>v-bind</h2>
      <VBind />
      <VBindClass />
      <VBindStyle />
    </section>

    <section>
      <h2>렌더링 / 조건 / 반복</h2>
      <VText />
      <VHtml />
      <VHtmlXss />
      <VIf />
      <VShow />
      <VFor />
    </section>

    <section>
      <h2>기타 디렉티브</h2>
      <VPre />
      <VCloak />
      <VOnce />
      <VMemo />
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
