# skala-vue

SK AX SKALA — Full-stack Engineering / Frontend Framework **Vue.js** 교육과정(4일) 종합 실습 저장소.

Vue 3 + Vite + Composition API 기반으로, 단원별 문법 실습과 **Weather 앱**을 단계적으로 구현한다.

- **배포 주소**: _(10챕터 배포 후 기재)_
- **작성자**: Gwangdev

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
│   ├── practices/              # 단원별 문법 실습 (평가항목: 기본 문법 / 확장 문법)
│   │   ├── basic/              #  3챕터 Vue Syntax — 디렉티브
│   │   ├── composition/        #  4챕터 Composition API
│   │   ├── component/          #  5챕터 Components
│   │   └── library/            #  7·9챕터 Pinia / UI Library
│   └── exercise/               # Weather 앱 본체 (평가항목: 앱 완성도)
├── stores/                     # 7챕터 Pinia
└── docs/                       # 단원별 상세 기록 (루트 README에서 링크)
```

`practices/`는 문법 숙련도의 근거, `exercise/`는 최종 작품의 본체로 역할을 나눈다.

---

## 단원별 실습 및 Customization 내역

| # | 챕터 | 실습명 | 상세 |
|---|---|---|---|
| 1 | 2. Getting Started | 프로젝트 스캐폴딩 | [docs/ch02-scaffolding.md](docs/ch02-scaffolding.md) |
| 2 | 3. Vue Syntax | Weather Mockup | _진행 예정_ |
| 3 | 4. Composition API | Weather Composition | _진행 예정_ |
| 4 | 5. Vue Components | Weather Component | _진행 예정_ |
| 5 | 6. Vue Router | Weather Router | _진행 예정_ |
| 6 | 7. Pinia | Weather Store | _진행 예정_ |
| 7 | 8. Axios | Weather Axios | _진행 예정_ |
| 8 | 9. UI Libraries | Weather UI Library | _진행 예정_ |
| 9 | 10. Vite Build & Deployment | Weather Deployment | _진행 예정_ |

---

### 1. 프로젝트 스캐폴딩 (2챕터 Getting Started)

`npm create vue@latest`로 생성한 기본 프로젝트를, **본인이 작성한 코드만 화면에 남도록** 정리했다.

**Customization 요약**

- Vite 기본 템플릿 산출물 제거 — `HelloWorld` / `TheWelcome` / `WelcomeItem` / `components/icons`(아이콘 6종) / `assets/logo.svg`
- `App.vue`를 로고·네비게이션 껍데기에서 **실습 컴포넌트 진입점**으로 재작성. 주제별 `<section>`으로 그룹화
- `assets/main.css`의 2단 그리드 레이아웃을 900px 단일 컬럼으로 교체 (실습 컴포넌트가 세로로 쌓이는 구조에 맞춤). `base.css`의 색상 변수·리셋은 유지
- 라우터 미사용 구간 정리 — 6챕터 진입 전까지 `router/`·`views/`가 죽은 코드가 되므로 제거하고 `main.js`의 라우터 등록도 해제. 6챕터 Hands on에서 직접 재구성한다
- `components/practices/`(문법 실습) / `components/exercise/`(Weather 앱) 2계층 분리
- `.gitignore`에 `.env*` 추가 — 8챕터 OpenWeatherMap API 키가 저장소에 올라가지 않도록 사전 차단

자세한 내용: [docs/ch02-scaffolding.md](docs/ch02-scaffolding.md)

---

## 평가 기준 (참고)

| 항목 | 배점 | 대응 위치 |
|---|---|---|
| 기본 문법 | 25 | `components/practices/basic`, `composition`, `component` |
| 확장 문법 | 25 | `router/`, `stores/`, `api/`, `components/practices/library` |
| 앱 완성도 | 25 | `components/exercise/` + 배포 결과 |
| 수업 참여 | 25 | 커밋 이력 및 Code Challenge 기록 |
