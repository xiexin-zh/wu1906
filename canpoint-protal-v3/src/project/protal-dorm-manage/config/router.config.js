// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import dormManage from './dorm-manage'
import knowingStatis from './knowing-statis'
import outInRecord from './outIn-record'
import set from './set'
const Home = resolve => require(['../views/Home.vue'], resolve)
const OnlineView = resolve => require(['../views/OnlineView.vue'], resolve)
const RealCheck = resolve => require(['../views/RealCheck.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: '_home',
    component: BasicLayout,
    meta: {
      title: '宿舍概览'
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '宿舍概览'
        }
      },
      // dormManage,
      set,
      {
        path: '/onlineView',
        name: 'onlineView',
        component: OnlineView,
        meta: {
          title: '实时预览'
        }
      },
      {
        path: '/realCheck',
        name: 'realCheck',
        component: RealCheck,
        meta: {
          title: '实时查寝'
        }
      },
      dormManage,
      knowingStatis,
      outInRecord
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
