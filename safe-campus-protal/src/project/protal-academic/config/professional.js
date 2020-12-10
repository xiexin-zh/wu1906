// 专业培养
import { RouteView } from '../layouts'
const PracticeTask = resolve => require(['../views/professional/PracticeTask.vue'], resolve)
const Program = resolve => require(['../views/professional/Program.vue'], resolve)
const AddProgram = resolve => require(['../views/professional/AddProgram.vue'], resolve)

const educational = {
  path: '/professional',
  name: 'professional',
  component: RouteView,
  redirect: '/practiceTask',
  meta: {
    title: '专业培养管理'
  },
  children: [
    {
      path: '/practiceTask',
      name: 'practiceTask',
      component: PracticeTask,
      meta: {
        title: '实践任务管理'
      }
    },
    {
      path: '/program',
      name: 'program',
      component: Program,
      meta: {
        title: '专业培养方案'
      }
    },
    {
      path: '/program/addProgram',
      name: 'addProgram',
      component: AddProgram,
      meta: {
        title: '方案添加',
        isHide: true
      },
      hidden: true
    }
  ]
}

export default educational
