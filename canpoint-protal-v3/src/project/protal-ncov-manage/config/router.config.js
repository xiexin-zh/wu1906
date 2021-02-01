// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import daily from './daily'
import healthy from './healthy'
import report from './report'
const Home = resolve => require(['../views/Home.vue'], resolve)
const SystemSet = resolve => require(['../views/SystemSet.vue'], resolve)
const NcovPlan = resolve => require(['../views/NcovPlan.vue'], resolve)
const RealTime = resolve => require(['../views/RealTime.vue'], resolve)
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
      daily,
      healthy,
      report,
      {
        path: '/systemSet',
        name: 'systemSet',
        component: SystemSet,
        meta: {
          title: '系统设置'
        }
      },
      {
        path: '/ncovPlan',
        name: 'ncovPlan',
        component: NcovPlan,
        meta: {
          title: '测温计划'
        }
      },
      {
        path: '/realTime',
        name: 'realTime',
        component: RealTime,
        meta: {
          title: '实时监测'
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
