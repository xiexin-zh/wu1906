// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
const Home = resolve => require(['../views/Home.vue'], resolve)
const OrderList = resolve => require(['../views/orderManage/OrderList.vue'], resolve)
const OrderDetail = resolve => require(['../views/orderManage/OrderDetail'], resolve)
const ApplyManage = resolve => require(['../views/applyManage/ApplyManage.vue'], resolve)
const RuleSet = resolve => require(['../views/ruleSet/RuleSet.vue'], resolve)

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
        path: '/orderManage',
        name: 'orderManage',
        redirect: '/orderManage',
        component: RouteView,
        meta: {
          title: '订单管理'
        },
        children: [
          {
            path: '/orderList',
            name: 'orderList',
            component: OrderList,
            meta: {
              title: '订单列表'
            }
          },
          {
            path: '/orderList/detial',
            name: 'orderDetail',
            component: OrderDetail,
            meta: {
              title: '订单详情',
              isHide: true
            },
            hidden: true
          }
        ]
      },
      {
        path: '/applyManage',
        name: 'applyManage',
        component: ApplyManage,
        meta: {
          title: '应用管理'
        }
      },
      {
        path: '/dealRule',
        name: 'dealRule',
        redirect: '/dealRule',
        component: RouteView,
        meta: {
          title: '交易规则'
        },
        children: [
          {
            path: '/ruleSet',
            name: 'ruleSet',
            component: RuleSet,
            meta: {
              title: '消费规则'
            }
          }
        ]
      }
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
