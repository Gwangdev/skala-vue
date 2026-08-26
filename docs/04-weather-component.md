# 4. Weather Component

> props / emits / slot 종합 실습. `WeatherComposition.vue`를 4개 컴포넌트로 나눠서 개발.

## 과제 요구사항 정리

1. **WeatherParent.vue**: 모든 반응형 상태 유지
2. **BaseDashboardCard.vue**: 검색박스·리스트박스 디자인 공통화, `<slot>`으로 부모가 검색·날씨 현황 데이터 주입
3. **SearchBar.vue**: 검색어를 props로 받아 표시, 검색 시 `update-query` emit
4. **WeatherCard.vue**: 선택된 도시 객체를 props로 받아 표시, `select-card`/`click-detail` emit
5. 컴포넌트별 디자인은 각각 `<style scoped>`로 분리
6. Slot으로 전달된 자식(SearchBar, WeatherCard)은 스크립트 스코프가 WeatherParent라, 부모가 이 둘과 직접 바인딩

파일: `src/components/exercise/WeatherParent.vue` 외 3개

## 과제 세부 개발내용

- **BaseDashboardCard**: `title` prop + 기본 슬롯. 검색 카드와 날씨 리스트 카드 두 곳에서 재사용해 같은 카드 껍데기를 공유
- **SearchBar**: `query` prop을 그대로 표시하다가, 입력마다(`@input`) 즉시 `update-query`를 emit — 실습3처럼 엔터 없이 실시간으로 필터링된다. 도시 선택은 이 emit과 무관하게 카드를 직접 클릭해야만 일어난다
- **WeatherCard**: `city`/`isFavorite`/`isSelected` prop, `select-card`/`click-detail`/`toggle-favorite` emit. 상세보기 알림은 부모(WeatherParent)의 `showDetail`이 처리
- **WeatherParent**: `filteredWeatherList`/`matchedFilm` 등 실습 3의 computed·watch를 그대로 유지하면서 SearchBar·WeatherCard를 슬롯으로 배치

## 추가 확장 아이디어

1. 컴포넌트 설계에 대한 추가 탐구
2. 웹서비스의 이용성을 고려한 기능 확장

### Component 탐구

- **`WeatherCard`의 `variant` prop**: 전체 도시 보기 전용 카드를 새로 만드는 대신
  `WeatherCard`에 `variant="grid"`를 추가해, 검색 목록(행 레이아웃)과 전체 도시 보기
  (타일 레이아웃) 양쪽에서 같은 컴포넌트를 재사용하며 좀 더 자유롭게 확장해서 사용 가능하겠다는 판단을 얻을 수 있었다.

### 일반 확장 (앱 완성도)

Component 개념 탐구는 아니지만, 배점표의 "앱 완성도" 항목에 해당하는 기능 확장이다.

- **도시 데이터 확장**: 실습 3의 6개 도시를 지역별로 보강해 13개로 늘리고 `region` 필드를 붙임(수도권 3·영남권 3·호남권 2·충청권 2·강원권 2·제주권 1)
- **전체 도시 보기**: 검색 대시보드와 별개로 전체 도시를 카드 그리드로 훑어보는 화면(WeatherParent에 인라인). 상단은 방문 이력·즐겨찾기, 하단은 지역별 대표 도시
- **지역 소진 시 대체(라운드로빈, `regionUtils.js`)**: 대표 도시는 지역마다 한 곳씩 뽑는다. 제주권은 제주 하나뿐이라 그 도시만 방문해도 대표 목록에서 제주권 자리가 비는데, 대표 도시 개수(지역 개수만큼)를 유지하려면 다른 지역에서 하나 더 뽑아야 한다
- **도시 찾기 팝업(CityFinder)**: 보유 도시를 지역별로 묶어 보여주는 오버레이로 클릭하면 검색 화면으로 돌아가 그 도시가 선택된 결과를 보여줌

## 의문점 정리

서비스가 지금보다 커지면 Parent 하나를 두고 자식 컴포넌트를 확장하며 모든 데이터를 Parent가 관리하는 방식이 적합한가에 대해서 의문이 발생함.
예를 들어서 `favorites`/`visitHistory`를 굳이 `WeatherParent`가 들고 있다가 자식에 내려줘야 하는지가 궁금했다.
