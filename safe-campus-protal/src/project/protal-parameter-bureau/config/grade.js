/*
 * @Author: your name
 * @Date: 2020-11-03 14:30:23
 * @LastEditTime: 2020-11-05 16:40:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \new-protal-base\src\project\protal-parameter-bureau\config\Grade.js
 */
import { RouteView } from '../layouts'
// 安全数据统计
const grade = {
  path: '/grade',
  name: 'grade',
  component: RouteView,
  meta: {
    title: '绩效考核评分'
  },
  children: [
    {
      path: '/gradeRule',
      name: 'gradeRule',
      component: () => import('../views/grade/GradeRule.vue'),
      meta: {
        title: '评分规则'
      }
    },
    {
      path: '/assessStatis/assessDetail',
      name: 'assessDetail',
      component: () => import('../views/grade/AssessDetail.vue'),
      meta: {
        title: '考核详情',
        isHide: true
      }
    },
    {
      path: '/assessStatis',
      name: 'assessStatis',
      component: () => import('../views/grade/AssessStatis.vue'),
      meta: {
        title: '考核统计'
      }
    },
    {
      path: '/assessStatis/seeAll',
      name: 'seeAll',
      component: () => import('../views/grade/SeeAll.vue'),
      meta: {
        title: '查看全部',
        isHide: true
      }
    }

  ]
}

export default grade
