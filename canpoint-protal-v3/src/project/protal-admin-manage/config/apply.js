import { RouteView } from '../layouts'
const App = resolve => require(['../views/apply/App.vue'], resolve)
const Pc = resolve => require(['../views/apply/Pc.vue'], resolve)
const AppMenu = resolve => require(['../views/menus/App.vue'], resolve)
const PcMenu = resolve => require(['../views/menus/Pc.vue'], resolve)
const ApplyDetail = resolve => require(['../views/apply/ApplyDetail.vue'], resolve)
const institution = {
  path: '/menuManage',
  name: 'menuManage',
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
        title: 'PC菜单'
      }
    },
    {
      path: '/appMenu',
      name: 'appMenu',
      component: AppMenu,
      meta: {
        title: 'APP菜单'
      }
    },
    {
      path: '/pc',
      name: 'pc',
      component: Pc,
      meta: {
        title: 'PC应用'
      }
    },
    {
      path: '/apply/applyDetail',
      name: 'applyDetail',
      component: ApplyDetail,
      meta: {
        title: '应用详情',
        isHide: true
      }
    },
    {
      path: '/app',
      name: 'app',
      component: App,
      meta: {
        title: 'APP应用'
      }
    }
  ]
}

export default institution
