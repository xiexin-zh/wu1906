// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import set from './set'
import leave from './leave'
import student from './student'
import teacher from './teacher'
const AttendanceData = resolve => require(['../views/AttendanceData.vue'], resolve)
const OutRecord = resolve => require(['../views/outRecord/outRecord.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '考勤管理'
    },
    redirect: '/AttendanceData',
    children: [
      {
        path: '/attendanceData',
        name: 'attendanceData',
        component: AttendanceData,
        meta: {
          title: '考勤预览'
        }
      },
      {
        path: '/outRecord',
        name: 'outRecord',
        component: OutRecord,
        meta: {
          title: '外出记录'
        }
      },
      set,
      leave,
      student,
      teacher
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
