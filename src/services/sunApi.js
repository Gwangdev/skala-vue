// sunrise-sunset.org — 일출·일몰·시민박명 시각. 키가 필요 없는 무료 공개 API라
// OpenWeatherMap 외 "기타 외부 API" 요건을 이걸로 채움. 좌표는 weatherApi의
// Geocoding 캐시를 재사용.
import axios from 'axios'
import { resolveCoord } from './weatherApi.js'

const SUN_URL = 'https://api.sunrise-sunset.org/json'

// 일출 전후·일몰 전후 1시간이 골든아워, 시민박명~일출 / 일몰~시민박명이 블루아워.
export async function getSunTimesForCity(city) {
  const { lat, lon } = await resolveCoord(city)
  const { data } = await axios.get(SUN_URL, {
    params: { lat, lng: lon, formatted: 0 },
  })
  if (data.status !== 'OK') throw new Error(`일출/일몰 조회 실패: ${city.name}`)
  const r = data.results
  return {
    sunrise: r.sunrise,
    sunset: r.sunset,
    civilTwilightBegin: r.civil_twilight_begin,
    civilTwilightEnd: r.civil_twilight_end,
  }
}
