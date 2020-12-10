// 系统表单
import { RouteView } from '../layouts'
const ApplyManage = resolve => require(['../views/apply/ApplyManage.vue'], resolve)
const ApplyDetail = resolve => require(['../views/apply/ApplyDetail.vue'], resolve)
const AppMenuManage = resolve => require(['../views/apply/AppMenuManage.vue'], resolve)
const AppApplyManage = resolve => require(['../views/apply/AppApplyManage.vue'], resolve)
const MenuManage = resolve => require(['../views/apply/MenuManage.vue'], resolve)
const apply = {
  path: '/app',
  name: 'app',
  component: RouteView,
  meta: {
    title: '应用管理'
  },
  children: [
    {
      path: '/menuManage',
      name: 'menuManage',
      component: MenuManage,
      meta: {
        title: 'PC菜单库'
      }
    },
    {
      path: '/apply',
      name: 'applyManage',
      component: ApplyManage,
      meta: {
        title: 'PC应用库'
      }
    },
    {
      path: '/appMenuManage',
      name: 'appMenuManage',
      component: AppMenuManage,
      meta: {
        title: 'APP菜单库'
      }
    },
    {
      path: '/appApply',
      name: 'appApplyManage',
      component: AppApplyManage,
      meta: {
        title: 'APP应用库'
      }
    },
    {
      path: '/apply/detail',
      name: 'applyDetail',
      component: ApplyDetail,
      meta: {
        title: '应用详情',
        isHide: true
      }
    }
  ]
}

export default apply
