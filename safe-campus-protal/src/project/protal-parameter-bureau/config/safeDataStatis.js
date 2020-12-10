import { RouteView } from '../layouts'
// 安全数据统计
const safeDataStatis = {
  path: '/safeDataStatis',
  name: 'safeDataStatis',
  component: RouteView,
  meta: {
    title: '安全数据统计'
  },
  children: [
    {
      path: '/dailyStatis',
      name: 'dailyStatis',
      component: () => import('../views/safeDataStatis/DailyStatis.vue'),
      meta: {
        title: '日常巡查统计'
      }
    },
    {
      path: '/dailyStatis/statisTable',
      name: 'statisTable',
      component: () => import('../views/safeDataStatis/StatisTable.vue'),
      meta: {
        title: '安全巡检统计',
        isHide: true
      }
    },
    {
      path: '/specialStatis',
      name: 'specialStatis',
      component: () => import('../views/safeDataStatis/SpecialStatis.vue'),
      meta: {
        title: '专项检查统计'
      }
    },
    {
      path: '/dangerStatis',
      name: 'dangerStatis',
      component: () => import('../views/safeDataStatis/DangerStatis.vue'),
      meta: {
        title: '安全隐患统计'
      }
    }
  ]
}

export default safeDataStatis
