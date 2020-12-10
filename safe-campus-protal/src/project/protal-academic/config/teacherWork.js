// 教研管理
import { RouteView } from '../layouts'
const WorkPlan = resolve => require(['../views/teacherWork/WorkPlan.vue'], resolve)
const Summary = resolve => require(['../views/teacherWork/Summary.vue'], resolve)
const AddWorkPlan = resolve => require(['../views/teacherWork/AddWorkPlan.vue'], resolve)
const WorkDetails = resolve => require(['../views/teacherWork/WorkDetails.vue'], resolve)
const AddSummary = resolve => require(['../views/teacherWork/AddSummary.vue'], resolve)
const SummaryDetails = resolve => require(['../views/teacherWork/SummaryDetails.vue'], resolve)

const teacherWork = {
  path: '/teacherWork',
  name: 'teacherWork',
  component: RouteView,
  redirect: '/workPlan',
  meta: {
    title: '教师工作管理'
  },
  children: [
    {
      path: '/workPlan',
      name: 'workPlan',
      component: WorkPlan,
      meta: {
        title: '教师工作计划管理'
      }
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary,
      meta: {
        title: '教师质量总结'
      }
    },
    {
      path: '/teacherWork/addWorkPlan',
      name: 'addWorkPlan',
      component: AddWorkPlan,
      meta: {
        title: '添加工作计划',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/teacherWork/workDetails',
      name: 'workDetails',
      component: WorkDetails,
      meta: {
        title: '工作计划详情',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/teacherWork/addSummary',
      name: 'addSummary',
      component: AddSummary,
      meta: {
        title: '添加总结',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/teacherWork/summaryDetails',
      name: 'summaryDetails',
      component: SummaryDetails,
      meta: {
        title: '总结详情',
        isHide: true
      },
      hidden: true
    }
  ]
}

export default teacherWork
