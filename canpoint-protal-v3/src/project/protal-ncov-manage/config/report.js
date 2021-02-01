import { RouteView } from '../layouts'
const TeacherReport = resolve => require(['../views/report-record/TeacherReport.vue'], resolve)
const StudentReport = resolve => require(['../views/report-record/StudentReport.vue'], resolve)
const OtherReport = resolve => require(['../views/report-record/OtherReport.vue'], resolve)

const report = {
  path: '/teacherReport',
  name: '_teacherReport',
  redirect: '/teacherReport',
  component: RouteView,
  meta: {
    title: '上报记录'
  },
  children: [
    {
      path: '/teacherReport',
      name: 'teacherReport',
      component: TeacherReport,
      meta: {
        title: '教职工'
      }
    },
    {
      path: '/studentReport',
      name: 'studentReport',
      component: StudentReport,
      meta: {
        title: '学生'
      }
    },
    {
      path: '/otherReport',
      name: 'otherReport',
      component: OtherReport,
      meta: {
        title: '陌生人'
      }
    }
  ]
}

export default report
