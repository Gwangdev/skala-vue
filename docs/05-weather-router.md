# 5. Weather Router

> Vue Router로 화면 전환을 URL과 연결하는 실습. `WeatherParent.vue`를 `views/` 페이지로 재구성.

## 과제 요구사항 정리

1. **router/index.js**: 지연 로딩 route 등록, catch-all route를 배열 마지막에 배치
2. **App.vue**: `RouterLink` 내비게이션과 `RouterView` 배치
3. **WeatherHomeView.vue**: `WeatherParent` 대체, 상세보기를 `router.push()`로 이동
4. **WeatherDetailView.vue**: `:cityId` 동적 세그먼트로 mock 도시 정보 조회
5. **WeatherAboutView.vue** / **NotFoundView.vue**: 소개 페이지, 정의되지 않은 경로 처리
6. 개인적으로 추가한 view 작성 및 라우팅 — 전체 도시 보기를 `WeatherCitiesView.vue`로 분리

파일: `src/router/index.js`, `src/views/` 5개, `src/composables/useWeatherDashboard.js`

## 과제 세부 개발내용

- **라우트 구성**: 검색 대시보드 `/`, 전체 도시 보기 `/cities`, 도시 상세 `/weather/:cityId`, 소개 `/about`, catch-all은 `NotFoundView`로 배열 마지막에 배치
- **상세보기 이동 방식 변경**: `window.alert()` 대신 `router.push('/weather/' + city.id)`로 이동. `WeatherDetailView`는 mount 시점에 `useRoute().params.cityId`로 같은 mock 데이터에서 도시를 찾도록 변경
- **전체 도시 보기 라우트 승격**: 실습4에서 `viewMode` 로컬 상태로 전환하던 화면을 `/cities`로 분리해, 주소와 브라우저 뒤로 가기가 실제 화면 전환을 반영함
- **페이지 간 상태 공유**: `WeatherHomeView`와 `WeatherCitiesView`는 서로 다른 컴포넌트 인스턴스라 로컬 상태로는 즐겨찾기·방문 이력이 페이지 이동마다 초기화되므로 `composables/useWeatherDashboard.js`에 상태를 모듈 단위로 선언해 두 페이지가 공유하도록 만듦

## 추가 확장 아이디어

1. 라우트 설정 Lazy Loading 효과 실측
2. '전체 도시 보기'의 상태 공유 방식

### 지연 로딩 실측

같은 라우트 설정을 정적 import로 바꿔 빌드하고 번들 크기를 비교했다.

| 방식            | 첫 페이지 로드 시 받는 JS                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 정적 import     | `index.js` 하나, 102.89 kB(gzip 39.93 kB) — 안 가본 페이지 코드까지 포함                                                    |
| 지연 로딩(현재) | `index.js` 93.21 kB(gzip 36.53 kB) + 진입 페이지 청크(`WeatherHomeView` 4.10 kB) — 나머지는 실제로 그 경로에 들어갈 때 받음 |

지금 규모에선 차이가 몇 KB지만, 무거운 라우트가 섞인 큰 앱일수록 안 가본 페이지 코드를 미리 받지 않는 이점이 커질 것으로 예상됨.

### 페이지 분리와 상태 공유

화면이 하나였을 땐 `viewMode` 토글이라 즐겨찾기·방문 이력이 안 사라졌으나 페이지를 라우트로 나누면서 `WeatherHomeView`/`WeatherCitiesView`가 별도 인스턴스가 됐고, 각자 로컬 `ref`를 쓰면 페이지 이동마다 그 상태가 사라지는 것을 볼 수 있었음.
이를 해결하기 위해 ES 모듈이 한 번 평가되면 캐시된다는 점을 이용해 `useWeatherDashboard.js` 모듈 최상단에 상태를 선언, 어느 페이지에서 호출하든 같은 `ref` 인스턴스를 돌려받도록 구현했고 이를 검증하기 위해 서울을 즐겨찾기한 뒤 `/cities`로 이동해서 "최근 탐색 · 즐겨찾기" 목록에 그대로 남는 것을 확인함.

## 의문점 정리

모듈 단위 공유 상태는 페이지 이동 중엔 유지되지만 새로고침하면 초기화되므로 즐겨찾기·방문 이력을 새로고침 뒤에도 남기려면 별도의 장치가 필요해보임
