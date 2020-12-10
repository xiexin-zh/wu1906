// 系统表单
import { RouteView } from '../layouts'
const StudentScore = resolve => require(['../views/studentMoral/StudentScore.vue'], resolve)
const StudentRecord = resolve => require(['../views/studentMoral/StudentRecord.vue'], resolve)
const moral = {
  path: '/student',
  name: 'student',
  component: RouteView,
  meta: {
    title: '个人德育管理'
  },
  children: [
    {
      path: '/studentScore',
      name: 'studentScore',
      component: StudentScore,
      meta: {
        title: '评分管理'
      }
    },
    {
      path: '/studentRecord',
      name: 'studentRecord',
      component: StudentRecord,
      meta: {
        title: '评分记录'
      }
    }
  ]
}

export default moral
