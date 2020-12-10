// 账单记录
import { RouteView } from '../layouts'
const ConsumeRecord = resolve => require(['../views/tradeManage/ConsumeRecord.vue'], resolve)
const RechargeRecord = resolve => require(['../views/tradeManage/RechargeRecord.vue'], resolve)
const GrantRecord = resolve => require(['../views/tradeManage/GrantRecord.vue'], resolve)
// const DeductionRecord = resolve => require(['../views/tradeManage/DeductionRecord.vue'], resolve)
const RefundRecord = resolve => require(['../views/tradeManage/RefundRecord.vue'], resolve)
const BalanceResetRecord = resolve => require(['../views/tradeManage/BalanceResetRecord.vue'], resolve)
const trade = {
  path: '/trade',
  name: 'trade',
  component: RouteView,
  meta: {
    title: '账单记录'
  },
  children: [
    {
      path: '/consumeRecord',
      name: 'consumeRecord',
      component: ConsumeRecord,
      meta: {
        title: '消费记录'
      }
    },
    {
      path: '/rechargeRecord',
      name: 'rechargeRecord',
      component: RechargeRecord,
      meta: {
        title: '充值记录'
      }
    },
    {
      path: '/grantRecord',
      name: 'grantRecord',
      component: GrantRecord,
      meta: {
        title: '补助发放记录'
      }
    },
    /* {
      path: '/deductionRecord',
      name: 'deductionRecord',
      component: DeductionRecord,
      meta: {
        title: '撤销记录'
      }
    }, */
    {
      path: '/refundRecord',
      name: 'refundRecord',
      component: RefundRecord,
      meta: {
        title: '退款记录'
      }
    },
    {
      path: '/balanceResetRecord',
      name: 'balanceResetRecord',
      component: BalanceResetRecord,
      meta: {
        title: '余额清零记录'
      }
    }
  ]
}

export default trade
