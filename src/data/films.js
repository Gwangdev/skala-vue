// 필름 스톡 목록. 
// speedTier: 감도 구간 라벨(실제 ISO 숫자와 별개 — "몇 단 감도대인가"로 묶어 비교)
// light: 제 성능을 내는 광량 구간(bright / soft / dim)
// colorProfile: 같은 감도 구간에서 색 성격으로 한 번 더 좁히는 값
// (warm / cool / vivid / natural / bw) — tone 설명을 필터 가능한 형태로 압축한 것.

export const films = [
  // --- iso50 구간 (강한 직사광 전용, 2종) ---
  {
    id: 'velvia50',
    name: 'Fujifilm Velvia 50',
    iso: 50,
    speedTier: 'iso50',
    light: 'bright',
    colorProfile: 'vivid',
    tone: '초고채도 슬라이드',
    note: '풍경용 슬라이드 필름. 관용도가 좁아 노출이 정확해야 하고 빛이 많이 필요하다.',
  },
  {
    id: 'panf50',
    name: 'Ilford Pan F Plus 50',
    iso: 50,
    speedTier: 'iso50',
    light: 'bright',
    colorProfile: 'bw',
    tone: '흑백·초미세입자',
    note: '흑백 중 입자가 가장 곱다. 감도가 낮아 맑은 날 야외가 아니면 셔터스피드가 급격히 느려진다.',
  },

  // --- iso100 구간 (맑은 날 기준, 3종) ---
  {
    id: 'ektar100',
    name: 'Kodak Ektar 100',
    iso: 100,
    speedTier: 'iso100',
    light: 'bright',
    colorProfile: 'vivid',
    tone: '고채도·미세입자',
    note: '입자가 가장 곱고 색이 진하다. 광량이 충분해야 하므로 흐린 날에는 불리하다.',
  },
  {
    id: 'provia100f',
    name: 'Fujifilm Provia 100F',
    iso: 100,
    speedTier: 'iso100',
    light: 'bright',
    colorProfile: 'cool',
    tone: '슬라이드·차가운 발색',
    note: '슬라이드 필름 특성상 노출 관용도가 좁다. 맑은 날 파란 톤이 또렷하게 산다.',
  },
  {
    id: 'fp4plus125',
    name: 'Ilford FP4 Plus 125',
    iso: 125,
    speedTier: 'iso100',
    light: 'bright',
    colorProfile: 'bw',
    tone: '흑백·범용 중간톤',
    note: '실제 감도는 125지만 100 구간과 같이 묶어도 노출 차이가 크지 않은 범용 흑백 필름.',
  },

  // --- iso200 구간 (맑음~옅은 구름, 2종) ---
  {
    id: 'gold200',
    name: 'Kodak Gold 200',
    iso: 200,
    speedTier: 'iso200',
    light: 'bright',
    colorProfile: 'warm',
    tone: '황금빛 채도',
    note: '햇빛이 강한 낮에 노란기가 두드러진다. 맑은 날 야외에서 가장 자기다운 색이 나온다.',
  },
  {
    id: 'fujicolorc200',
    name: 'Fujifilm Fujicolor C200',
    iso: 200,
    speedTier: 'iso200',
    light: 'bright',
    colorProfile: 'natural',
    tone: '자연스러운 중간 채도',
    note: 'Gold 200보다 채도가 차분해서, 같은 광량이라도 더 사실적인 색을 원할 때 대체재가 된다.',
  },

  // --- iso400 구간 (구름 낀 하늘, 가장 무난한 범용대, 4종) ---
  {
    id: 'portra400',
    name: 'Kodak Portra 400',
    iso: 400,
    speedTier: 'iso400',
    light: 'soft',
    colorProfile: 'warm',
    tone: '따뜻한 중간톤',
    note: '관용도가 넓어 노출을 조금 놓쳐도 살아난다. 인물 피부톤 기준으로 설계된 필름.',
  },
  {
    id: 'pro400h',
    name: 'Fujifilm Pro 400H',
    iso: 400,
    speedTier: 'iso400',
    light: 'soft',
    colorProfile: 'cool',
    tone: '차가운 파스텔',
    note: '흐린 하늘의 푸른기를 그대로 받아낸다. 대비가 낮아 부드럽게 떨어진다.',
  },
  {
    id: 'hp5',
    name: 'Ilford HP5 Plus',
    iso: 400,
    speedTier: 'iso400',
    light: 'soft',
    colorProfile: 'bw',
    tone: '흑백·중간 대비',
    note: '증감에 관대해 광량이 애매할 때 기준으로 삼기 좋은 흑백 필름.',
  },
  {
    id: 'ultramax400',
    name: 'Kodak UltraMax 400',
    iso: 400,
    speedTier: 'iso400',
    light: 'soft',
    colorProfile: 'vivid',
    tone: '선명한 스냅 컬러',
    note: 'Portra 400보다 대비와 채도가 강해서, 흐린 날에도 색이 죽지 않길 원할 때 고른다.',
  },

  // --- iso800 구간 (흐림~실내, 3종) ---
  {
    id: 'cinestill800t',
    name: 'CineStill 800T',
    iso: 800,
    speedTier: 'iso800',
    light: 'dim',
    colorProfile: 'warm',
    tone: '텅스텐·할레이션',
    note: '인공광 아래 색온도를 맞춘 영화용 필름. 광원 주변에 붉은 번짐이 남는다.',
  },
  {
    id: 'portra800',
    name: 'Kodak Portra 800',
    iso: 800,
    speedTier: 'iso800',
    light: 'dim',
    colorProfile: 'warm',
    tone: '따뜻한 저조도',
    note: 'Portra 400의 저조도 버전. 실내·해질녘처럼 빛이 줄어드는 상황에서 톤을 유지한다.',
  },
  {
    id: 'superiax800',
    name: 'Fujifilm Superia X-TRA 800',
    iso: 800,
    speedTier: 'iso800',
    light: 'dim',
    colorProfile: 'natural',
    tone: '녹색조 강조',
    note: '흐린 날씨나 실내에서 녹색·자연광 계열 색이 두드러지는 소비자용 필름.',
  },
]

// 도시별 날씨 보여줄때 간단하게 추천해주는 대표 필름 정리
const REPRESENTATIVE_BY_BUCKET = { 맑음: 'ektar100', 흐림: 'hp5', 비: 'cinestill800t' }

export function filmForBucket(bucket) {
  const film = films.find((item) => item.id === REPRESENTATIVE_BY_BUCKET[bucket])
  return film ? `${film.name} — ${film.tone}` : '추천 필름 준비 중'
}
