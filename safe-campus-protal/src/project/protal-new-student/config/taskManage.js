// 招生任务
import { RouteView } from '../layouts'
const TaskManage = resolve => require(['../views/TaskManage/TaskManage.vue'], resolve)
const AddTask = resolve => require(['../views/TaskManage/AddTask.vue'], resolve)
const TaskDetails = resolve => require(['../views/TaskManage/TaskDetails.vue'], resolve)
const StudentApply = resolve => require(['../views/TaskManage/StudentApply.vue'], resolve)
const ApplyDetails = resolve => require(['../views/TaskManage/ApplyDetails.vue'], resolve)
const task = {
  path: '/taskManage',
  name: 'taskManage',
  component: RouteView,
  redirect: '/taskList',
  meta: {
    title: '招生管理'
  },
  children: [
    {
      path: '/taskList',
      name: 'taskList',
      component: TaskManage,
      meta: {
        title: '招生任务'
      }
    },
    {
      path: '/studentApply',
      name: 'studentApply',
      component: StudentApply,
      meta: {
        title: '新生申请'
      }
    },
    {
      path: '/taskManage/addTask',
      name: 'addTask',
      component: AddTask,
      meta: {
        title: '添加任务',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/taskManage/taskDetails',
      name: 'taskDetails',
      component: TaskDetails,
      meta: {
        title: '任务详情',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/studentApply/applyDetails',
      name: 'applyDetails',
      component: ApplyDetails,
      meta: {
        title: '申请详情',
        isHide: true
      },
      hidden: true
    }
  ]
}

export default task
