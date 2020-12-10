import { RouteView } from '../layouts'
const RestClassify = resolve => require(['../views/rest/RestClassify.vue'], resolve)
const RadioTask = resolve => require(['../views/rest/RadioTask.vue'], resolve)
const RadioToday = resolve => require(['../views/rest/RadioToday.vue'], resolve)
const AddRadioTask = resolve => require(['../views/rest/AddRadioTask.vue'], resolve)

const rest = {
  path: '/rest',
  name: 'rest',
  component: RouteView,
  meta: {
    title: '作息广播管理'
  },
  children: [
    {
      path: '/restClassify',
      name: 'restClassify',
      component: RestClassify,
      meta: {
        title: '作息分类'
      }
    },
    {
      path: '/radioTask',
      name: 'radioTask',
      component: RadioTask,
      meta: {
        title: '广播任务'
      }
    },
    {
      path: '/radioToday',
      name: 'radioToday',
      component: RadioToday,
      meta: {
        title: '今日广播'
      }
    },
    {
      path: '/radioTask/addRadioTask',
      name: 'addRadioTask',
      component: AddRadioTask,
      meta: {
        title: '新增任务',
        isHide: true
      }
    }
  ]
}

export default rest
