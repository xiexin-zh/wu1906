// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import argumentSet from './argumentSet'
import templateSet from './templateSet'
import useRelation from './useRelation'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/argumentSet/WeChat',
    children: [
      argumentSet,
      {
        path: '/templateType',
        name: 'templateType',
        component: () => import('../views/TemplateType.vue'),
        meta: {
          title: '模板类型'
        }
      },
      templateSet,
      useRelation
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
//   component: () => import(/* webpackChunkName: "login" */ '../views/user/Login')
// }]

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
