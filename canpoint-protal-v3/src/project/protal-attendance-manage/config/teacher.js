import { RouteView } from '../layouts'
const TeacherRecord = resolve => require(['../views/teacher-attendance/TeacherRecord.vue'], resolve)
const TeacherTotal = resolve => require(['../views/teacher-attendance/TeacherTotal.vue'], resolve)
const TeaDetail = resolve => require(['../views/teacher-attendance/TeaDetail.vue'], resolve)
const teacher = {
  path: '/teacherRecord',
  name: '_teacherRecord',
  redirect: '/teacherRecord',
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
      path: '/teacherTotal',
      name: 'teacherTotal',
      component: TeacherTotal,
      meta: {
        title: '考勤统计'
      }
    },
    {
      path: '/teacherTotal/teaDetail',
      name: 'teaDetail',
      component: TeaDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    }
  ]
}

export default teacher
