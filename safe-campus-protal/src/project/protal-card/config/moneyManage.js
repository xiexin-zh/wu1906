// 系统表单
import { RouteView } from '../layouts'
const AccountList = resolve => require(['../views/moneyManage/AccountList.vue'], resolve)
const SubsidyManage = resolve => require(['../views/moneyManage/SubsidyManage.vue'], resolve)
const money = {
  path: '/money',
  name: 'money',
  component: RouteView,
  meta: {
    title: '增减款管理'
  },
  children: [
    {
      path: '/accountList',
      name: 'accountList',
      component: AccountList,
      meta: {
        title: '账户列表'
      }
    },
    {
      path: '/subsidyManage',
      name: 'subsidyManage',
      component: SubsidyManage,
      meta: {
        title: '补助管理'
      }
    }
  ]
}

export default money
