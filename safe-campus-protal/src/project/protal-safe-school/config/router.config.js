import { BasicLayout } from '../layouts'
import safetyArchive from './safetyArchive'
import safetyInspect from './safetyInspect'
import danger from './danger'
import task from './task'
const SpecialTask = resolve => require(['../views/specialTask/SpecialTask.vue'], resolve)
const SpecialDetail = resolve => require(['../views/specialTask/SpecialDetail.vue'], resolve)
const SafeAccident = resolve => require(['../views/safeAccident/SafeAccident.vue'], resolve)
const AccidentDetail = resolve => require(['../views/safeAccident/AccidentDetail.vue'], resolve)
const AddAccident = resolve => require(['../views/safeAccident/AddAccident.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/fireArchive',
    children: [
      safetyArchive,
      safetyInspect,
      danger,
      {
        path: '/specialTask',
        name: 'specialTask',
        component: SpecialTask,
        meta: {
          title: '专项检查'
        }
      },
      {
        path: '/specialTask/specialDetail',
        name: 'specialDetail',
        component: SpecialDetail,
        meta: {
          title: '专项检查',
          isHide: true
        }
      },
      {
        path: '/safeAccident/accidentDetail',
        name: 'accidentDetail',
        component: AccidentDetail,
        meta: {
          title: '事故详情',
          isHide: true
        }
      },
      {
        path: '/safeAccident',
        name: 'safeAccident',
        component: SafeAccident,
        meta: {
          title: '安全事故'
        }
      },
      {
        path: '/safeAccident/addAccident',
        name: 'addAccident',
        component: AddAccident,
        meta: {
          title: '添加事故',
          isHide: true
        }
      },
      task
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
