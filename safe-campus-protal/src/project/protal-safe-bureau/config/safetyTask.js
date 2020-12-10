import { RouteView } from '../layouts'
// 安全任务
const TaskIssuance = resolve => require(['../views/safetyTask/TaskIssuance.vue'], resolve)
const AddTask = resolve => require(['../views/safetyTask/AddTask.vue'], resolve)
const Preview = resolve => require(['../views/safetyTask/Preview.vue'], resolve)
const PostTask = resolve => require(['../views/safetyTask/PostTask.vue'], resolve)
const CheckCompletion = resolve => require(['../views/safetyTask/CheckCompletion.vue'], resolve)
const ViewStatistics = resolve => require(['../views/safetyTask/ViewStatistics.vue'], resolve)

const safetyTask = {
  path: '/safetyTask',
  name: 'safetyTask',
  component: RouteView,
  meta: {
    title: '安全任务'
  },
  children: [
    {
      path: '/taskIssuance',
      name: 'taskIssuance',
      component: TaskIssuance,
      meta: {
        title: '任务下发'
        // isHide: true
      }
    },
    {
      path: '/taskIssuance/addTask',
      name: 'addTask',
      component: AddTask,
      meta: {
        title: '添加任务',
        isHide: true
      }
    },
    {
      path: '/taskIssuance/preview',
      name: 'preview',
      component: Preview,
      meta: {
        title: '预览任务',
        isHide: true
      }
    },
    {
      path: '/taskIssuance/postTask',
      name: 'postTask',
      component: PostTask,
      meta: {
        title: '发布任务',
        isHide: true
      }
    },
    {
      path: '/taskIssuance/checkCompletion',
      name: 'checkCompletion',
      component: CheckCompletion,
      meta: {
        title: '任务完成情况',
        isHide: true
      }
    },
    {
      path: '/taskIssuance/viewStatistics',
      name: 'viewStatistics',
      component: ViewStatistics,
      meta: {
        title: '查看统计',
        isHide: true
      }
    }

    // {
    //   path: '/specialInspection/views',
    //   name: 'views',
    //   component: Views,
    //   meta: {
    //     title: '查看',
    //     isHide: true
    //   }
    // },

  ]
}

export default safetyTask
