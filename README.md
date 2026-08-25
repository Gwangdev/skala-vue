# skala-vue

SK AX SKALA — Full-stack Engineering / Frontend Framework **Vue.js** 교육과정(4일) 종합 실습 저장소.

Vue 3 + Vite + Composition API 기반으로, 주제별 문법 실습과 **Weather 앱**을 단계적으로 구현한다.

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

| #   | 주제                    | 실습명              | 상세                                                   |
| --- | ----------------------- | ------------------- | ------------------------------------------------------ |
| 1   | Project Scaffolding     | 프로젝트 스캐폴딩   | [docs/01-scaffolding.md](docs/01-scaffolding.md)       |
| 2   | Vue Syntax              | Weather Mockup      | [docs/02-weather-mockup.md](docs/02-weather-mockup.md) |
| 3   | Composition API         | Weather Composition | _진행 예정_                                            |
| 4   | Vue Components          | Weather Component   | _진행 예정_                                            |
| 5   | Vue Router              | Weather Router      | _진행 예정_                                            |
| 6   | Pinia                   | Weather Store       | _진행 예정_                                            |
| 7   | Axios                   | Weather Axios       | _진행 예정_                                            |
| 8   | UI Libraries            | Weather UI Library  | _진행 예정_                                            |
| 9   | Vite Build & Deployment | Weather Deployment  | _진행 예정_                                            |

---

### 1. Project Scaffolding

`npm create vue@latest`로 생성한 기본 프로젝트를, **본인이 작성한 코드만 화면에 남도록** 정리했다.

**Customization 요약**

- Vite 기본 템플릿 산출물 제거 — `HelloWorld` / `TheWelcome` / `WelcomeItem` / `components/icons`(아이콘 6종) / `assets/logo.svg`
- `App.vue`를 로고·네비게이션 껍데기에서 **실습 컴포넌트 진입점**으로 재작성. 주제별 `<section>`으로 그룹화
- `assets/main.css`의 2단 그리드 레이아웃을 900px 단일 컬럼으로 교체 (실습 컴포넌트가 세로로 쌓이는 구조에 맞춤). `base.css`의 색상 변수·리셋은 유지
- 라우터 미사용 구간 정리 — 라우터 실습 진입 전까지 `router/`·`views/`가 죽은 코드가 되므로 제거하고 `main.js`의 라우터 등록도 해제. 해당 Hands on에서 직접 재구성한다
- `components/practices/`(문법 실습) / `components/exercise/`(Weather 앱) 2계층 분리
- `.gitignore`에 `.env*` 추가 — 나중에 쓸 OpenWeatherMap API 키가 저장소에 올라가지 않도록 사전 차단

자세한 내용: [docs/01-scaffolding.md](docs/01-scaffolding.md)

---

### 2. Vue Syntax

`v-for` / `v-if` / `:value`+`@input` / 이벤트 수식어를 한 화면(`WeatherMockup.vue`)에 모았다.

**Customization 요약**

- 도시 데이터 3개 → 6개(본인 연고지 포함) 확장, `humidity`/`icon` 필드 추가
- 25도 기준 카드 배경색 분기 (`:class`)
- 즐겨찾기 ⭐ 토글 + "즐겨찾기만 보기" 필터(`v-model` 체크박스) — 상태는 배열 기반(`includes`/`filter`), 강의 범위 밖인 `Set`은 배열로 교체
- 검색어가 비었을 때 "전체 N개 도시" 안내 (`v-if`)
- 이벤트 다양화: 카드 호버 확대·배경색 변화(`@mouseenter`/`@mouseleave`), 검색 `Enter` 확정(`@submit.prevent`), `Esc` 초기화(`@keyup.esc`)
- 그 외 안 쓰던 디렉티브(`v-show`/`v-once`/`v-pre`/`v-cloak`/`v-text`/`v-html`)도 실제 쓰임이 있는 자리를 찾아 반영

자세한 내용: [docs/02-weather-mockup.md](docs/02-weather-mockup.md)

---

## 실습과제 평가 기준 (참고용)

| 항목      | 배점 | 대응 위치                                                    |
| --------- | ---- | ------------------------------------------------------------ |
| 기본 문법 | 25   | `components/practices/basic`, `composition`, `component`     |
| 확장 문법 | 25   | `router/`, `stores/`, `api/`, `components/practices/library` |
| 앱 완성도 | 25   | `components/exercise/` + 배포 결과                           |
| 수업 참여 | 25   | 커밋 이력 및 Code Challenge 기록                             |
