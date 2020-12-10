// eslint-disable-next-line
import {
  BasicLayout
} from '../layouts'
import deviceAdmin from './device-admin'
const Home = resolve => require(['../views/Home.vue'], resolve)
const FaceRecord = resolve => require(['../views/FaceRecord.vue'], resolve)
const BusinessLog = resolve => require(['../views/BusinessLog.vue'], resolve)
const DistinguishServe = resolve => require(['../views/DistinguishServe.vue'], resolve)

export const asyncRouterMap = [{
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: {
    title: '设备预览'
  },
  redirect: '/deviceView',
  children: [{
    path: '/deviceView',
    name: 'deviceView',
    component: Home,
    meta: {
      title: '设备预览'
    }
  },
  deviceAdmin,
  {
    path: '/businessLog',
    name: 'businessLog',
    component: BusinessLog,
    meta: {
      title: '业务日志'
    }
  },
  {
    path: '/faceRecord',
    name: 'faceRecord',
    component: FaceRecord,
    meta: {
      title: '识别记录'
    }
  },
  {
    path: '/distinguishServe',
    name: 'distinguishServe',
    component: DistinguishServe,
    meta: {
      title: '识别服务'
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
