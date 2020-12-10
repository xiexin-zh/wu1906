// eslint-disable-next-line
import { BasicLayout } from '../layouts'
import reportManage from './reportManage'
import healthManage from './healthManage'
import organize from './organize'
import dailyReport from './dailyReport'
import set from './setGroup'
const View = resolve => require(['../views/Home.vue'], resolve)
const SetUp = resolve => require(['../views/setUp/SetUp.vue'], resolve)
const TemPlan = resolve => require(['../views/temPlan/temPlan.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '系统首页'
    },
    redirect: '/view',
    children: [
      {
        path: '/view',
        name: 'view',
        component: View,
        meta: {
          title: '疫情预览',
          icon: 'bar-chart'
        }
      },
      dailyReport,
      reportManage,
      healthManage,
      organize,
      set,
      {
        path: '/setUp',
        name: 'setUp',
        component: SetUp,
        meta: {
          title: '系统设置',
          icon: 'menu-fold'
        }
      },
      {
        path: '/temPlan',
        name: 'temPlan',
        component: TemPlan,
        meta: {
          title: '测温计划',
          icon: 'menu-fold'
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
// const constantRouterMap = [
//   {
//     path: '',
//     name: 'login',
//     component: () => import('../views/user/Login')
//   }
// ]
let RouterMap
if (process.env.VUE_APP_URL === 'prod') {
  RouterMap = [...asyncRouterMap]
} else {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
