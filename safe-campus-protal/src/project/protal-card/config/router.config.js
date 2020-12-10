// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import money from './moneyManage'
import trade from './tradeManage'
import report from './reportManage'
import consume from './consumeManage'
const Home = resolve => require(['../views/Home.vue'], resolve)
const AccountMge = resolve => require(['../views/AccountMge.vue'], resolve)
const OperateRecord = resolve => require(['../views/OperateRecord.vue'], resolve)
const TypeMge = resolve => require(['../views/TypeMge.vue'], resolve)
const SetUp = resolve => require(['../views/SetUp.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '一卡通'
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '系统概览'
        }
      },
      {
        path: '/accountMge',
        name: 'accountMge',
        component: AccountMge,
        meta: {
          title: '卡户管理'
        }
      },
      {
        path: '/operateRecord',
        name: 'operateRecord',
        component: OperateRecord,
        meta: {
          title: '卡操作记录'
        }
      },
      {
        path: '/typeMge',
        name: 'typeMge',
        component: TypeMge,
        meta: {
          title: '卡类型管理'
        }
      },
      {
        path: '/setUp',
        name: 'setUp',
        component: SetUp,
        meta: {
          title: '系统设置'
        }
      },
      money,
      trade,
      report,
      ...consume
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
