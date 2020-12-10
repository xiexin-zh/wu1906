// 账户管理
import { RouteView } from '../layouts'
const AccountList = resolve => require(['../views/accountMge/AccountList.vue'], resolve)
const CardReadingRecharge = resolve => require(['../views/accountMge/CardReadingRecharge.vue'], resolve)
const AccountOperation = resolve => require(['../views/accountMge/AccountOperation.vue'], resolve)
const AccountDetails = resolve => require(['../views/accountMge/AccountDetails.vue'], resolve)
const subsidyManage = resolve => require(['../views/accountMge/SubsidyManage.vue'], resolve)
const AddSubsidy = resolve => require(['../views/accountMge/AddSubsidy.vue'], resolve)

const accountMge = {
  path: '/accountList',
  name: 'accountList',
  component: RouteView,
  meta: {
    title: '账户管理'
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
      path: '/accountList/accountDetails',
      name: 'accountDetails',
      component: AccountDetails,
      meta: {
        title: '账户详情',
        isHide: true
      }
    },
    {
      path: '/cardReadingRecharge',
      name: 'cardReadingRecharge',
      component: CardReadingRecharge,
      meta: {
        title: '读卡充值'
      }
    },
    {
      path: '/subsidyManage',
      name: 'subsidyManage',
      component: subsidyManage,
      meta: {
        title: '补助管理'
      }
    },
    {
      path: '/subsidyManage/addSubsidy',
      name: '/subsidyManage/addSubsidy',
      component: AddSubsidy,
      meta: {
        title: '补助管理'
      },
      hidden: true
    },
    {
      path: '/accountOperationRecord',
      name: 'accountOperationRecord',
      component: AccountOperation,
      meta: {
        title: '账户操作记录'
      }
    }
  ]
}
export default accountMge
