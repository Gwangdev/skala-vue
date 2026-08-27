# skala-vue

SKALA **Vue.js** 교육과정 종합 실습 저장소

Vue 3 + Vite + Composition API 기반으로, 주제별 문법 실습과 **Weather 앱**을 단계적으로 구현하며 Vue의 특징을 익히고, 이를 응용·확장하여 각 도시별 현재 날씨에 따른 필름 추천 서비스를 만들었다.
Handson 순서대로 구현하고 테스트하며 불편한 점들을 고쳤고 해당 과정에서 추가로 도입하면 좋을 것 같은 기능들을 찾아서 구현했다.

- **배포 주소**: _Vercel 배포 후 갱신_
- **작성자**: Gwangdev(원광식)

---

## 실행 방법

```sh
npm install
npm run dev                # 개발 서버 (http://localhost:5173)
npm run build              # 프로덕션 빌드 → dist/
npm run build:staging      # --mode staging (.env.staging 로드)
npm run build:production   # --mode production (.env.production 로드)
npm run lint               # ESLint 검사
npm run format             # Prettier 포맷팅
```

API 키는 `.env`에 `VITE_OPENWEATHERMAP_API_KEY`로 넣는다(`.env.example` 참고, `.gitignore`로 추적 제외). 배포 시에는 호스트 환경변수로 주입한다.

---

## 폴더 구조

```
src/
├── App.vue                     # 라우터 셸(네비게이션 + RouterView)
├── main.js
├── assets/                     # base.css·main.css + film-tokens.css, frames/(필름 SVG)
├── components/exercise/        # 실습과제 컴포넌트
├── composables/  router/  services/  stores/  utils/
└── views/                      # 라우트별 페이지
docs/                           # 주제별 추가 학습기록
```

문법 연습 스크래치(`components/practices/`)는 제출물과 무관해 저장소 추적에서 제외했다(로컬에만 존재).

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
| 7   | Axios                   | Weather Axios       | [docs/07-weather-axios.md](docs/07-weather-axios.md)             |
| 8   | UI Libraries            | Weather UI Library  | [docs/08-weather-ui-library.md](docs/08-weather-ui-library.md)   |
| 9   | Vite Build & Deployment | Weather Deployment  | [docs/09-weather-deployment.md](docs/09-weather-deployment.md)   |

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
- 버그 수정: `/cities` 그리드 카드 hover 시 색이 새는 CSS 우선순위 문제

자세한 내용: [docs/06-weather-store.md](docs/06-weather-store.md)

---

### 7. Axios

목업 데이터로 만들었던 Weather 앱을 OpenWeatherMap API 데이터를 불러와서 활용하도록 바꾸고, 도시 목록을 16개국 91개로 확장함

**과제 세부개발 내용**

- 도시 데이터 분리: `data/cities.js`는 이름·국가·국가코드만 든 목록으로 남기고, 날씨 수치는 `stores/weatherStore.js`가 따로 채우도록 정적/동적 분리
- Weather API 조회: 예보·대기오염·일출/일몰 API가 전부 좌표를 요구하는 데이터라 `{name},{countryCode}`로 좌표를 먼저 구해 `/data/2.5/weather` 호출. 좌표는 모듈 캐시에 보관. 키 없음·호출 실패 시 도시 이름 시드 Mock 데이터로 폴백(`source` 배지로 구분)
- 비동기 로딩 처리: 날씨가 아직 없는 카드는 "불러오는 중" 표시, `Promise.all` 병렬 조회 도입, 무료 API 규약(분당 60건) 때문에 화면에 실제로 보이는 도시만 조회
- 추가 OWM API: 5일/3시간 예보 + 대기오염 예보를 상세 화면에 붙이고, 두 값을 합쳐 "사진 찍기 좋은 시간"을 점수화
- 기타 외부 API: sunrise-sunset.org(키 불필요)로 일출·일몰·시민박명을 받아 도시 현지 시각 골든아워·블루아워 표시
- 노출값(EV) 기반 필름 계산: 광량 조건 → EV100, 조리개·최대 셔터스피드로 최대 ISO 상한을 구해 보유 필름 14종을 좁힘

자세한 내용: [docs/07-weather-axios.md](docs/07-weather-axios.md)

---

### 8. UI Libraries

지역별 도시 찾기 팝업과 필름 확대 뷰를 Element Plus `el-dialog`로 처리하고, 검색 대시보드와 전체 도시 보기를 한 화면으로 합치면서 날씨 배너·필름 스트립을 붙임

**과제 세부개발 내용**

- 화면 병합: 실습7에서 도시가 91개로 늘며 검색 대시보드와 `/cities`가 사실상 같은 내용을 보여주게 되어, 두 화면을 검색 대시보드 하나로 합치고 `/cities` 라우트·`WeatherCitiesView`를 제거. 검색어가 없으면 최근 탐색·즐겨찾기와 국가별 대표 도시를 소제목으로 나눠 배치
- 라이브러리 선정: Element Plus를 골라 `main.js`에 전역 등록 + 기본 CSS 로드
- `el-dialog` 적용 — 지역별 도시 찾기 팝업, 필름 프레임 확대 뷰(`FilmLightbox`): 오버레이·ESC·포커스 트랩·스크롤 락·ARIA를 라이브러리가 처리, 내부 내용만 자체 마크업
- 검색 입력을 `el-input`(clearable)으로, Mock 데이터 폴백 알림을 `ElMessage` 토스트로 교체
- 날씨 배너(`WeatherHero`)와 필름 스트립(`FilmStrip` — 가로 드래그 스크롤 + 마우스 루페 + 클릭 확대) 이식. 루페·드래그·필름 그레인은 라이브러리에 대응 컴포넌트가 없어 자체 CSS·JS로 남김

자세한 내용: [docs/08-weather-ui-library.md](docs/08-weather-ui-library.md)

---

### 9. Vite Build & Deployment

ESLint 에러를 없애고, 문법 연습 폴더를 저장소에서 빼고, 모드별 빌드 스크립트와 Vercel 배포 설정을 붙임

**과제 세부개발 내용**

- ESLint: 남은 에러는 전부 `components/practices/`(문법 연습)에서 나와, 이 폴더를 저장소 추적에서 빼고(`git rm --cached` + `.gitignore`) 린트 대상에서도 제외. 본 실습 코드는 에러 0
- 환경변수: `.env`(실제 키)는 추적 제외 유지, `.env.staging`·`.env.production`에 `VITE_APP_MODE` 라벨만 두고 `build:staging`·`build:production` 스크립트 추가. About 화면에 빌드 모드 표시
- 빌드: `npm run build` → `dist/`에 해시 붙은 정적 파일 생성 확인
- 배포(Vercel): history 모드라 `vercel.json`에 SPA fallback rewrite 추가. 루트 배포라 `base`는 기본값 유지. 저장소 연결·키 입력·배포는 대시보드에서 직접

자세한 내용: [docs/09-weather-deployment.md](docs/09-weather-deployment.md)
