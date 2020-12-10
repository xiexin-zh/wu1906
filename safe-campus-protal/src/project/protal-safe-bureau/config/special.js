import { RouteView } from '../layouts'
// 专项检查
const AddCheckItem = resolve => require(['../views/specialInspection/AddCheckItem.vue'], resolve)
const TaskRecord = resolve => require(['../views/specialInspection/TaskRecord.vue'], resolve)
const CheckItem = resolve => require(['../views/specialInspection/CheckItem.vue'], resolve)
const AddSpecialItem = resolve => require(['../views/specialInspection/AddSpecialItem.vue'], resolve)
const Views = resolve => require(['../views/specialInspection/Views.vue'], resolve)
const ViewsReport = resolve => require(['../views/specialInspection/ViewsReport.vue'], resolve)
const special = {
  path: '/specialInspection',
  name: 'specialInspection',
  component: RouteView,
  meta: {
    title: '专项检查'
  },
  children: [
    {
      path: '/taskRecord',
      name: 'taskRecord',
      component: TaskRecord,
      meta: {
        title: '任务记录'
        // isHide: true
      }
    },
    {
      path: '/checkItem',
      name: 'checkItem',
      component: CheckItem,
      meta: {
        title: '检查项目'
      }
    },
    {
      path: '/specialInspection/addSpecialItem',
      name: 'addSpecialItem',
      component: AddSpecialItem,
      meta: {
        title: '添加专项检查',
        isHide: true
      }
    },
    {
      path: '/specialInspection/addCheck',
      name: 'addCheck',
      component: AddCheckItem,
      meta: {
        title: '添加检查项目',
        isHide: true
      }
    },
    {
      path: '/specialInspection/views',
      name: 'views',
      component: Views,
      meta: {
        title: '查看',
        isHide: true
      }
    },
    {
      path: '/specialInspection/viewsReport',
      name: 'viewsReport',
      component: ViewsReport,
      meta: {
        title: '查看报告',
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

export default special
