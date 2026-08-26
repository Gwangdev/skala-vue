// 도시 목록을 권역별로 묶고, 전체 도시 보기용 "지역별 대표 도시"를 뽑는 순수 함수 모음

export function groupByRegion(cities) {
  const order = []
  const byRegion = new Map()

  for (const city of cities) {
    if (!byRegion.has(city.region)) {
      byRegion.set(city.region, [])
      order.push(city.region)
    }
    byRegion.get(city.region).push(city)
  }

  return order.map((region) => ({ region, cities: byRegion.get(region) }))
}

// 지역별로 한 도시씩 뽑아 대표 목록을 만들되 라운드로빈 방식을 통해 데이터가 전부 소진된 지역 자동 대체
export function pickRepresentativeCities(cities, seenIds, targetCount) {
  const groups = groupByRegion(cities)
  const picked = []
  const pickedIds = new Set()

  const nextAvailable = (regionCities) =>
    regionCities.find((city) => !seenIds.has(city.id) && !pickedIds.has(city.id))

  let guard = 0
  const guardLimit = targetCount * groups.length + 1

  while (picked.length < targetCount && guard < guardLimit) {
    guard += 1
    let addedThisRound = false

    for (const group of groups) {
      if (picked.length >= targetCount) break
      const city = nextAvailable(group.cities)
      if (!city) continue
      pickedIds.add(city.id)
      picked.push(city)
      addedThisRound = true
    }

    if (!addedThisRound) break // 더 뽑을 도시가 없으면 종료
  }

  return picked
}
