// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
const Home = resolve => require(['../views/Home.vue'], resolve)
const VisitorRecord = resolve => require(['../views/VisitorRecord.vue'], resolve)
const VisitorReason = resolve => require(['../views/VisitorReason.vue'], resolve)
const CurrentSet = resolve => require(['../views/CurrentSet.vue'], resolve)
const VisitorSet = resolve => require(['../views/VisitorSet.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/vsitorRecord',
        name: 'visitorRecord',
        component: VisitorRecord,
        meta: {
          title: '访客记录'
        }
      },
      {
        path: '/visitorReason',
        name: 'visitorReason',
        component: VisitorReason,
        meta: {
          title: '来访事由'
        }
      },
      {
        path: '/currentSet',
        name: 'currentSet',
        component: CurrentSet,
        meta: {
          title: '通行权限'
        }
      },
      {
        path: '/visitorSet',
        name: 'visitorSet',
        component: VisitorSet,
        meta: {
          title: '被访权限'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
