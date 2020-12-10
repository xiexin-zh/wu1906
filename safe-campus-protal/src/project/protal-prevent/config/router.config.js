import { BasicLayout } from '../layouts'
import notice from './notice'
const RiskGroup = resolve => require(['../views/RiskGroup.vue'], resolve)
const RiskModel = resolve => require(['../views/RiskModel.vue'], resolve)
const RiskIdentify = resolve => require(['../views/riskIdentify/RiskIdentify.vue'], resolve)
const AddIdentify = resolve => require(['../views/riskIdentify/AddIdentify.vue'], resolve)
const RiskAssess = resolve => require(['../views/riskAssess/RiskAssess.vue'], resolve)
const RiskAccount = resolve => require(['../views/RiskAccount.vue'], resolve)
const AddAssess = resolve => require(['../views/riskAssess/AddAssess.vue'], resolve)
const AddFind = resolve => require(['../views/riskAssess/AddFind.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/riskGroup',
    children: [
      {
        path: '/riskGroup',
        name: 'riskGroup',
        component: RiskGroup,
        meta: {
          title: '风险管理小组'
        }
      },
      {
        path: '/riskModel',
        name: 'riskModel',
        component: RiskModel,
        meta: {
          title: '风险清单模型'
        }
      },
      {
        path: '/riskIdentify',
        name: 'riskIdentify',
        component: RiskIdentify,
        meta: {
          title: '风险辨识'
        }
      },
      {
        path: '/riskIdentify/addIdentify',
        name: 'addIdentify',
        component: AddIdentify,
        meta: {
          title: '添加',
          isHide: true
        }
      },
      {
        path: '/riskAssess',
        name: 'riskAssess',
        component: RiskAssess,
        meta: {
          title: '风险评估'
        }
      },
      {
        path: '/riskAssess/addAssess',
        name: 'addAssess',
        component: AddAssess,
        meta: {
          title: '风险等级评估',
          isHide: true
        }
      },
      notice,
      {
        path: '/riskAccount',
        name: 'riskAccount',
        component: RiskAccount,
        meta: {
          title: '风险管控台账'
        }
      },
      {
        path: '/riskAssess/addFind',
        name: 'addFind',
        component: AddFind,
        meta: {
          title: '上报隐患',
          isHide: true
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
