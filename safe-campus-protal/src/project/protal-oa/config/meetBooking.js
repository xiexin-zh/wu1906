// 系统表单
import { RouteView } from '../layouts'
const MeetBooking = resolve => require(['../views/MeetBooking/MeetBooking.vue'], resolve)
const AddMeetBooking = resolve => require(['../views/MeetBooking/AddMeetBooking.vue'], resolve)
const meetBooking = {
  path: '/meetBooking',
  name: '/meetBooking',
  component: RouteView,
  meta: {
    title: '会议管理系统'
  },
  children: [
    {
      path: '/meetBooking',
      name: 'meetBooking',
      component: MeetBooking,
      meta: {
        title: '会议发布'
      }
    },
    {
      path: '/meetBooking/addMeetBooking',
      name: 'addMeetBooking',
      component: AddMeetBooking,
      meta: {
        title: '会议发布',
        isHide: true
      }
    }
  ]
}

export default meetBooking
