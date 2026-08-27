# 6. Pinia

> 온도 단위를 관리하는 `configStore`를 만들고, `useWeatherDashboard.js`의 모듈 상태값 중 새로고침 후에도 남아야 하는 값을 Pinia store로 옮김

## 과제 요구사항 정리

1. `stores/configStore.js`: `unit`(state, 초기값 `'celsius'`) / `unitSymbol`(getter) / `toggleUnit`(action)
2. `UnitToggler.vue`: 단위를 바꾸는 버튼, 내비게이션 바 옆에 배치
3. 검색 대시보드(`WeatherHomeView`)·상세보기(`WeatherDetailView`)의 온도 표시에 단위 변환 적용
4. 본인만의 추가 Store 작성 또는 `configStore` 확장

파일: `src/stores/configStore.js`, `src/stores/journeyStore.js`,
`src/composables/usePersistedRef.js`, `src/components/exercise/UnitToggler.vue`, `src/components/exercise/ToneToggler.vue`

## 과제 세부 개발내용

- **configStore**: `unit`/`unitSymbol`/`toggleUnit`을 setup store 문법으로 작성(저장소 기존 관례 유지), `UnitToggler`를 `App.vue` 내비게이션 옆에 배치
- **온도 표시 변환**: `WeatherCard`(grid/list variant)·`WeatherDetailView` 세 군데 모두 적용. "더움" 판정은 표시 단위와 무관하게 원본 섭씨 기준 유지. 변환 계산 자체를 store 쪽에 모아두고 화면은 결과만 받아쓰는 구조로 정리
- **즐겨찾기·방문 이력의 Pinia 이관**(`journeyStore.js`): `useWeatherDashboard.js`의 모듈 상태 중 새로고침 후에도 남아야 하는 값만 옮기고 `localStorage`에 동기화. 여러 화면에 흩어진 즐겨찾기 판정 중복도 store 쪽 getter 하나로 정리. 이후 검색어·선택 도시(페이지 간 전달 값)도 같은 store로 옮기고, 관련 동작들의 입력 형태를 전부 도시 객체로 통일
- **컬러/흑백 토글**(`tone` state): 흑백 모드는 별도 팔레트 없이 화면 전체에 grayscale 필터를 걸어 채도만 제거. 컬러 모드 배색은 Blue #00B1D2 & Yellow #FDDB27 — 원색은 흰 배경 대비가 약해 텍스트 색만 같은 색조로 어둡게 조정
- **반복 패턴 정리**: 여러 store에서 localStorage 불러오기·저장 로직이 거의 같은 모양으로 반복되던 걸 공용 composable로 통합하고, 컴포넌트마다 따로 정의돼 있던 겹치는 스타일도 공유 파일로 정리
- **라우트 재사용 버그 수정**(`WeatherDetailView`): 실습5 때부터 주석으로 남겨둔 문제 — 같은 라우트에서 도시만 바뀌면 컴포넌트가 재사용돼 화면이 안 갱신될 수 있는 구조였음. 라우트 파라미터를 감시하는 방식으로 고침
- **그리드 카드 hover 버그 수정**(`/cities`): 무채색 배경 규칙과 hover 색상 규칙의 CSS 우선순위가 같아서, 최종 빌드 순서에 따라 hover 시 의도와 다르게 색이 들어올 수 있는 구조였음. 우선순위를 명확히 갈라서 순서와 무관하게 항상 무채색이 이기도록 고침
- **토글 버튼 문구 수정**: "온도 단위 °F"/"컬러"처럼 현재 상태만 보여주던 문구를 "°C로 보기"/"흑백으로 보기"처럼 클릭 결과를 보여주는 문구로 변경

## 추가 확장 아이디어

1. 온도 변환은 store처리해서 여러 페이지에 공통적용되게 처리
2. store 설계 판단
3. 중복해서 사용된 코드 정리

### 온도 변환 처리

store에 온도 단위 토글 정보를 넣은 김에, 화면 표시용 숫자 변환 계산도 같이 처리할 수 있는지 검토. 별도 계층을 따로 두지 않고 store 쪽 getter로 흡수, composable 없이 전역 관리로 정리함

### store 설계 판단

- **분리 기준**: 전역관리 할 때 새로고침하거나 페이지 이동 사이에도 유지돼야 하는 데이터(열람 이력, 즐겨찾기)만 store로 옮기고, 화면 전용 상태(검색 옵션, 필름 매칭 이력)는 해당 화면 컴포넌트로 남김. 검색어·선택 도시는 처음엔 화면 전용으로 봤는데, 다시 보니 페이지를 넘나들며 공유가 필요한 건 열람 이력·즐겨찾기와 똑같아서 결국 같은 store로 합침 — 그 store의 원본 데이터로 화면 배치를 계산하는 로직만 별도로 남김
- **컬러/흑백 토글**: 필름 테마에 맞춰 네거티브/포지티브 개념도 검토했지만, 화면 전체를 반전시키면 글자·버튼까지 뒤집혀 가독성이 나빠지는 걸 확인 후 일반적인 컬러/흑백으로 결정함. 흑백은 명암 구조를 남기고 채도만 지우는 필터라 전역 적용에도 안전해서 이쪽으로 방향을 잡음

### 리팩터링 — 중복 정리

여러 store에 걸쳐 localStorage 불러오기·저장 로직이 같은 모양으로 반복되는 게 보여서 공용 composable로 통합함.
토글 버튼 두 개와 카드 컴포넌트를 정리하는 김에 스타일 쪽도 살펴보니, 기존 공용 CSS 파일과 겹치는 카드 스타일, 두 버튼 사이의 CSS가 각각 중복돼 있어서 공유하도록 정리함.

## 의문점 정리

`usePersistedRef`는 매 변경마다 `localStorage.setItem`을 즉시 호출하도록 구현 했는데 `localStorage.setItem`은 동기 함수라 호출 시 아주 경미한 지연이 발생함.
지금 앱에선 상관없는 수준이지만, 네이버·카카오 같은 인기 앱에서는 동기 처리로 인한 지연이 체감될 수도 있겠다는 의문이 발생함 -> 디바운스라는 대안이 있다는 것을 확인, 추후 도입 여부 검토 예정
