// 系统表单
import { RouteView } from '../layouts'
const BehaviorIndex = resolve => require(['../views/behaviorEva/BehaviorIndex.vue'], resolve)
const BehaviorRecord = resolve => require(['../views/behaviorEva/BehaviorRecord.vue'], resolve)
const RecordDetail = resolve => require(['../views/behaviorEva/RecordDetail.vue'], resolve)
const moral = {
  path: '/behavior',
  name: 'behavior',
  component: RouteView,
  meta: {
    title: '行为评价'
  },
  children: [
    {
      path: '/behaviorIndex',
      name: 'behaviorIndex',
      component: BehaviorIndex,
      meta: {
        title: '评价指标'
      }
    },
    {
      path: '/behaviorRecord',
      name: 'behaviorRecord',
      component: BehaviorRecord,
      meta: {
        title: '评分记录'
      }
    },
    {
      path: '/recordDetail',
      name: 'recordDetail',
      component: RecordDetail,
      meta: {
        title: '评分详情'
      },
      hidden: true
    }
  ]
}

export default moral
