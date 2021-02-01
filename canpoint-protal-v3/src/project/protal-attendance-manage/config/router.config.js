// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import teacher from './teacher'
import student from './student'
import set from './set'
const Home = resolve => require(['../views/Home.vue'], resolve)
const OutRecord = resolve => require(['../views/OutRecord.vue'], resolve)
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
        path: '/outRecord',
        name: 'outRecord',
        component: OutRecord,
        meta: {
          title: '出入记录'
        }
      },
      teacher,
      student,
      set
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
