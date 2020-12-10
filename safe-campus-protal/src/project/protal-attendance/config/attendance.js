// 系统表单
import { RouteView } from '../layouts'
const TeacherLeave = resolve => require(['../views/leaveManage/TeacherLeave.vue'], resolve)
const TeacherLeaveDetail = resolve => require(['../views/leaveManage/TeacherLeaveDetail.vue'], resolve)
const StudentLeave = resolve => require(['../views/leaveManage/StudentLeave.vue'], resolve)
const StudentLeaveDetail = resolve => require(['../views/leaveManage/StudentLeaveDetail.vue'], resolve)
const TeacherRecord = resolve => require(['../views/teacherAttendance/TeacherRecord.vue'], resolve)
const StudentRecord = resolve => require(['../views/studentAttendance/StudentRecord.vue'], resolve)
const TeacherStatistics = resolve => require(['../views/teacherAttendance/TeacherStatistics.vue'], resolve)
const StatisticsDetail = resolve => require(['../views/teacherAttendance/StatisticsDetail.vue'], resolve)
const StudentStatistics = resolve => require(['../views/studentAttendance/StudentStatistics.vue'], resolve)
const StudentStatisticsDetail = resolve => require(['../views/studentAttendance/StudentStatisticsDetail.vue'], resolve)
const StudentNotice = resolve => require(['../views/studentAttendance/StudentNotice.vue'], resolve)

const attendance = {
  path: '/teacherManage',
  name: 'teacherManage',
  component: RouteView,
  meta: {
    title: '考勤管理'
  },
  children: [
    {
      path: '/leaveManage',
      name: 'leaveManage',
      component: RouteView,
      meta: {
        title: '请假管理'
      },
      children: [
        {
          path: '/teacherLeave',
          name: 'teacherLeave',
          component: TeacherLeave,
          meta: {
            title: '教职工请假'
          }
        },
        {
          path: '/teacherLeaveDetail',
          name: 'teacherLeaveDetail',
          component: TeacherLeaveDetail,
          meta: {
            title: '教职工请假详情'
          },
          hidden: true
        },
        {
          path: '/studentLeaveDetail',
          name: 'studentLeaveDetail',
          component: StudentLeaveDetail,
          meta: {
            title: '学生请假详情'
          },
          hidden: true
        },
        {
          path: '/studentLeave',
          name: 'studentLeave',
          component: StudentLeave,
          meta: {
            title: '学生请假'
          }
        }
      ]
    },
    {
      path: '/teacherAttendance',
      name: 'teacherAttendance',
      component: RouteView,
      meta: {
        title: '教职工考勤'
      },
      children: [
        {
          path: '/teacherRecord',
          name: 'teacherRecord',
          component: TeacherRecord,
          meta: {
            title: '考勤记录'
          }
        },
        {
          path: '/teacherStatistics',
          name: 'teacherStatistics',
          component: TeacherStatistics,
          meta: {
            title: '考勤统计'
          }
        }
      ]
    },
    {
      path: '/statisticsDetail',
      name: 'statisticsDetail',
      component: StatisticsDetail,
      meta: {
        title: '统计详情'
      },
      hidden: true
    },
    {
      path: '/studentAttendance',
      name: 'studentAttendance',
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
          path: '/studentStatisticsDetail',
          name: 'studentStatisticsDetail',
          component: StudentStatisticsDetail,
          meta: {
            title: '统计详情'
          },
          hidden: true
        },
        {
          path: 'studentNotice',
          name: 'studentNotice',
          component: StudentNotice,
          meta: {
            title: '通知设置'
          }
        }
      ]
    }
  ]
}
export default attendance
