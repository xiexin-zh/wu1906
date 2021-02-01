import { RouteView } from '../layouts'
const KnowingStatis = resolve => require(['../views/knowing-statis/KnowingStatis.vue'], resolve)
const PersonStatis = resolve => require(['../views/knowing-statis/PersonStatis.vue'], resolve)
const StatisDetail = resolve => require(['../views/knowing-statis/StatisDetail.vue'], resolve)
const PersonStatisDetail = resolve => require(['../views/knowing-statis/PersonStatisDetail.vue'], resolve)

// const ManageSet = resolve => require(['../views/knowing-statis/ManageSet.vue'], resolve)
const knowingStatis = {
  path: '/knowingStatis',
  name: 'knowingStatis',
  component: RouteView,
  meta: {
    title: '查寝统计'
  },
  children: [
    {
      path: '/knowingStatis',
      name: 'knowingStatis',
      component: KnowingStatis,
      meta: {
        title: '查寝统计'
      }
    },
    {
      path: '/knowingStatis/statisDetail',
      name: 'statisDetail',
      component: StatisDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    },
    {
      path: '/personStatis',
      name: 'personStatis',
      component: PersonStatis,
      meta: {
        title: '个人统计'
      }
    },
    {
      path: '/personStatis/personStatisDetail',
      name: 'personStatisDetail',
      component: PersonStatisDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    }

  ]
}

export default knowingStatis
