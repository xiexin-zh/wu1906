// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import taskManage from './taskManage'
import studentManage from './studentManage'
const HomePage = resolve => require(['../views/HomePage/HomePage.vue'], resolve)

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
        component: HomePage,
        meta: {
          title: '首页'
        }
      },
      taskManage,
      studentManage
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
