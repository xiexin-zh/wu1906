// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import accountMge from './accountManage'
import cardManagement from './cardManagement'
import tradeManage from './tradeManage'
import systemSet from './systemSet'
import reportManage from './reportManage'
const Home = resolve => require(['../views/Home.vue'], resolve)
const consumerMachine = resolve => require(['../views/consumeManage/MachineManage.vue'], resolve)
const SetMachine = resolve => require(['../views/consumeManage/SetMachine.vue'], resolve)
const StallManage = resolve => require(['../views/stallManage/StallManage.vue'], resolve)

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
      accountMge,
      cardManagement,
      tradeManage,
      reportManage,
      {
        path: '/consumerMachine',
        name: 'consumerMachine',
        component: consumerMachine,
        meta: {
          title: '消费机管理'
        }
      },
      {
        path: '/consume/setMachine',
        name: 'setMachine',
        component: SetMachine,
        meta: {
          title: '设置',
          isHide: true
        }
      },
      {
        path: '/stallManage',
        name: 'stallManage',
        component: StallManage,
        meta: {
          title: '档口管理'
        }
      },
      systemSet
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

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
