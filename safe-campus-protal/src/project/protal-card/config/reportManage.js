// 系统表单
import { RouteView } from '../layouts'
const DayReport = resolve => require(['../views/reportManage/DayReport.vue'], resolve)
const MonthReport = resolve => require(['../views/reportManage/MonthReport.vue'], resolve)
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
    }
  ]
}

export default report
