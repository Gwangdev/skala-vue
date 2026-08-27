// 도시 목록을 권역별로 묶고, 전체 도시 보기용 "지역별 대표 도시"를 뽑는 순수 함수 모음
import { REGION_ORDER, REGION_BY_COUNTRY_CODE } from '@/data/cities.js'

export function groupByRegion(cities) {
  return REGION_ORDER.map((region) => ({
    region,
    cities: cities.filter((city) => REGION_BY_COUNTRY_CODE[city.countryCode] === region),
  })).filter((group) => group.cities.length > 0)
}

// 지역별로 한 도시씩 뽑아 대표 목록을 만들되 라운드로빈 방식을 통해 데이터가 전부 소진된 지역 자동 대체
export function pickRepresentativeCities(cities, seenNames, targetCount) {
  const countryCodes = [...new Set(cities.map((city) => city.countryCode))]
  const picked = []
  const pickedNames = new Set()

  const nextInCountry = (code) =>
    cities.find(
      (city) =>
        city.countryCode === code && !seenNames.has(city.name) && !pickedNames.has(city.name),
    )

  let guard = 0
  const guardLimit = targetCount * countryCodes.length + 1

  while (picked.length < targetCount && guard < guardLimit) {
    guard += 1
    let addedThisRound = false
    for (const code of countryCodes) {
      if (picked.length >= targetCount) break
      const city = nextInCountry(code)
      if (!city) continue
      pickedNames.add(city.name)
      picked.push(city)
      addedThisRound = true
    }
    if (!addedThisRound) break // 더 뽑을 도시가 없으면 종료
  }

  return picked
}
