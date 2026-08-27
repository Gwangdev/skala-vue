// OpenWeatherMap 연동. Geocoding API로 좌표를 먼저 구하고 그 좌표로 날씨를 조회하는 2단계.
// 도시명 직접 조회(?q=)를 안 쓰는 이유: 예보·대기오염은 좌표만 받고(대기오염은 ?q= 자체가
// 없음) 일출/일몰 API도 좌표가 필요해서, 어차피 좌표를 한 번은 구해야 함. ?q=는 OWM 공식
// 문서에서도 deprecated. 좌표는 모듈 캐시에 담아 같은 도시를 다시 부를 때 호출을 아낌.
//
// API 키가 없거나(.env 미설정) 호출이 실패하면(갓 발급해 미활성 상태인 키 등) 목
// 데이터로 조용히 내려가 화면이 깨지지 않게 함. 모든 응답에 source('live'|'mock')를
// 실어 화면에서 구분 표시.
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const AIR_URL = 'https://api.openweathermap.org/data/2.5/air_pollution/forecast'

const hasApiKey = () => Boolean(API_KEY)

const coordCache = new Map()

// 같은 문자열은 항상 같은 정수로 — 목 데이터를 도시마다 고정되게 뽑는 용도. 암호 목적 아님.
function stableHash(input) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

const MOCK_CONDITIONS = [
  { main: 'Clear', description: '맑음', cloudsPercent: 5 },
  { main: 'Clear', description: '구름 조금', cloudsPercent: 25 },
  { main: 'Clouds', description: '구름 많음', cloudsPercent: 55 },
  { main: 'Clouds', description: '흐림', cloudsPercent: 85 },
  { main: 'Rain', description: '비', cloudsPercent: 90 },
]

// 실제 API가 없을 때 쓰는 목 날씨. 도시 이름을 시드로 써서 새로고침해도 같은 도시는
// 같은 결과가 나오게 함(Math.random이면 부를 때마다 값이 바뀌어 "이 도시는 이런 날씨"라는
// 감이 안 잡힘).
function mockWeatherFor(city) {
  const seed = stableHash(city.name + city.countryCode)
  const condition = MOCK_CONDITIONS[seed % MOCK_CONDITIONS.length]
  return {
    cityName: city.name,
    country: city.country,
    temp: 8 + (seed % 27),
    humidity: 35 + ((seed >> 3) % 45),
    main: condition.main,
    description: condition.description,
    cloudsPercent: condition.cloudsPercent,
    timezoneOffset: 0,
    source: 'mock',
  }
}

async function resolveCoord(city) {
  const key = `${city.name},${city.countryCode}`
  if (coordCache.has(key)) return coordCache.get(key)

  const response = await axios.get(GEO_URL, {
    params: { q: key, limit: 1, appid: API_KEY },
  })
  const [first] = response.data
  if (!first) throw new Error(`좌표를 찾지 못했습니다: ${city.name}`)
  const coord = { lat: first.lat, lon: first.lon }
  coordCache.set(key, coord)
  return coord
}

async function fetchLiveWeather(city) {
  const { lat, lon } = await resolveCoord(city)
  const { data } = await axios.get(WEATHER_URL, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return {
    cityName: city.name,
    country: city.country,
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    main: data.weather[0].main,
    description: data.weather[0].description,
    cloudsPercent: data.clouds?.all ?? 0,
    timezoneOffset: data.timezone ?? 0,
    source: 'live',
  }
}

// 도시 하나의 현재 날씨. 키가 없거나 호출이 실패하면 목으로 대체.
export async function getWeatherForCity(city) {
  if (!hasApiKey()) return mockWeatherFor(city)
  try {
    return await fetchLiveWeather(city)
  } catch (error) {
    console.warn(`[weatherApi] 실시간 조회 실패, 목으로 대체: ${city.name}`, error)
    return mockWeatherFor(city)
  }
}

// 목 예보: 3시간 간격 슬롯을 도시 시드로 고정 생성. 구름량이 낮과 밤으로 완만하게 흔들리게 함.
function mockForecast(city) {
  const seed = stableHash(city.name)
  const slots = []
  for (let i = 0; i < 16; i += 1) {
    const hour = (i * 3) % 24
    const daylight = hour >= 6 && hour <= 18
    const clouds = ((seed >> (i % 8)) % 60) + (daylight ? 0 : 20)
    slots.push({
      at: Date.parse('2026-01-01T00:00:00Z') + i * 3 * 3600 * 1000,
      hour,
      temp: 10 + ((seed >> i) % 18),
      cloudsPercent: Math.min(clouds, 100),
      aqi: 1 + ((seed >> (i % 5)) % 5),
    })
  }
  return slots
}

// 상세 화면용 — 5일/3시간 예보 + 대기오염 예보를 한 번에. 슬롯마다 가장 가까운
// 대기오염 예측치를 붙여 "사진 찍기 좋은 시간" 계산의 입력으로 씀.
export async function getCityForecast(city) {
  if (!hasApiKey()) return mockForecast(city)
  try {
    const { lat, lon } = await resolveCoord(city)
    const [forecast, air] = await Promise.all([
      axios.get(FORECAST_URL, { params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' } }),
      axios.get(AIR_URL, { params: { lat, lon, appid: API_KEY } }),
    ])
    const airList = air.data.list ?? []
    const aqiAt = (ts) => {
      let best = null
      let bestGap = Infinity
      for (const entry of airList) {
        const gap = Math.abs(entry.dt * 1000 - ts)
        if (gap < bestGap) {
          bestGap = gap
          best = entry
        }
      }
      return best?.main?.aqi ?? null
    }
    return forecast.data.list.slice(0, 16).map((slot) => {
      const at = slot.dt * 1000
      return {
        at,
        hour: new Date(at + (forecast.data.city.timezone ?? 0) * 1000).getUTCHours(),
        temp: Math.round(slot.main.temp),
        cloudsPercent: slot.clouds?.all ?? 0,
        aqi: aqiAt(at),
      }
    })
  } catch (error) {
    console.warn(`[weatherApi] 예보 조회 실패, 목으로 대체: ${city.name}`, error)
    return mockForecast(city)
  }
}

export { resolveCoord }
