// eslint-disable-next-line
import {
  BasicLayout
} from '../layouts'
import danger from './danger'
import special from './special'
import safetyTask from './safetyTask'

// 安全事故
const SafetyIncident = resolve => require(['../views/safetyIncident/SafetyIncident.vue'], resolve)
const AccidentDetail = resolve => require(['../views/safetyIncident/AccidentDetail.vue'], resolve)

export const asyncRouterMap = [{
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: {
    title: '首页'
  },
  redirect: '/schoolDanger',
  children: [
    danger,
    special,
    {
      path: '/safetyIncident',
      name: 'safetyIncident',
      component: SafetyIncident,
      meta: {
        title: '安全事故'
      }
    },
    {
      path: '/safetyIncident/accidentDetail',
      name: 'specialDetail',
      component: AccidentDetail,
      meta: {
        title: '查看事故详情',
        isHide: true
      }
    },
    safetyTask
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
