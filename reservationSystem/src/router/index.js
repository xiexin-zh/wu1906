import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [{
        path: 'noticeSet',
        name: 'noticeSet',
        component: () => import('../views/onlineReserve/noticeSet.vue')
      },
      {
        path: 'timeSet',
        name: 'timeSet',
        component: () => import('../views/timeSet/timeSet.vue')
      },
      {
        path: 'memberSet',
        name: 'memberSet',
        component: () => import('../views/onlineReserve/memberSet.vue')
      },
      {
        path: 'userlist',
        name: 'userlist',
        component: () => import('../views/userList/userList.vue')
      },
      {
        path: 'sacrificeNoticeSet',
        name: 'sacrificeNoticeSet',
        component: () => import('../views/sacrifice/noticeSet.vue')
      },
      {
        path: 'sacrificeMemberSet',
        name: 'sacrificeMemberSet',
        component: () => import('../views/sacrifice/memberSet.vue')
      },
      {
        path: 'onlineSacrificeMember',
        name: 'onlineSacrificeMember',
        component: () => import('../views/onlineSacrifice/memberSet.vue')
      },
      {
        path: 'onlineSacrificeNoticeSet',
        name: 'onlineSacrificeNoticeSet',
        component: () => import('../views/onlineSacrifice/noticeSet.vue')
      },
      {
        path: 'followMember',
        name: 'followMember',
        component: () => import('../views/followMember/followMember.vue')
      },
      {
        path: 'statisticAnalysis',
        name: 'statisticAnalysis',
        component: () => import('../views/statisticAnalysis/statisticAnalysis.vue')
      },
      {
        path: 'cemeteryAdmin',
        name: 'cemeteryAdmin',
        component: () => import('../views/cemeteryManage/cemeteryManage.vue')
      },
      {
        path: 'phoneAppointment',
        name: 'phoneAppointment',
        children: [{
            path: 'memberInfo',
            name: 'memberInfo',
            component: () => import('../views/phoneAppointment/memberInfo.vue')
          },
          {
            path: 'noticeSet',
            name: 'noticeSet',
            component: () => import('../views/phoneAppointment/noticeSet.vue')
          }
        ],
        component: () => import('../views/phoneAppointment/index.vue')
      },
      {
        path: 'memberManage',
        name: 'memberManage',
        component: () => import('../views/memberManage/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue')
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router