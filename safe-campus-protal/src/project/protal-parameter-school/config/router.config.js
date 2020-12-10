/*
 * @Author: your name
 * @Date: 2020-11-09 10:03:09
 * @LastEditTime: 2020-11-09 15:00:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \safe-campus-protal\src\project\protal-parameter-school\config\router.config.js
 */
// eslint-disable-next-line
import {
  BasicLayout
} from '../layouts'
import safeDataStatis from './safeDataStatis'
export const asyncRouterMap = [{
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: {
    title: '首页'
  },
  redirect: '/dailyStatis',
  children: [
    safeDataStatis,
    {
      path: '/safetyRating',
      name: 'safetyRating',
      component: () => import('../views/SafetyRating.vue'),
      meta: {
        title: '安全评分'
      }
    },
    {
      path: '/safetyRating/integrationrule',
      name: 'integrationrule',
      component: () => import('../views/Integrationrule.vue'),
      meta: {
        title: '积分规则',
        isHide: true
      }
    },
    {
      path: '/safetyReport',
      name: 'safetyReport',
      component: () => import('../views/SafetyReport.vue'),
      meta: {
        title: '安全报告'
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
