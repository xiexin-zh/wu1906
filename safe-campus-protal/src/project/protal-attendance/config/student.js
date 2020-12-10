// 系统表单
import { RouteView } from '../layouts'
const StudentRecord = resolve => require(['../views/studentAttendance/StudentRecord.vue'], resolve)
const StudentStatistics = resolve => require(['../views/studentAttendance/StudentStatistics.vue'], resolve)
const StudentStatisticsDetail = resolve => require(['../views/studentAttendance/StudentStatisticsDetail.vue'], resolve)
const StudentNotice = resolve => require(['../views/studentAttendance/StudentNotice.vue'], resolve)
const student = {
  path: '/studentRecord',
  name: 'studentRecord',
  component: RouteView,
  meta: {
    title: '学生考勤'
  },
  children: [
    {
      path: '/studentRecord',
      name: 'studentRecord',
      component: StudentRecord,
      meta: {
        title: '考勤记录'
      }
    },
    {
      path: '/studentStatistics',
      name: 'studentStatistics',
      component: StudentStatistics,
      meta: {
        title: '考勤统计'
      }
    },
    {
      path: '/studentStatistics/detail',
      name: 'studentStatisticsDetail',
      component: StudentStatisticsDetail,
      meta: {
        title: '统计详情',
        isHide: true
      }
    },
    {
      path: '/studentNotice',
      name: 'studentNotice',
      component: StudentNotice,
      meta: {
        title: '通知设置'
      }
    }
  ]
}

export default student
