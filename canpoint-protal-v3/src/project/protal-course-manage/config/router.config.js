// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import courseManage from './course'

export const asyncRouterMap = [
  {
    path: '/',
    name: '/',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/course',
    children: [courseManage]
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
