import { RouteView } from '../layouts'
const DormManage = resolve => require(['../views/dorm-manage/DormManage.vue'], resolve)
const DormRecord = resolve => require(['../views/dorm-manage/DormRecord.vue'], resolve)
const ManageSet = resolve => require(['../views/dorm-manage/ManageSet.vue'], resolve)
const argumentSet = {
  path: '/dorm',
  name: '_dormManage',
  component: RouteView,
  meta: {
    title: '宿舍管理'
  },
  children: [
    {
      path: '/dormManage',
      name: 'dormManage',
      component: DormManage,
      meta: {
        title: '宿舍管理'
      }
    },
    {
      path: '/dormRecord',
      name: 'dormRecord',
      component: DormRecord,
      meta: {
        title: '宿舍档案'
      }
    },
    {
      path: '/manageSet',
      name: 'manageSet',
      component: ManageSet,
      meta: {
        title: '宿管设置'
      }
    }
  ]
}

export default argumentSet
