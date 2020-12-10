// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import students from './students'
import teachers from './teachers'
import educational from './education'
import professional from './professional'
import teachingManage from './teachingManage'
import teacherWork from './teacherWork'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '教务系统'
    },
    redirect: '/student',
    children: [
      students,
      teachers,
      educational,
      professional,
      teachingManage,
      teacherWork
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
