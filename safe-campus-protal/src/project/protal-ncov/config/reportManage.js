import { RouteView } from '../layouts'
const ReportManageStu = resolve => require(['../views/reportManage/ReportManageStu.vue'], resolve)
const ReportManageTea = resolve => require(['../views/reportManage/ReportManageTea.vue'], resolve)
const ReportManageOther = resolve => require(['../views/reportManage/ReportManageOther.vue'], resolve)
const ReportTemperatureTea = resolve => require(['../views/reportManage/ReportTemperatureTea.vue'], resolve)
const ReportTemperatureStu = resolve => require(['../views/reportManage/ReportTemperatureStu.vue'], resolve)

const menu = {
  path: '/reportManage',
  name: '/reportManage',
  component: RouteView,
  redirect: '/reportManageTea',
  meta: {
    title: '上报记录',
    icon: 'folder-open'
  },
  children: [
    {
      path: '/reportManageTea',
      name: 'reportManageTea',
      component: ReportManageTea,
      meta: {
        title: '教职工',
        icon: 'folder-open'
      }
    },
    {
      path: '/ReportManageTea/ReportTemperatureTea',
      name: 'reportTemperatureTea',
      component: ReportTemperatureTea,
      meta: {
        title: '疫情上报'
      },
      hidden: true
    },
    {
      path: '/reportManageStu',
      name: 'reportManageStu',
      component: ReportManageStu,
      meta: {
        title: '学生',
        icon: 'folder-open'
      }
    },
    {
      path: '/reportManageStu/ReportTemperatureStu',
      name: 'reportTemperatureStu',
      component: ReportTemperatureStu,
      meta: {
        title: '疫情上报'
      },
      hidden: true
    },
    {
      path: '/reportManageOther',
      name: 'reportManageOther',
      component: ReportManageOther,
      meta: {
        title: '陌生人',
        icon: 'folder-open'
      }
    },
  ]
}

export default menu
