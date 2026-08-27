// journeyStore/configStore 양쪽에서 반복되던 localStorage 불러오기·저장 로직 통합
import { ref, watch } from 'vue'

export function usePersistedRef(key, defaultValue, { parse, serialize = (value) => value } = {}) {
  const raw = localStorage.getItem(key)
  const state = ref(raw === null ? defaultValue : parse(raw))

  watch(
    state,
    (value) => {
      localStorage.setItem(key, serialize(value))
    },
    { deep: true },
  )

  return state
}
