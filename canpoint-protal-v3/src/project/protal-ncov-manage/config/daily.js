import { RouteView } from '../layouts'
const TeacherDaily = resolve => require(['../views/ncov-daily/TeacherDaily.vue'], resolve)
const StudentDaily = resolve => require(['../views/ncov-daily/StudentDaily.vue'], resolve)
const daily = {
  path: '/teacherDaily',
  name: '_teacherDaily',
  redirect: '/teacherDaily',
  component: RouteView,
  meta: {
    title: '疫情日报'
  },
  children: [
    {
      path: '/teacherDaily',
      name: 'teacherDaily',
      component: TeacherDaily,
      meta: {
        title: '教职工'
      }
    },
    {
      path: '/studentDaily',
      name: 'studentDaily',
      component: StudentDaily,
      meta: {
        title: '学生'
      }
    }
  ]
}

export default daily
