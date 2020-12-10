// 招生任务
import { RouteView } from '../layouts'
const Award = resolve => require(['../views/students/Award.vue'], resolve)
const Punishment = resolve => require(['../views/students/Punishment.vue'], resolve)
const Remark = resolve => require(['../views/students/Remark.vue'], resolve)
const Suspension = resolve => require(['../views/students/Suspension.vue'], resolve)
const BackToSchool = resolve => require(['../views/students/BackToSchool.vue'], resolve)
const Transfer = resolve => require(['../views/students/Transfer.vue'], resolve)
const Quit = resolve => require(['../views/students/Quit.vue'], resolve)

const students = {
  path: '/student',
  name: 'student',
  component: RouteView,
  redirect: '/award',
  meta: {
    title: '学生指南'
  },
  children: [
    {
      path: '/award',
      name: 'award',
      component: Award,
      meta: {
        title: '学生奖励'
      }
    },
    {
      path: '/punishment',
      name: 'punishment',
      component: Punishment,
      meta: {
        title: '学生处分'
      }
    },
    {
      path: '/remark',
      name: 'remark',
      component: Remark,
      meta: {
        title: '品德评语'
      }
    },
    {
      path: '/suspension',
      name: 'suspension',
      component: Suspension,
      meta: {
        title: '休学办理'
      }
    },
    {
      path: '/backToSchool',
      name: 'backToSchool',
      component: BackToSchool,
      meta: {
        title: '复学办理'
      }
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: Transfer,
      meta: {
        title: '转学办理'
      }
    },
    {
      path: '/quit',
      name: 'quit',
      component: Quit,
      meta: {
        title: '辍学办理'
      }
    }
  ]
}

export default students
