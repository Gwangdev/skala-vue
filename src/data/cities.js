// 도시를 고를 때 Geocoding으로 받아 weatherApi 쪽에서 캐싱
// countryCode는 화면 그룹핑용이자, 동명 도시 충돌을 피하려고 Geocoding 쿼리
// (`{name},{countryCode}`)에 그대로 실어 보내는 값. 도시는 이름으로 식별(별도 id 없음)

// 16개국 91개. 15개국은 6개씩, 싱가포르만 도시국가라 단독 1개. 국가 선정은 한국관광공사
// 국민 해외관광객 상위 국가를 뼈대로, 유럽 6개국은 인지도 높은 여행지로 채움. 각국 안에서는
// 인지도 순으로 나열함

// 지역별 도시찾기 표시순서 부여
export const REGION_ORDER = ['동아시아', '동남아시아', '북미', '유럽']

// 국가코드 → 지역권. 도시마다 지역을 다시 적지 않고 국가 단위로만 관리.
export const REGION_BY_COUNTRY_CODE = {
  KR: '동아시아',
  JP: '동아시아',
  CN: '동아시아',
  TW: '동아시아',
  VN: '동남아시아',
  TH: '동남아시아',
  MY: '동남아시아',
  SG: '동남아시아',
  US: '북미',
  CA: '북미',
  FR: '유럽',
  IT: '유럽',
  ES: '유럽',
  GB: '유럽',
  DE: '유럽',
  CH: '유럽',
}

export const cityDirectory = [
  // 대한민국 (KR)
  { name: '서울', country: '대한민국', countryCode: 'KR' },
  { name: '부산', country: '대한민국', countryCode: 'KR' },
  { name: '제주', country: '대한민국', countryCode: 'KR' },
  { name: '강릉', country: '대한민국', countryCode: 'KR' },
  { name: '대전', country: '대한민국', countryCode: 'KR' },
  { name: '광주', country: '대한민국', countryCode: 'KR' },

  // 일본 (JP)
  { name: '도쿄', country: '일본', countryCode: 'JP' },
  { name: '오사카', country: '일본', countryCode: 'JP' },
  { name: '교토', country: '일본', countryCode: 'JP' },
  { name: '후쿠오카', country: '일본', countryCode: 'JP' },
  { name: '삿포로', country: '일본', countryCode: 'JP' },
  { name: '나고야', country: '일본', countryCode: 'JP' },

  // 베트남 (VN)
  { name: '다낭', country: '베트남', countryCode: 'VN' },
  { name: '하노이', country: '베트남', countryCode: 'VN' },
  { name: '호치민', country: '베트남', countryCode: 'VN' },
  { name: '나트랑', country: '베트남', countryCode: 'VN' },
  { name: '호이안', country: '베트남', countryCode: 'VN' },
  { name: '푸꾸옥', country: '베트남', countryCode: 'VN' },

  // 중국 (CN)
  { name: '상하이', country: '중국', countryCode: 'CN' },
  { name: '베이징', country: '중국', countryCode: 'CN' },
  { name: '광저우', country: '중국', countryCode: 'CN' },
  { name: '청두', country: '중국', countryCode: 'CN' },
  { name: '시안', country: '중국', countryCode: 'CN' },
  { name: '하얼빈', country: '중국', countryCode: 'CN' },

  // 태국 (TH)
  { name: '방콕', country: '태국', countryCode: 'TH' },
  { name: '치앙마이', country: '태국', countryCode: 'TH' },
  { name: '푸켓', country: '태국', countryCode: 'TH' },
  { name: '파타야', country: '태국', countryCode: 'TH' },
  { name: '끄라비', country: '태국', countryCode: 'TH' },
  { name: '코사무이', country: '태국', countryCode: 'TH' },

  // 대만 (TW)
  { name: '타이베이', country: '대만', countryCode: 'TW' },
  { name: '가오슝', country: '대만', countryCode: 'TW' },
  { name: '타이중', country: '대만', countryCode: 'TW' },
  { name: '화롄', country: '대만', countryCode: 'TW' },
  { name: '타이난', country: '대만', countryCode: 'TW' },
  { name: '지룽', country: '대만', countryCode: 'TW' },

  // 말레이시아 (MY)
  { name: '쿠알라룸푸르', country: '말레이시아', countryCode: 'MY' },
  { name: '페낭', country: '말레이시아', countryCode: 'MY' },
  { name: '조호바루', country: '말레이시아', countryCode: 'MY' },
  { name: '말라카', country: '말레이시아', countryCode: 'MY' },
  { name: '코타키나발루', country: '말레이시아', countryCode: 'MY' },
  { name: '랑카위', country: '말레이시아', countryCode: 'MY' },

  // 싱가포르 (SG)
  { name: '싱가포르', country: '싱가포르', countryCode: 'SG' },

  // 미국 (US)
  { name: '뉴욕', country: '미국', countryCode: 'US' },
  { name: '로스앤젤레스', country: '미국', countryCode: 'US' },
  { name: '샌프란시스코', country: '미국', countryCode: 'US' },
  { name: '라스베가스', country: '미국', countryCode: 'US' },
  { name: '호놀룰루', country: '미국', countryCode: 'US' },
  { name: '시애틀', country: '미국', countryCode: 'US' },

  // 캐나다 (CA)
  { name: '밴쿠버', country: '캐나다', countryCode: 'CA' },
  { name: '토론토', country: '캐나다', countryCode: 'CA' },
  { name: '몬트리올', country: '캐나다', countryCode: 'CA' },
  { name: '퀘벡시티', country: '캐나다', countryCode: 'CA' },
  { name: '캘거리', country: '캐나다', countryCode: 'CA' },
  { name: '오타와', country: '캐나다', countryCode: 'CA' },

  // 프랑스 (FR)
  { name: '파리', country: '프랑스', countryCode: 'FR' },
  { name: '니스', country: '프랑스', countryCode: 'FR' },
  { name: '리옹', country: '프랑스', countryCode: 'FR' },
  { name: '마르세유', country: '프랑스', countryCode: 'FR' },
  { name: '스트라스부르', country: '프랑스', countryCode: 'FR' },
  { name: '보르도', country: '프랑스', countryCode: 'FR' },

  // 이탈리아 (IT)
  { name: '로마', country: '이탈리아', countryCode: 'IT' },
  { name: '피렌체', country: '이탈리아', countryCode: 'IT' },
  { name: '베네치아', country: '이탈리아', countryCode: 'IT' },
  { name: '밀라노', country: '이탈리아', countryCode: 'IT' },
  { name: '나폴리', country: '이탈리아', countryCode: 'IT' },
  { name: '팔레르모', country: '이탈리아', countryCode: 'IT' },

  // 스페인 (ES)
  { name: '바르셀로나', country: '스페인', countryCode: 'ES' },
  { name: '마드리드', country: '스페인', countryCode: 'ES' },
  { name: '세비야', country: '스페인', countryCode: 'ES' },
  { name: '그라나다', country: '스페인', countryCode: 'ES' },
  { name: '발렌시아', country: '스페인', countryCode: 'ES' },
  { name: '빌바오', country: '스페인', countryCode: 'ES' },

  // 영국 (GB)
  { name: '런던', country: '영국', countryCode: 'GB' },
  { name: '에든버러', country: '영국', countryCode: 'GB' },
  { name: '맨체스터', country: '영국', countryCode: 'GB' },
  { name: '리버풀', country: '영국', countryCode: 'GB' },
  { name: '옥스퍼드', country: '영국', countryCode: 'GB' },
  { name: '바스', country: '영국', countryCode: 'GB' },

  // 독일 (DE)
  { name: '베를린', country: '독일', countryCode: 'DE' },
  { name: '뮌헨', country: '독일', countryCode: 'DE' },
  { name: '프랑크푸르트', country: '독일', countryCode: 'DE' },
  { name: '함부르크', country: '독일', countryCode: 'DE' },
  { name: '쾰른', country: '독일', countryCode: 'DE' },
  { name: '드레스덴', country: '독일', countryCode: 'DE' },

  // 스위스 (CH)
  { name: '취리히', country: '스위스', countryCode: 'CH' },
  { name: '인터라켄', country: '스위스', countryCode: 'CH' },
  { name: '루체른', country: '스위스', countryCode: 'CH' },
  { name: '제네바', country: '스위스', countryCode: 'CH' },
  { name: '체르마트', country: '스위스', countryCode: 'CH' },
  { name: '베른', country: '스위스', countryCode: 'CH' },
]

// 지역권 이름 조회 헬퍼. 도시 객체 하나만 있으면 지역권을 바로 얻도록.
export function regionOf(city) {
  return REGION_BY_COUNTRY_CODE[city.countryCode] ?? '기타'
}

// 이름으로 도시 객체 찾기. 라우트 파라미터·검색어에서 도시를 되찾을 때 공용으로 씀.
export function findCityByName(name) {
  return cityDirectory.find((city) => city.name === name) ?? null
}
