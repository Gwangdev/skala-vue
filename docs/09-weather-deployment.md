# 9. Vite Build & Deployment

> ESLint 에러를 없애고, 문법 연습 폴더를 저장소에서 빼고, 모드별 빌드 스크립트와 Vercel 배포 설정을 붙임

## 과제 요구사항 정리

1. **소스 품질관리**: ESLint로 점검해 제출 과제의 에러를 없애고, API 키는 환경변수로 두고 Git에 올리지 않음
2. **빌드**: `npm run build`
3. **배포**: 빌드된 정적 파일을 호스트(Vercel/Netlify/GitHub Pages 등)에 올려 확인

파일: `eslint.config.js`, `.oxlintrc.json`, `.gitignore`, `package.json`, `vercel.json` 외 7개

## 과제 세부 개발내용

- **ESLint 에러 정리**: 남아 있던 에러는 전부 문법 연습 스크래치(`components/practices/`)에서 나옴 — 컴포넌트 이름 규칙(`vue/multi-word-component-names`)과 미사용 변수. 이 폴더는 제출물이 아니라, `eslint.config.js`의 `globalIgnores`와 `.oxlintrc.json`의 `ignorePatterns`에 경로를 넣어 린트 대상에서 뺌. 본 실습 코드(`exercise/`·`views/`·`stores/` 등)는 에러 0
- **문법 연습 폴더 추적 해제**: `git rm -r --cached src/components/practices/`로 인덱스에서만 빼고 파일은 로컬에 유지. `.gitignore`에 경로를 넣어 다시 커밋되지 않도록 함
- **모드별 빌드**: `.env.staging`·`.env.production`에 `VITE_APP_MODE` 라벨만 두고(비밀값 아님), `package.json`에 `build:staging`·`build:production` 스크립트 추가. `.gitignore`는 `.env.*`를 막되 이 두 파일과 `.env.example`만 예외로 추적. 실제 키(`VITE_OPENWEATHERMAP_API_KEY`)는 로컬 `.env`와 호스트 환경변수에만 둠. About 화면에 `import.meta.env.VITE_APP_MODE`를 표시해 어떤 모드로 빌드됐는지 눈으로 확인
- **빌드 확인**: `npm run build` → `dist/`에 `index.html` + 해시 붙은 `assets/` 생성. 라우트별 청크가 지연 로딩 설정대로 쪼개지는 것도 그대로
- **SPA fallback**: 라우터가 history 모드(`createWebHistory`)라 `/weather/서울` 같은 주소로 새로고침·직접 진입하면 호스트가 그 경로의 파일을 찾다 404를 냄. Vercel용 `vercel.json`에 모든 경로를 `/index.html`로 rewrite하는 규칙을 둠
- **base 경로**: Vercel 루트 배포라 `vite.config.js`의 `base`는 기본값(`/`) 유지. GitHub Pages처럼 하위 경로(`/저장소명/`)에 올리면 `base`를 맞춰야 함
- **호스트 작업**: 저장소 연결·환경변수(`VITE_OPENWEATHERMAP_API_KEY`) 입력·배포 실행은 Vercel 대시보드에서 직접 함

## 추가 확장 아이디어

1. 환경변수와 빌드 모드
2. 번들 크기

### 환경변수와 빌드 모드

`VITE_` 접두사가 붙은 변수는 빌드 시 결과물에 문자열로 그대로 치환돼 들어감(`dist/`를 열어보면 값이 보임). 프론트 전용 API 키라 완전한 비밀은 아니지만, 저장소엔 올리지 않고 호스트의 환경변수 설정으로 주입하는 게 표준. 키를 진짜로 숨기려면 서버(또는 서버리스 함수)에서 프록시로 호출해야 하는데 이 앱 범위 밖.

### 번들 크기

`npm run build` 결과에서 500KB를 넘는 청크 경고가 뜸. Element Plus 전역 등록분(스크립트 gzip 약 300KB)과 인라인된 필름 프레임 SVG가 대부분. 지금은 그대로 두되, 필요한 컴포넌트만 자동 임포트하거나 `build.chunkSizeWarningLimit`를 조정하는 선택지가 있음.

## 의문점 정리

`vercel.json`의 rewrite가 모든 경로를 `index.html`로 넘기므로, 존재하지 않는 정적 파일 주소(예: 오타 난 `/assets/...`)도 404 대신 `index.html`(200)을 돌려받음. Vercel은 실제 파일을 rewrite보다 먼저 서빙해서 대부분 문제가 안 되지만, 라우터가 못 잡는 경로는 앱의 `NotFoundView`로 떨어지므로 "파일 없음"과 "라우트 없음"이 화면상 구분되지 않음
