# 1. 프로젝트 스캐폴딩

> `npm create vue@latest` 기반 프로젝트 정리

## 과제 요구사항

- Node.js / npm 환경에서 Vite 기반 Vue 3 프로젝트 생성
- 프로젝트 구조와 `main.js` → `App.vue` 마운트 흐름 이해
- SFC(Single File Component) 3블록 구조(`<script setup>` / `<template>` / `<style>`) 확인

## 생성 옵션

| 항목              | 선택 | 이유                         |
| ----------------- | ---- | ---------------------------- |
| Router            | Yes  | Vue Router 실습에서 사용     |
| Pinia             | Yes  | Pinia 실습에서 사용          |
| ESLint / Prettier | Yes  | 코드 품질 관리 실습에서 사용 |
| TypeScript        | No   | 교육자료 JS 기준             |

## Customization 내역

- 기본 템플릿 산출물 제거: `HelloWorld`/`TheWelcome`/`WelcomeItem`, `components/icons`(6종), `assets/logo.svg`, `views/AboutView.vue`
- App.vue 재작성: 로고·네비게이션 껍데기 제거, 실습 컴포넌트 진입점으로 전환, 주제별 `<section>` 구성
- 스타일 정리: `main.css` 2단 그리드 → 900px 단일 컬럼, `base.css` 색상 변수·리셋 유지
- 라우터 미사용 구간 정리: `router/`·`views/` 제거, `main.js` 라우터 등록 해제 (라우터 실습시 재구성 예정, `vue-router` 패키지는 유지)
- 폴더 2계층 분리: `components/practices/`(코드 챌린지 아카이브) / `components/exercise/`(실습과제 저장소)
- 기타: `index.html` 타이틀·`lang` 속성 수정, `.gitignore`에 `.env*` 추가 (API 키 유출 방지)

## 확인 결과

- 브라우저 콘솔 에러 0건
- `npm run lint` / `npm run format` 통과
