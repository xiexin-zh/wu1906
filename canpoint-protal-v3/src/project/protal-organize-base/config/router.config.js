// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import dutyManage from './staff'
import authorityManage from './authority'
import staffManage from './dutyManage'
import undeOrganizationMge from './undeOrganizationMge'

const OrgManage = resolve => require(['../views/OrgManage.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: '_orgManage',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/orgManage',
    children: [
      {
        path: '/orgManage',
        name: 'orgManage',
        component: OrgManage,
        meta: {
          title: '部门管理'
        }
      },
      dutyManage,
      authorityManage,
      staffManage,
      undeOrganizationMge
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
