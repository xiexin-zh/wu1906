// 报表统计
import { RouteView } from '../layouts'
const DayReport = resolve => require(['../views/reportManage/DayReport.vue'], resolve)
const MonthReport = resolve => require(['../views/reportManage/MonthReport.vue'], resolve)
const ViewReport = resolve => require(['../views/reportManage/ViewReport.vue'], resolve)
const report = {
  path: '/report',
  name: 'report',
  component: RouteView,
  meta: {
    title: '报表统计'
  },
  children: [
    {
      path: '/dayReport',
      name: 'dayReport',
      component: DayReport,
      meta: {
        title: '营业日统计'
      }
    },
    {
      path: '/monthReport',
      name: 'monthReport',
      component: MonthReport,
      meta: {
        title: '营业月统计'
      }
    },
    {
      path: '/viewReport',
      name: 'viewReport',
      component: ViewReport,
      meta: {
        title: '档口营业统计'
      }
    }
  ]
}

export default report
