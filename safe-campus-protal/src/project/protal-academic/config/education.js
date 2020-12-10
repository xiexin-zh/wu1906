// 教学管理
import { RouteView } from '../layouts'
const TaskPlan = resolve => require(['../views/education/TaskPlan.vue'], resolve)
const AddPlan = resolve => require(['../views/education/AddPlan.vue'], resolve)
const PlanDetails = resolve => require(['../views/education/PlanDetails.vue'], resolve)
const QualityIndex = resolve => require(['../views/education/QualityIndex.vue'], resolve)
const QualityAssessment = resolve => require(['../views/education/QualityAssessment.vue'], resolve)

const educational = {
  path: '/education',
  name: 'education',
  component: RouteView,
  redirect: '/taskPlan',
  meta: {
    title: '教学管理'
  },
  children: [
    {
      path: '/taskPlan',
      name: 'taskPlan',
      component: TaskPlan,
      meta: {
        title: '教学计划管理'
      }
    },
    {
      path: '/taskPlan/addPlan',
      name: 'addPlan',
      component: AddPlan,
      meta: {
        title: '添加计划管理',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/taskPlan/planDetails',
      name: 'planDetails',
      component: PlanDetails,
      meta: {
        title: '计划详情',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/qualityIndex',
      name: 'qualityIndex',
      component: QualityIndex,
      meta: {
        title: '教学质量指标'
      }
    },
    {
      path: '/qualityAssessment',
      name: 'qualityAssessment',
      component: QualityAssessment,
      meta: {
        title: '教学质量评价'
      }
    }
  ]
}

export default educational
