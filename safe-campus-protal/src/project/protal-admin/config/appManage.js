// 系统表单
import { RouteView } from '../layouts'
const PcApp = resolve => require(['../views/appManage/PcApp.vue'], resolve)
const PcMenu = resolve => require(['../views/appManage/PcMenu.vue'], resolve)
const MobileApp = resolve => require(['../views/appManage/MobileApp.vue'], resolve)
const MobileMenu = resolve => require(['../views/appManage/MobileMenu.vue'], resolve)
const AppDetail = resolve => require(['../views/appManage/AppDetail.vue'], resolve)
const apply = {
  path: '/pcMenu',
  name: 'pcMenu',
  component: RouteView,
  meta: {
    title: '应用管理'
  },
  children: [
    {
      path: '/pcMenu',
      name: 'pcMenu',
      component: PcMenu,
      meta: {
        title: 'PC菜单库'
      }
    },
    {
      path: '/pcApp',
      name: 'pcApp',
      component: PcApp,
      meta: {
        title: 'PC应用库'
      }
    },
    {
      path: '/mobileMenu',
      name: 'mobileMenu',
      component: MobileMenu,
      meta: {
        title: 'APP菜单库'
      }
    },
    {
      path: '/mobileApp',
      name: 'mobileApp',
      component: MobileApp,
      meta: {
        title: 'APP应用库'
      }
    },
    {
      path: '/app/detail',
      name: 'appDetail',
      component: AppDetail,
      meta: {
        title: '应用详情',
        isHide: true
      }
    }
  ]
}

export default apply
