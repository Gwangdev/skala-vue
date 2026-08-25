# 3. Weather Composition

> `computed` / `watch` / `watchEffect` 종합 실습. `WeatherMockup.vue`를 복사해 만들었다.

## 과제 요구사항 정리

1. **반응형 상태**: `searchQuery`, `selectedCity`, `weatherList` 정의 (Weather Mockup 이어서 작업)
2. **검색 필터링 (`computed`)**: 검색어가 도시 이름에 포함된 항목만 `filteredWeatherList`로 파생
3. **변화 감시 (`watch`, `watchEffect`)**: `selectedCity` 변경은 `watch`로, `searchQuery` 변경은 `watchEffect`로 콘솔 로그 확인
4. **검색 결과 표시**: 검색어 없음 / 결과 있음 / 결과 없음 3단계로 구분
5. 본인만의 반응형 상태·computed·watcher 추가

파일: `src/components/exercise/WeatherComposition.vue`

## 과제 세부 개발내용

- **`filteredWeatherList`**: `searchQuery`가 바뀔 때만 재계산, 도시 이름 포함 여부로 필터링
- **검색 결과 3단계 구분**: 빈 검색어("전체 N개") / 결과 있음("검색 결과 N개") / 결과 없음("일치하는 도시가 없습니다")
- **`watch(selectedCity, ...)`**: 상태바 문구가 바뀔 때만 실행, 이전/현재 값을 함께 로그 수집
- **`watchEffect(...)`**: `searchQuery`를 자동 추적, 마운트 시 1회 + 값 변경 시마다 로그 수집
- **필름 매칭 (본인 확장)**: 날씨 상태(맑음/흐림/비)별 추천 필름 매칭 테이블(`FILM_MATCH`), 선택된 도시로부터 `matchedFilm`을 `computed`로 파생, `watch(matchedFilm, ...)`으로 매칭 결과를 화면에 이력(`filmMatchLog`, 최근 5개)으로 누적 표시

## 개인 확장 아이디어

날씨 데이터를 활용한 아이디어로 신재생에너지 발전량 예측(RE100/ESG)과 필름(사진) 매칭 두가지를 검토한 결과
교재 뒷장에서 안내하고 있는 무료 API인 OpenWeatherMap 에서 일사량 데이터를 얻을 수 없다고 판단,
필름 매칭쪽으로 방향을 잡음
필름 매칭은 날씨 상태(맑음/흐림/비)만 있어도 구현 가능하고 이 데이터들은 무료 날씨 API에 포함돼 있으므로,
본 실습에서 뷰의 기능들을 충분히 구현해볼 수 있는 아이디어라고 생각함

## 체크리스트

- [x] `filteredWeatherList`가 `searchQuery` 변경에 반응
- [x] `watch`가 이전/현재 값을 함께 로그
- [x] `watchEffect`가 마운트 시 1회 즉시 실행
- [x] 검색 결과 3단계 분기 동작
- [x] `npm run lint` / `npx vite build` 통과
