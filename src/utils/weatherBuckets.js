// OpenWeatherMap의 weather[0].main(Clear/Clouds/Rain/Snow/Mist…)을 기존 3버킷
// (맑음/흐림/비)으로 좁힘. 카드 표시·한 줄 필름 추천(films.js의 filmForBucket)이 이 3개
// 값만 씀. 노출 계산은 main과 clouds.all 원본을 그대로 쓰므로(utils/exposure.js) 여기서
// 뭉개도 그쪽 정밀도에는 영향 없음.
const RAIN_LIKE = ['Rain', 'Drizzle', 'Thunderstorm', 'Snow']

export function mainToStatusBucket(main) {
  if (RAIN_LIKE.includes(main)) return '비'
  if (main === 'Clear') return '맑음'
  return '흐림' // Clouds, Mist, Fog, Haze, Smoke, Dust 등
}

// 3버킷별 표시 이모지. 카드·상세 화면에서 공용.
const ICON_BY_BUCKET = { 맑음: '☀️', 흐림: '☁️', 비: '🌧️' }

export function iconForMain(main) {
  return ICON_BY_BUCKET[mainToStatusBucket(main)] ?? '🌤️'
}

// 버킷 옆 괄호에 넣을 부가 정보. 구름 계열(Clear/Clouds)은 구름량 %가 더 정확하고,
// 비·눈·안개는 강수량 같은 별도 수치가 없어 OWM 원본 설명(weather[0].description)을 그대로 씀.
export function weatherDetailLabel(weather) {
  if (!weather) return ''
  if (weather.main === 'Clear' || weather.main === 'Clouds') return `구름 ${weather.cloudsPercent}%`
  return weather.description
}
