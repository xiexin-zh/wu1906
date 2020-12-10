import { RouteView } from '../layouts'
const AssignTask = resolve => require(['../views/safeTask/AssignTask.vue'], resolve)
const MyTask = resolve => require(['../views/safeTask/MyTask.vue'], resolve)
const AddTask = resolve => require(['../views/safeTask/AddTask.vue'], resolve)
const FillTask = resolve => require(['../views/safeTask/FillTask.vue'], resolve)
const TaskDetail = resolve => require(['../views/safeTask/TaskDetail.vue'], resolve)
const TaskComplete = resolve => require(['../views/safeTask/TaskComplete.vue'], resolve)
const TaskStatistics = resolve => require(['../views/safeTask/TaskStatistics.vue'], resolve)
const PostTask = resolve => require(['../views/safeTask/PostTask.vue'], resolve)
const TaskPreview = resolve => require(['../views/safeTask/TaskPreview.vue'], resolve)
const task = {
  path: '/task',
  name: 'task',
  component: RouteView,
  meta: {
    title: '安全任务'
  },
  children: [
    {
      path: '/assignTask/taskDetail',
      name: 'taskDetail',
      component: TaskDetail,
      meta: {
        title: '预览',
        isHide: true
      }
    },
    {
      path: '/myTask',
      name: 'myTask',
      component: MyTask,
      meta: {
        title: '我的任务'
      }
    },
    {
      path: '/assignTask/postTask',
      name: 'postTask',
      component: PostTask,
      meta: {
        title: '发布任务',
        isHide: true
      }
    },
    {
      path: '/myTask/taskPreview',
      name: 'taskPreview',
      component: TaskPreview,
      meta: {
        title: '查看任务',
        isHide: true
      }
    },
    {
      path: '/myTask/fillTask',
      name: 'fillTask',
      component: FillTask,
      meta: {
        title: '任务管理',
        isHide: true
      }
    },
    {
      path: '/assignTask',
      name: 'assignTask',
      component: AssignTask,
      meta: {
        title: '任务下发'
      }
    },
    {
      path: '/assignTask/addTask',
      name: 'addTask',
      component: AddTask,
      meta: {
        title: '下发任务',
        isHide: true
      }
    },
    {
      path: '/assignTask/taskComplete',
      name: 'taskComplete',
      component: TaskComplete,
      meta: {
        title: '任务完成情况',
        isHide: true
      }
    },
    {
      path: '/assignTask/taskStatistics',
      name: 'taskStatistics',
      component: TaskStatistics,
      meta: {
        title: '查看统计',
        isHide: true
      }
    }
  ]
}

export default task
