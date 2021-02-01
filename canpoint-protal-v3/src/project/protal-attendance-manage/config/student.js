import { RouteView } from '../layouts'
const NoticeSet = resolve => require(['../views/student-attendance/NoticeSet.vue'], resolve)
const StudentRecord = resolve => require(['../views/student-attendance/StudentRecord.vue'], resolve)
const StudentTotal = resolve => require(['../views/student-attendance/StudentTotal.vue'], resolve)
const StuDetail = resolve => require(['../views/student-attendance/StuDetail.vue'], resolve)
const student = {
  path: '/studentRecord',
  name: '_studentRecord',
  redirect: '/studentRecord',
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
      path: '/studentTotal',
      name: 'studentTotal',
      component: StudentTotal,
      meta: {
        title: '考勤统计'
      }
    },
    {
      path: '/studentTotal/stuDetail',
      name: 'stuDetail',
      component: StuDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    },
    {
      path: '/noticeSet',
      name: 'noticeSet',
      component: NoticeSet,
      meta: {
        title: '通知设置'
      }
    }
  ]
}

export default student
