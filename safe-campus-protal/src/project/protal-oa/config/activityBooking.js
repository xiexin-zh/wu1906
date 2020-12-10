// 系统表单
import { RouteView } from '../layouts'
const ActivityBooking = resolve => require(['../views/ActivityBooking/ActivityBooking.vue'], resolve)
const AddActivityBooking = resolve => require(['../views/ActivityBooking/AddActivityBooking.vue'], resolve)
const activityBooking = {
  path: '/activityBooking',
  name: '/activityBooking',
  component: RouteView,
  meta: {
    title: '活动发布系统'
  },
  children: [
    {
      path: '/activityBooking',
      name: 'activityBooking',
      component: ActivityBooking,
      meta: {
        title: '活动发布'
      }
    },
    {
      path: '/activityBooking/addActivityBooking',
      name: 'addActivityBooking',
      component: AddActivityBooking,
      meta: {
        title: '活动发布',
        isHide: true
      }
    }
  ]
}

export default activityBooking
