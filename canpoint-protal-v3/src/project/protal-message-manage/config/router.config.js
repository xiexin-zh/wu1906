// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import argumentSet from './argumentSet'
import templateSet from './templateSet'
import useRelation from './useRelation'
export const asyncRouterMap = [
  {
    path: '/',
    name: '_templateType',
    component: BasicLayout,
    meta: {
      title: '模板类型'
    },
    redirect: '/templateType',
    children: [
      {
        path: '/msgLog',
        name: 'msgLog',
        component: () => import('../views/MsgLog.vue'),
        meta: {
          title: '消息日志'
        }
      },
      {
        path: '/templateType',
        name: 'templateType',
        component: () => import('../views/TemplateType.vue'),
        meta: {
          title: '模板类型'
        }
      },
      argumentSet,
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

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
