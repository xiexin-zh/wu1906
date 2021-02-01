// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
const Home = resolve => require(['../views/Home.vue'], resolve)
const Template = resolve => require(['../views/Template.vue'], resolve)
const ChildOne = resolve => require(['../views/child/ChildOne'], resolve)
const ChildDetail = resolve => require(['../views/child/ChildDetail'], resolve)
const DetailInfo = resolve => require(['../views/child/DetailInfo'], resolve)
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
        path: '/template',
        name: 'template',
        component: Template,
        meta: {
          title: '模板页'
        }
      },
      {
        path: '/childOne',
        name: 'childOne1',
        redirect: '/childOne',
        component: RouteView,
        meta: {
          title: '功能模块'
        },
        children: [
          {
            path: '/childOne',
            name: 'childOne',
            component: ChildOne,
            meta: {
              title: '我的模块'
            }
          },
          {
            path: '/childOne/detial',
            name: 'childDetail',
            component: ChildDetail,
            meta: {
              title: '模块详情',
              isHide: true
            }
          },
          {
            path: '/childOne/detial/info',
            name: 'detailInfo',
            component: DetailInfo,
            meta: {
              title: '二级详情',
              isHide: true
            },
            hidden: true
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
