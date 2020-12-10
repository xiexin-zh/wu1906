// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
const Home = resolve => require(['../views/Home.vue'], resolve)
const Template = resolve => require(['../views/Template.vue'], resolve)
const ChildOne = resolve => require(['../views/child/ChildOne'], resolve)
const ChildDetail = resolve => require(['../views/child/ChildDetail'], resolve)
const ChildTwo = resolve => require(['../views/child/ChildTwo'], resolve)

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
        name: 'childOne',
        redirect: '/childOne',
        component: RouteView,
        meta: {
          title: '示例界面'
        },
        children: [
          {
            path: '/childOne',
            name: 'childOne',
            component: ChildOne,
            meta: {
              title: '界面一'
            }
          },
          {
            path: '/childOne/detial',
            name: 'childDetail',
            component: ChildDetail,
            meta: {
              title: '界面详情',
              isHide: true
            },
            hidden: true
          },
          {
            path: '/childTwo',
            name: 'childTwo',
            component: ChildTwo,
            meta: {
              title: '界面二'
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
