// 系统表单
import { RouteView } from '../layouts'
const ScoreManage = resolve => require(['../views/classMoral/ScoreManage.vue'], resolve)
const ScoreRecord = resolve => require(['../views/classMoral/ScoreRecord.vue'], resolve)
const ScoreStatistics = resolve => require(['../views/classMoral/ScoreStatistics.vue'], resolve)
const moral = {
  path: '/class',
  name: 'class',
  component: RouteView,
  meta: {
    title: '班级德育管理'
  },
  children: [
    {
      path: '/scoreManage',
      name: 'scoreManage',
      component: ScoreManage,
      meta: {
        title: '评分管理'
      }
    },
    {
      path: '/scoreRecord',
      name: 'scoreRecord',
      component: ScoreRecord,
      meta: {
        title: '评分记录'
      }
    },
    {
      path: '/scoreStatistics',
      name: 'scoreStatistics',
      component: ScoreStatistics,
      meta: {
        title: '评分统计'
      }
    }
  ]
}

export default moral
