// 예보 슬롯 중 "사진 찍기 좋은 시간"을 고름. 사용자가 정한 기준 두 가지:
// 구름이 적을수록 우수, 대기오염(AQI 1~5)이 낮을수록 우수. 낮 시간대(6~19시)만 후보.
const DAY_START = 6
const DAY_END = 19

function slotScore(slot) {
  const clearScore = 100 - slot.cloudsPercent
  // aqi가 없으면(목/누락) 중립값 50으로 둠
  const airScore = slot.aqi ? ((5 - slot.aqi) / 4) * 100 : 50
  return Math.round(clearScore * 0.6 + airScore * 0.4)
}

export function rankPhotoWindows(forecastSlots, limit = 3) {
  return forecastSlots
    .filter((slot) => slot.hour >= DAY_START && slot.hour <= DAY_END)
    .map((slot) => ({ ...slot, score: slotScore(slot) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// UTC ISO 문자열 + 도시 타임존 오프셋(초) → "HH:MM" 현지 시각 표기.
export function toLocalHm(isoUtc, timezoneOffsetSec) {
  const shifted = new Date(Date.parse(isoUtc) + timezoneOffsetSec * 1000)
  const hh = String(shifted.getUTCHours()).padStart(2, '0')
  const mm = String(shifted.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
