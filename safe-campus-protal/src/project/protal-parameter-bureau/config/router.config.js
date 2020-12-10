/*
 * @Author: your name
 * @Date: 2020-11-09 10:03:09
 * @LastEditTime: 2020-11-09 14:54:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \safe-campus-protal\src\project\protal-parameter-bureau\config\router.config.js
 */
// eslint-disable-next-line
import {
  BasicLayout
} from '../layouts'
import safeDataStatis from './safeDataStatis'
import grade from './grade'
export const asyncRouterMap = [{
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: {
    title: '首页'
  },
  redirect: '/allStatistics',
  children: [
    {
      path: '/allStatistics',
      name: 'allStatistics',
      component: () => import('../views/AllStatistics.vue'),
      meta: {
        title: '综合分析统计'
      }
    },
    safeDataStatis,
    grade,
    // {
    //   path: '/campusSecurityData',
    //   name: 'campusSecurityData',
    //   component: () => import('../views/SafetyRating.vue'),
    //   meta: {
    //     title: '校园大数据安全'
    //   }
    // },
    {
      path: '/safetyRating/rule',
      name: 'rule',
      component: () => import('../views/rule.vue'),
      meta: {
        title: '积分规则',
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
