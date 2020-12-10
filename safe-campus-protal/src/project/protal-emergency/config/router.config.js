import { BasicLayout } from '../layouts'
import rest from './rest'
import drill from './drill'
const AreaSet = resolve => require(['../views/areaSet/AreaSet.vue'], resolve)
const SourceMange = resolve => require(['../views/sourceMange/SourceMange.vue'], resolve)
const AddRadioSource = resolve => require(['../views/sourceMange/AddRadioSource.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/areaSet',
    children: [
      {
        path: '/areaSet',
        name: 'areaSet',
        component: AreaSet,
        meta: {
          title: '广播区域设置'
        }
      },
      {
        path: '/sourceMange',
        name: 'sourceMange',
        component: SourceMange,
        meta: {
          title: '广播资源管理'
        }
      },
      {
        path: 'sourceMange/addRadioSource',
        name: 'addRadioSource',
        component: AddRadioSource,
        meta: {
          title: '添加广播资源',
          isHide: true
        }
      },
      rest,
      drill
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
