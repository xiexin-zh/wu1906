import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/register/:isAuth',
      name: 'register',
      component: () => import('@/views/register/register.vue')
    },
    {
      path: '/forget',
      name: 'forget',
      component: () => import('@/views/register/forget.vue')
    },
    {
      path: '/reserve',
      name: 'reserve',
      component: () => import('@/views/reserve/reserve.vue')
    },
    {
      path: '/onlineReserve',
      name: 'onlineReserve',
      component: () => import('@/views/reserve/onlineReserve.vue')
    },
    {
      path: '/telReserve',
      name: 'telReserve',
      component: () => import('@/views/reserve/telReserve.vue')
    },
    {
      path: '/takeReserve',
      name: 'takeReserve',
      component: () => import('@/views/reserve/takeReserve.vue')
    },
    {
      path: '/onlineSweep',
      name: 'onlineSweep',
      component: () => import('@/views/reserve/onlineSweep.vue')
    },
    {
      path: '/searchReserve',
      name: 'searchReserve',
      component: () => import('@/views/reserve/searchReserve.vue')
    },
    {
      path: '/reserveDetail',
      name: 'reserveDetail',
      component: () => import('@/views/reserve/reserveDetails.vue')
    },
    {
      path: '/takeDetail',
      name: 'takeDetail',
      component: () => import('@/views/reserve/takeDetail.vue')
    },
    {
      path: '/editReserve',
      name: 'editReserve',
      component: () => import('@/views/reserve/editReserve.vue')
    },
    {
      path: '/editTakeReserve',
      name: 'editTakeReserve',
      component: () => import('@/views/reserve/editTakeReserve.vue')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/404/404.vue')
    }
  ]
})
