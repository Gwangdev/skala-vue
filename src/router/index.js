import { createRouter, createWebHistory } from 'vue-router'

// 불필요한 Route 호출로 인해 발생하는 데이터 낭비를 막기 위해 component: () => import(...) 로 Lazy Loading 적용
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'weather-home', component: () => import('../views/WeatherHomeView.vue') },
    {
      path: '/cities',
      name: 'weather-cities',
      component: () => import('../views/WeatherCitiesView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    // catch-all은 최종적으로 주소를 못 찾은 경우 연결하므로 가장 마지막 순위로 배치
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
