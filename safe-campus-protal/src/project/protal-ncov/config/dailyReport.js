import { RouteView } from '../layouts'
const StudentDaily = resolve => require(['../views/dailyReport/StudentDaily.vue'], resolve)
const TeacherDaily = resolve => require(['../views/dailyReport/TeacherDaily.vue'], resolve)
const menu = {
  path: '/dailyReport',
  name: '/dailyReport',
  component: RouteView,
  redirect: '/TeacherDaily',
  meta: {
    title: '疫情日报',
    icon: 'folder-open'
  },
  children: [
    {
      path: '/TeacherDaily',
      name: 'teacherDaily',
      component: TeacherDaily,
      meta: {
        title: '教职工',
        icon: 'folder-open'
      }
    },
    {
      path: '/StudentDaily',
      name: 'studentDaily',
      component: StudentDaily,
      meta: {
        title: '学生',
        icon: 'folder-open'
      }
    }
  ]
}

export default menu
