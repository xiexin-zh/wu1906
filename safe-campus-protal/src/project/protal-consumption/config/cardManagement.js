// 卡务管理
import { RouteView } from '../layouts'
const CardAccount = resolve => require(['../views/cardManage/CardAccount.vue'], resolve)
const CardDetails = resolve => require(['../views/cardManage/CardDetails.vue'], resolve)
const CardOperationRecord = resolve => require(['../views/cardManage/CardOperationRecord.vue'], resolve)
const cardManagement = {
  path: '/cardAccount',
  name: 'cardAccount',
  component: RouteView,
  meta: {
    title: '卡务管理'
  },
  children: [
    {
      path: '/cardAccount',
      name: 'cardAccount',
      component: CardAccount,
      meta: {
        title: '卡列表'
      }
    },
    {
      path: '/cardAccount/cardDetails',
      name: 'cardDetails',
      component: CardDetails,
      meta: {
        title: '卡务详情',
        isHide: true
      }
    },
    {
      path: '/cardOperationRecord',
      name: 'cardOperationRecord',
      component: CardOperationRecord,
      meta: {
        title: '卡操作记录'
      }
    }
  ]
}

export default cardManagement
