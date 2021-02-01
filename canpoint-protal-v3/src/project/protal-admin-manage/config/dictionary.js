import { RouteView } from '../layouts'
const Holiday = resolve => require(['../views/holiday/Holiday.vue'], resolve)
const Subject = resolve => require(['../views/subject/Subject.vue'], resolve)
const dictionaryManage = {
  path: '/dictionary',
  name: 'dictionary',
  redirect: '/holiday',
  component: RouteView,
  meta: {
    title: '数据字典'
  },
  children: [
    {
      path: '/holiday',
      name: 'holiday',
      component: Holiday,
      meta: {
        title: '节假日管理'
      }
    },
    {
      path: '/subject',
      name: 'subject',
      component: Subject,
      meta: {
        title: '学科管理'
      }
    }
  ]
}

export default dictionaryManage
