// 系统表单
import { RouteView } from '../layouts'
const VisitorRecord = resolve => require(['../views/visitorManage/VisitorRecord.vue'], resolve)
const VisitorSet = resolve => require(['../views/visitorManage/VisitorSet.vue'], resolve)
const VisitorAccess = resolve => require(['../views/visitorManage/visitorAccess.vue'], resolve)
const DataView = resolve => require(['../views/visitorManage/DataView.vue'], resolve)
const visitor = {
  path: '/visitorRecord',
  name: 'visitorRecord',
  component: RouteView,
  meta: {
    title: '访客管理'
  },
  children: [
    {
      path: '/visitorRecord',
      name: 'visitorRecord',
      component: VisitorRecord,
      meta: {
        title: '访客记录'
      }
    },
    {
      path: '/visitorSet',
      name: 'visitorSet',
      component: VisitorSet,
      meta: {
        title: '访客设置'
      }
    },
    {
      path: '/visitorAccess',
      name: 'visitorAccess',
      component: VisitorAccess,
      meta: {
        title: '被访权限'
      }
    },
    {
      path: '/DataView',
      name: 'DataView',
      component: DataView,
      meta: {
        title: '实时看板'
      }
    }
  ]
}

export default visitor
