// 노출값(EV) 기반 필름 감도 필터링. Vue에 의존하지 않는 순수 계산이라 화면 쪽에서는
// computed로 감싸 쓰기만 함. 배경 설계는 docs/07-weather-axios.md의 노출 계산 절 참고.

// 광량 조건별 EV100(ISO100 기준 노출값). Sunny 16 규칙 차트 값. weatherToLightEV100이
// OpenWeatherMap 응답을 이 표의 키로 매핑함.
export const LIGHT_EV100 = {
  sunny: 15, // 맑음, 뚜렷한 그림자
  hazy: 14, // 옅은 구름, 흐린 그림자
  cloudyBright: 13, // 흐림, 그림자 거의 없음
  cloudyDull: 12, // 짙은 흐림
  overcast: 11, // 완전 흐림 / 개방 그늘
}

/**
 * 주어진 조리개를 밝은 곳에서 그대로 쓰려고 할 때, 과다노출 없이 버틸 수 있는 상한 ISO.
 *
 * 물리적 관계: ISO를 올리면 같은 노출에 필요한 셔터 시간이 더 짧아진다(빛을 덜 받아도
 * 되므로). 카메라의 가장 빠른 셔터(1/maxShutterDenom)보다 더 짧은 시간이 필요해지는
 * 순간부터는 셔터로 더는 조절할 수 없어 무조건 과다노출이 된다. 이 함수는 그 경계선을
 * 구한다.
 *
 * @param {number} lightEV100 - 촬영 환경의 밝기. LIGHT_EV100의 값을 넣는다.
 * @param {number} aperture - 쓰고 싶은 조리개 값 (예: 1.2)
 * @param {number} maxShutterDenom - 카메라 최대 셔터스피드의 분모 (1/2000초 → 2000)
 * @returns {number} 과다노출 없이 쓸 수 있는 최대 ISO
 */
export function maxIsoForAperture({ lightEV100, aperture, maxShutterDenom }) {
  const t100 = aperture ** 2 / 2 ** lightEV100 // ISO100 기준 정노출 셔터 시간(초)
  return 100 * t100 * maxShutterDenom
}

// OpenWeatherMap 응답(weather[0].main, clouds.all)을 LIGHT_EV100 키로 바꿈. 갈리는
// 5단계는 관측치가 아니라 Sunny 16 차트의 통상 구간을 옮긴 근사값 — 정밀 측광 대체 아님.
export function weatherToLightEV100({ main, cloudsPercent }) {
  const heavyWeather = ['Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Fog']
  if (heavyWeather.includes(main)) return LIGHT_EV100.overcast
  if (main === 'Clear') return cloudsPercent < 10 ? LIGHT_EV100.sunny : LIGHT_EV100.hazy
  if (main === 'Clouds') return cloudsPercent < 60 ? LIGHT_EV100.cloudyBright : LIGHT_EV100.cloudyDull
  return LIGHT_EV100.cloudyBright // 알 수 없는 코드는 중간값으로 보수적으로 처리
}

/**
 * films 배열에서 maxIso 이하인 것만 골라, ISO가 높은(=상한에 가까운) 순으로 정렬한다.
 * 상한에 가까울수록 "그 조건에서 낼 수 있는 최대치를 쓴 감도"라 화질·입자 면에서
 * 여유가 가장 적은 대신, 관용도 안에서 가장 낮은 감도를 고른 선택이 된다.
 *
 * @param {Array} films - data/films.js의 films 배열
 * @param {number} maxIso - maxIsoForAperture()의 반환값
 * @returns {Array} 조건을 만족하는 필름만 남긴 배열
 */
export function filmsWithinIso(films, maxIso) {
  return films.filter((film) => film.iso <= maxIso).sort((a, b) => b.iso - a.iso)
}
