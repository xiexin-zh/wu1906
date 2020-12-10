// eslint-disable-next-line
import { BasicLayout } from '../layouts'
import visitor from './visitor'
import accessSet from './accessSet'
const AccessRecord = resolve => require(['../views/AccessRecord.vue'], resolve)
const DeviceManage = resolve => require(['../views/DeviceManage.vue'], resolve)
const Home = resolve => require(['../views/Home.vue'], resolve)
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
        path: '/accessRecord',
        name: 'accessRecord',
        component: AccessRecord,
        meta: {
          title: '出入记录'
        }
      },
      visitor,
      accessSet,
      {
        path: '/deviceManage',
        name: 'deviceManage',
        component: DeviceManage,
        meta: {
          title: '设备管理'
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

/**
 * 基础路由
 * @type { *[] }
 */
// const constantRouterMap = [{
//   path: '',
//   name: 'login',
//   component: () => import(/* webpackChunkName: "login" */ '@/views/user/Login')
// }]

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
