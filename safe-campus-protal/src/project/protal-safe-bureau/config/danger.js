import { RouteView } from '../layouts'
// 隐患管理
const SchoolDanger = resolve => require(['../views/dangerManage/SchoolDanger.vue'], resolve)
const ReportDangers = resolve => require(['../views/dangerManage/ReportDangers.vue'], resolve)
const ViewDangers = resolve => require(['../views/dangerManage/ViewDangers.vue'], resolve)
const RectificationNotice = resolve => require(['../views/dangerManage/RectificationNotice.vue'], resolve)
const EidtRectificationNotice = resolve => require(['../views/dangerManage/EidtRectificationNotice.vue'], resolve)
const danger = {
  path: '/danger',
  name: 'danger',
  component: RouteView,
  meta: {
    title: '隐患管理'
  },
  children: [
    {
      path: '/schoolDanger',
      name: 'schoolDanger',
      component: SchoolDanger,
      meta: {
        title: '校内隐患'
      }
    },
    {
      path: '/accountList/reportDangers',
      name: 'reportDangers',
      component: ReportDangers,
      meta: {
        title: '上报隐患',
        isHide: true
      }
    },
    {
      path: '/accountList/viewDangers',
      name: 'viewDangers',
      component: ViewDangers,
      meta: {
        title: '查看隐患',
        isHide: true
      }
    },
    {
      path: '/accountList/rectificationNotice',
      name: 'rectificationNotice',
      component: RectificationNotice,
      meta: {
        title: '整改通知书',
        isHide: true
      }
    },
    {
      path: '/accountList/eidtRectificationNotice',
      name: 'eidtRectificationNotice',
      component: EidtRectificationNotice,
      meta: {
        title: '编辑整改通知书',
        isHide: true
      }
    }
  ]
}

export default danger
