# 1. 프로젝트 스캐폴딩 — 2챕터 Getting Started

> 첫 Hands on. `npm create vue@latest`로 생성한 기본 프로젝트를 실습 기반으로 정리했다.

## 과제 요구사항

- Node.js / npm 환경에서 Vite 기반 Vue 3 프로젝트 생성
- 프로젝트 구조와 `main.js` → `App.vue` 마운트 흐름 이해
- SFC(Single File Component) 3블록 구조(`<script setup>` / `<template>` / `<style>`) 확인

## 생성 옵션

`npm create vue@latest` 실행 시 선택한 항목:

| 항목 | 선택 | 이유 |
|---|---|---|
| Router | Yes | 6챕터 Vue Router에서 사용 |
| Pinia | Yes | 7챕터 Pinia에서 사용 |
| ESLint / Prettier | Yes | 10챕터 코드 품질 관리에서 사용 |
| TypeScript | No | 교육과정이 JS 기준 |

## Customization 내역

### 1) 기본 템플릿 산출물 제거

`localhost` 접속 시 **본인이 작성한 코드의 결과만** 보이도록 Vite 데모 화면을 걷어냈다.

- `components/HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`
- `components/icons/` (아이콘 컴포넌트 6종)
- `assets/logo.svg`
- `views/AboutView.vue`

### 2) App.vue 재작성

로고 헤더 + 네비게이션 + 2단 레이아웃 CSS를 전부 걷어내고, **실습 컴포넌트 진입점**으로 바꿨다.
주제별로 `<section>`을 나눠 화면에서 단원 구분이 바로 보이도록 했다.

```
v-on (이벤트 핸들링)  →  v-model (폼 바인딩)  →  v-bind
→ 렌더링/조건/반복  →  기타 디렉티브
```

### 3) 스타일 정리

- `assets/main.css` — 템플릿의 `@media (min-width: 1024px)` 2단 그리드 레이아웃 제거.
  실습 컴포넌트가 세로로 쌓이는 구조이므로 **900px 단일 컬럼**으로 교체
- `assets/base.css` — 색상 변수(CSS Custom Property)와 리셋은 다크모드 대응이 되어 있어 그대로 유지

### 4) 라우터 미사용 구간 정리

`App.vue`가 컴포넌트를 직접 렌더링하게 되면서 `views/HomeView.vue`와 `router/index.js`가
아무도 호출하지 않는 죽은 코드가 되었다. 두 폴더를 제거하고 `main.js`의 `app.use(router)`도 해제했다.

> 6챕터 Hands on이 `router/index.js` 작성부터 시작하는 구조라(강의자료 6.2 "라우터 설정 3단계"),
> 그 시점에 직접 재구성한다. `vue-router` 패키지는 `package.json`에 남아 있어 재설치는 불필요하다.

### 5) 폴더 2계층 분리

평가 항목이 "기본 문법"과 "앱 완성도"로 갈리므로, 폴더도 같은 축으로 나눴다.

```
components/
├── practices/    # 단원별 문법 실습 — 문법 숙련도의 근거
│   ├── basic/         3챕터 디렉티브
│   ├── composition/   4챕터
│   ├── component/     5챕터
│   └── library/       7·9챕터
└── exercise/     # Weather 앱 본체 — 최종 작품
```

### 6) 기타

- `index.html` — 타이틀 `Vite App` → `skala-vue`, `<html lang="">` → `lang="ko"`
- `.gitignore` — `.env*` 추가 (`!.env.example` 예외).
  8챕터 OpenWeatherMap API 키가 저장소에 올라가는 것을 사전 차단

## 확인 결과

- 브라우저 콘솔 에러 0건
- `npm run lint` / `npm run format` 통과

## 배운 점

- `main.js`는 `createApp(App)` → `use(플러그인)` → `mount('#app')` 순서로 동작하며,
  플러그인 등록은 반드시 `mount()` 이전이어야 한다
- `<style scoped>`는 해당 컴포넌트의 엘리먼트에만 적용되므로, 부모의 `section` 스타일이
  자식 컴포넌트 내부의 `section`까지 침범하지 않는다
- 템플릿 정리는 단순 청소가 아니라, **화면에 남은 것 = 본인이 설명할 수 있는 코드**라는 상태를 만드는 작업이다
