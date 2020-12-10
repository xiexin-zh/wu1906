// 系统表单
import { RouteView } from '../layouts'
const SiteBooking = resolve => require(['../views/SiteBooking/SiteBooking.vue'], resolve)
const AddBooking = resolve => require(['../views/SiteBooking/AddBooking.vue'], resolve)
const sitebooking = {
  path: '/siteBooking',
  name: '/siteBooking',
  component: RouteView,
  meta: {
    title: '场地预订系统'
  },
  children: [
    {
      path: '/siteBooking',
      name: 'siteBooking',
      component: SiteBooking,
      meta: {
        title: '场地预订'
      }
    },
    {
      path: '/siteBooking/addBooking',
      name: 'addBooking',
      component: AddBooking,
      meta: {
        title: '场地预订',
        isHide: true
      }
    }
  ]
}

export default sitebooking
