import { RouteView } from '../layouts'
const TeacherHealthy = resolve => require(['../views/healthy-manage/TeacherHealthy.vue'], resolve)
const StudentHealthy = resolve => require(['../views/healthy-manage/StudentHealthy.vue'], resolve)
const PersonalDetail = resolve => require(['../views/component/PersonalDetail.vue'], resolve)
const healthy = {
  path: '/teacherHealthy',
  name: '_teacherHealthy',
  redirect: '/teacherHealthy',
  component: RouteView,
  meta: {
    title: '健康档案'
  },
  children: [
    {
      path: '/teacherHealthy',
      name: 'teacherHealthy',
      component: TeacherHealthy,
      meta: {
        title: '教职工'
      }
    },
    {
      path: '/studentHealthy',
      name: 'studentHealthy',
      component: StudentHealthy,
      meta: {
        title: '学生'
      }
    },
    {
      path: '/component/personalDetail',
      name: 'personalDetail',
      component: PersonalDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    }

  ]
}

export default healthy
