// 教研管理
import { RouteView } from '../layouts'
const TeachingGroup = resolve => require(['../views/teachingManage/TeachingGroup.vue'], resolve)
const TeachingPlan = resolve => require(['../views/teachingManage/TeachingPlan.vue'], resolve)
const TeachingActivity = resolve =>
  require(['../views/teachingManage/TeachingActivity.vue'], resolve)
const AddTeachingPlan = resolve => require(['../views/teachingManage/AddTeachingPlan.vue'], resolve)
const AddTeachingActivity = resolve =>
  require(['../views/teachingManage/AddTeachingActivity.vue'], resolve)
const TeachingDetails = resolve => require(['../views/teachingManage/TeachingDetails.vue'], resolve)

const LessonsPlan = resolve => require(['../views/teachingManage/LessonsPlan.vue'], resolve)
const LessonsActivity = resolve => require(['../views/teachingManage/LessonsActivity.vue'], resolve)
const AddLessonsPlan = resolve => require(['../views/teachingManage/AddLessonsPlan.vue'], resolve)
const AddLessonsActivity = resolve =>
  require(['../views/teachingManage/AddLessonsActivity.vue'], resolve)
const LessonsDetails = resolve => require(['../views/teachingManage/LessonsDetails.vue'], resolve)

const teachingManage = {
  path: '/teachingManage',
  name: 'teachingManage',
  component: RouteView,
  redirect: '/teachingGroup',
  meta: {
    title: '教研备课管理'
  },
  children: [
    {
      path: '/teachingGroup',
      name: 'teachingGroup',
      component: TeachingGroup,
      meta: {
        title: '教研备课组设置'
      }
    },
    {
      path: '/teachingPlan',
      name: 'teachingPlan',
      component: TeachingPlan,
      meta: {
        title: '教研计划管理'
      }
    },
    {
      path: '/teachingManage/addTeachingPlan',
      name: 'addTeachingPlan',
      component: AddTeachingPlan,
      meta: {
        title: '添加教研计划',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/teachingActivity',
      name: 'teachingActivity',
      component: TeachingActivity,
      meta: {
        title: '教研活动管理'
      }
    },
    {
      path: '/teachingManage/addTeachingActivity',
      name: 'addTeachingActivity',
      component: AddTeachingActivity,
      meta: {
        title: '添加教研活动',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/teachingManage/teachingDetails',
      name: 'teachingDetails',
      component: TeachingDetails,
      meta: {
        title: '教研活动详情',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/lessonsPlan',
      name: 'lessonsPlan',
      component: LessonsPlan,
      meta: {
        title: '备课计划管理'
      }
    },
    {
      path: '/teachingManage/addLessonsPlan',
      name: 'addLessonsPlan',
      component: AddLessonsPlan,
      meta: {
        title: '添加备课计划',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/LessonsActivity',
      name: 'LessonsActivity',
      component: LessonsActivity,
      meta: {
        title: '备课活动管理'
      }
    },
    {
      path: '/teachingManage/addLessonsActivity',
      name: 'addLessonsActivity',
      component: AddLessonsActivity,
      meta: {
        title: '添加备课活动',
        isHide: true
      },
      hidden: true
    },
    {
      path: '/teachingManage/lessonsDetails',
      name: 'lessonsDetails',
      component: LessonsDetails,
      meta: {
        title: '备课活动详情',
        isHide: true
      },
      hidden: true
    }
  ]
}

export default teachingManage
