import test from 'node:test'
import assert from 'node:assert/strict'
import { nextTick } from 'vue'
import { useWeatherDashboard } from '../src/composables/useWeatherDashboard.js'

test('selecting a city records it once and adds its film match to the history', async () => {
  const dashboard = useWeatherDashboard()
  dashboard.selectCity({ id: 'city_01', name: '서울', status: '맑음' })
  dashboard.selectCity({ id: 'city_01', name: '서울', status: '맑음' })
  await nextTick()

  assert.deepEqual(dashboard.visitHistory.value, ['city_01'])
  assert.equal(dashboard.matchedFilm.value, '코닥 포트라 400 — 쨍한 대비, 선명한 채도')
  assert.equal(dashboard.filmMatchLog.value[0], '서울 → 코닥 포트라 400 — 쨍한 대비, 선명한 채도')
})
