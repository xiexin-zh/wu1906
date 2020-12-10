// eslint-disable-next-line
import {
  BasicLayout
} from '../layouts'
import publicLibrary from './publicLibrary'
import boutiqueLibrary from './boutiqueLibrary'
import subSchoolLibrary from './subSchoolLibrary'
import localLibrary from './localLibrary'

export const asyncRouterMap = [{
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: {
    title: '首页'
  },
  redirect: '/publicLibrary',
  children: [
    publicLibrary,
    boutiqueLibrary,
    subSchoolLibrary,
    localLibrary
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
