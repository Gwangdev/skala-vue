# skala-vue

SKALA **Vue.js** 교육과정 종합 실습 저장소

Vue 3 + Vite + Composition API 기반으로, 주제별 문법 실습과 **Weather 앱**을 단계적으로 구현하며
Vue의 특징을 익히고, 이를 응용·확장하여 각 도시별 현재 날씨에 따른 필름 추천 서비스를 만들었다.

- **배포 주소**: undefined
- **작성자**: Gwangdev(원광식)

---

## 실행 방법

```sh
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run lint     # ESLint 검사
npm run format   # Prettier 포맷팅
```

---

## 폴더 구조

```
src/
├── App.vue                     # 실습 컴포넌트 진입점
├── main.js
├── assets/                     # base.css(색상 변수·리셋) + main.css(레이아웃)
├── components/
│   ├── practices/              # 주제별 코드 챌린지 아카이브
│   │   ├── basic/              #  Vue Syntax — directive
│   │   ├── composition/        #  Composition API
│   │   ├── component/          #  Components
│   │   └── library/            #  Pinia / UI Library
│   └── exercise/               # 실습과제 저장소
├── stores/                     # Pinia
└── docs/                       # 주제별 추가 학습기록
```

`practices/`는 문법 연습자료 아카이브, `exercise/`는 실습과제 성과품의 저장소로 활용

---

## 실습과제 리스트

| #   | 주제                    | 실습명              | 상세                                                             |
| --- | ----------------------- | ------------------- | ---------------------------------------------------------------- |
| 1   | Project Scaffolding     | 프로젝트 스캐폴딩   | [docs/01-scaffolding.md](docs/01-scaffolding.md)                 |
| 2   | Vue Syntax              | Weather Mockup      | [docs/02-weather-mockup.md](docs/02-weather-mockup.md)           |
| 3   | Composition API         | Weather Composition | [docs/03-weather-composition.md](docs/03-weather-composition.md) |
| 4   | Vue Components          | Weather Component   | [docs/04-weather-component.md](docs/04-weather-component.md)     |
| 5   | Vue Router              | Weather Router      | [docs/05-weather-router.md](docs/05-weather-router.md)           |
| 6   | Pinia                   | Weather Store       | [docs/06-weather-store.md](docs/06-weather-store.md)             |
| 7   | Axios                   | Weather Axios       | _진행 예정_                                                      |
| 8   | UI Libraries            | Weather UI Library  | _진행 예정_                                                      |
| 9   | Vite Build & Deployment | Weather Deployment  | _진행 예정_                                                      |

---

### 1. Project Scaffolding

`npm create vue@latest`로 생성한 기본 프로젝트에서 불필요한 default 파일들은 제거해서 Scaffolding 완료

**과제 세부개발 내용**

- Vite 기본 템플릿 산출물 제거 — `HelloWorld` / `TheWelcome` / `WelcomeItem` / `components/icons`(아이콘 6종) / `assets/logo.svg`
- `App.vue`를 로고·네비게이션 껍데기에서 **실습 컴포넌트 진입점**으로 재작성. 주제별 `<section>`으로 그룹화
- `assets/main.css`의 2단 그리드 레이아웃을 900px 단일 컬럼으로 교체 (실습 컴포넌트가 세로로 쌓이는 구조에 맞춤). `base.css`의 색상 변수·리셋은 유지
- 라우터 미사용 구간 정리 — 라우터 실습때 다시 재구성하기 위해 의도적으로 해당 코드 및 기능 제거
- `components/practices/`(문법 실습) / `components/exercise/`(Weather 앱) 2계층 분리
- `.gitignore`에 `.env*` 추가 — 나중에 쓸 OpenWeatherMap API 키가 저장소에 올라가지 않도록 사전 차단

자세한 내용: [docs/01-scaffolding.md](docs/01-scaffolding.md)

---

### 2. Vue Syntax

`v-for` / `v-if` / `:value`+`@input` / 이벤트 수식어를 한 화면(`WeatherMockup.vue`)에서 구현함

**과제 세부개발 내용**

- 도시 데이터 3개 → 6개(본인 연고지 포함) 확장, `humidity`/`icon` 필드 추가
- 25도 기준 카드 배경색 분기 (`:class`)
- 즐겨찾기 ⭐ 토글 + "즐겨찾기만 보기" 필터(`v-model` 체크박스) — 상태는 배열 기반(`includes`/`filter`), 강의 범위 밖인 `Set`은 배열로 교체
- 검색어가 비었을 때 "전체 N개 도시" 안내 (`v-if`)
- 이벤트 다양화: 카드 호버 확대·배경색 변화(`@mouseenter`/`@mouseleave`), 검색 `Enter` 확정(`@submit.prevent`), `Esc` 초기화(`@keyup.esc`)
- 그 외 안 쓰던 디렉티브(`v-show`/`v-once`/`v-pre`/`v-cloak`/`v-text`/`v-html`)도 실제 쓰임이 있는 자리를 찾아 반영

자세한 내용: [docs/02-weather-mockup.md](docs/02-weather-mockup.md)

---

### 3. Composition API

`WeatherMockup.vue`를 복사해 `computed`/`watch`/`watchEffect`를 적용함

**과제 세부개발 내용**

- `filteredWeatherList`를 통해서 검색어 포함 여부로 필터링하는 `computed` 도입
- 검색 결과를 3단계로 구분 (전체 / 결과 있음 / 결과 없음)
- `watch(selectedCity)` / `watchEffect(searchQuery)`를 활용하여 상태 변화를 콘솔 로그로 추적
- 추가 확장 아이디어: 날씨 상태별 추천 필름 매칭(`matchedFilm`) + 매칭 이력(`filmMatchLog`)

자세한 내용: [docs/03-weather-composition.md](docs/03-weather-composition.md)

---

### 4. Vue Components

`WeatherComposition.vue` 하나였던 화면을 `WeatherParent`/`BaseDashboardCard`/`SearchBar`/`WeatherCard` 4개의 컴포넌트로 분리함

**과제 세부개발 내용**

- 검색박스·리스트박스가 `BaseDashboardCard`의 슬롯을 공유하도록 카드 디자인 공통화
- `SearchBar`는 props(query)로 표시, 입력마다 `update-query` emit — 엔터 없이 실시간 필터링
- `WeatherCard`는 props(city)로 표시, `select-card`/`click-detail`/`toggle-favorite` emit
- Component 탐구: `WeatherCard`에 `variant` prop을 추가해 검색 목록(행)과 전체 도시 보기(타일) 양쪽에서 같은 컴포넌트를 재사용
- 기능 확장: 도시 데이터를 지역별 도시 수가 다르게(수도권 3~제주권 1) 13개로 확장, 전체 도시를 훑어보는 화면, 지역별 도시 찾기 팝업(`CityFinder`), 도시가 하나뿐인 지역이 소진되면 다른 지역 도시로 대표를 채우는 라운드로빈 로직 도입(`regionUtils.js`)
- 의문점: 서비스가 커졌을때도 `WeatherParent` 하나가 모든 데이터를 들고 자식에 내려주는 지금 구조가 적합한지 의문이 남음

자세한 내용: [docs/04-weather-component.md](docs/04-weather-component.md)

---

### 5. Vue Router

`WeatherParent` 하나였던 화면을 `views/` 페이지 컴포넌트로 나누고, 화면 전환을 Vue Router로 연결함

**과제 세부개발 내용**

- 라우트 구성: 검색 대시보드 `/`, 전체 도시 보기 `/cities`, 도시 상세 `/weather/:cityId`, 소개 `/about`, catch-all은 `NotFoundView`로 배열 마지막에 배치
- 모든 route를 지연 로딩(`() => import(...)`)으로 등록, `App.vue`에 `RouterLink` 내비게이션과 `RouterView` 배치
- 상세보기 이동 방식 변경: `window.alert()` 대신 `router.push('/weather/' + city.id)`로 이동. `WeatherDetailView`는 mount 시점에 `useRoute().params.cityId`로 같은 mock 데이터에서 도시를 찾도록 변경
- 추가적인 View 페이지 작성: 실습4에서 `viewMode` 로컬 상태로 전환하던 '전체 도시 보기'화면을 `/cities`로 분리해서 Route로 구현함
- 페이지 간 상태 공유: `WeatherHomeView`와 `WeatherCitiesView`는 서로 다른 컴포넌트 인스턴스라 로컬 상태로는 즐겨찾기·방문 이력이 페이지 이동마다 초기화되므로 `composables/useWeatherDashboard.js`에 상태를 모듈 단위로 선언해 두 페이지가 공유하도록 만듦
- 지연 로딩 효과 실측: 같은 라우트 설정을 정적 import로 바꿔 빌드해보니 `index.js` 하나 102.89 kB, 지연 로딩(현재)은 93.21 kB + 진입 페이지 청크로 쪼개짐 — 안 가본 페이지 코드는 실제로 그 경로에 들어갈 때만 받음
- 의문점: 모듈 단위 공유 상태는 페이지 이동 중엔 유지되지만 새로고침하면 초기화되므로 즐겨찾기·방문 이력을 새로고침 뒤에도 남기려면 별도의 장치가 필요해보임

자세한 내용: [docs/05-weather-router.md](docs/05-weather-router.md)

### 6. Pinia

온도 단위를 전역 상태로 관리하는 `configStore`를 만들고, `useWeatherDashboard`가 들고 있던 상태 중 새로고침 후에도 남아야 하는 값을 Pinia store로 옮김

**과제 세부개발 내용**

- `stores/configStore.js`: `unit`(state)/`unitSymbol`(getter)/`toggleUnit`(action)을 setup store 문법으로 작성, `UnitToggler`를 `App.vue` 내비게이션 옆에 배치
- 검색 대시보드·상세보기·전체 도시 보기의 온도 표시 세 자리 모두 단위 변환 적용, "더움" 판정은 원본 섭씨 기준 유지, 변환 계산은 store 쪽에 모아둠
- 즐겨찾기·방문 이력·검색어·선택 도시(페이지 간 전달 값)를 `stores/journeyStore.js`로 옮기고 `localStorage`에 동기화하여 새로고침해도 데이터가 남아있도록 개선함
- `configStore`에 컬러/흑백(`tone`) 토글 추가
- 리팩터링: 여러 store에 반복되던 localStorage 영속화 코드를 공용 composable로 통합, 컴포넌트별로 중복 정의되던 스타일도 공유로 정리
- 버그 수정: `WeatherDetailView`의 라우트 재사용 문제, `/cities` 그리드 카드 hover 시 색이 새는 CSS 우선순위 문제

자세한 내용: [docs/06-weather-store.md](docs/06-weather-store.md)
