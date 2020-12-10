// 招生任务
import { RouteView } from '../layouts'
const AwardMsg = resolve => require(['../views/teachers/AwardMsg.vue'], resolve)
const TaskPaper = resolve => require(['../views/teachers/TaskPaper.vue'], resolve)

const teachers = {
  path: '/teacher',
  name: 'teacher',
  component: RouteView,
  redirect: '/award',
  meta: {
    title: '教师指南'
  },
  children: [
    {
      path: '/awardMsg',
      name: 'awardMsg',
      component: AwardMsg,
      meta: {
        title: '获奖信息'
      }
    },
    {
      path: '/taskPaper',
      name: 'taskPaper',
      component: TaskPaper,
      meta: {
        title: '课题及论文管理'
      }
    }
  ]
}

export default teachers
