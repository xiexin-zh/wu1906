import { RouteView } from '../layouts'
const RuleSet = resolve => require(['../views/attendance-set/RuleSet.vue'], resolve)
const StudentSet = resolve => require(['../views/attendance-set/StudentSet.vue'], resolve)
const TeacherSet = resolve => require(['../views/attendance-set/TeacherSet.vue'], resolve)
const SetGroup = resolve => require(['../views/attendance-set/SetGroup.vue'], resolve)
const dictionaryManage = {
  path: '/teacherSet',
  name: '_teacherSet',
  redirect: '/teacherSet',
  component: RouteView,
  meta: {
    title: '考勤组设置'
  },
  children: [
    {
      path: '/teacherSet',
      name: 'teacherSet',
      component: TeacherSet,
      meta: {
        title: '教职工考勤'
      }
    },
    {
      path: '/studentSet',
      name: 'studentSet',
      component: StudentSet,
      meta: {
        title: '学生考勤'
      }
    },
    {
      path: '/setGroup',
      name: 'setGroup',
      component: SetGroup,
      meta: {
        title: '权限组管理'
      },
      hidden: true
    },
    {
      path: '/ruleSet',
      name: 'ruleSet',
      component: RuleSet,
      meta: {
        title: '班次管理'
      }
    }
  ]
}

export default dictionaryManage
