// 系统表单
import { RouteView } from '../layouts'
const StudentAccess = resolve => require(['../views/AccessSet/StudentAccess.vue'], resolve)
const TeacherAccess = resolve => require(['../views/AccessSet/TeacherAccess.vue'], resolve)
const SetGroup = resolve => require(['../views/AccessSet/SetGroup.vue'], resolve)
const DoorSet = resolve => require(['../views/AccessSet/DoorSet.vue'], resolve)
const visitor = {
  path: '/accessSet',
  name: 'accessSet',
  component: RouteView,
  meta: {
    title: '通行权限设置'
  },
  children: [
    {
      path: '/studentAccess',
      name: 'studentAccess',
      component: StudentAccess,
      meta: {
        title: '学生通行'
      }
    },
    {
      path: '/teacherAccess',
      name: 'teacherAccess',
      component: TeacherAccess,
      meta: {
        title: '教职工通行'
      }
    },
    {
      path: '/doorSet',
      name: 'doorSet',
      component: DoorSet,
      meta: {
        title: '门卫设置'
      }
    },
    {
      path: '/studentAccess/setGroup',
      name: 'setGroup',
      component: SetGroup,
      meta: {
        title: '权限组管理'
      },
      hidden: true
    },
    {
      path: '/teacherAccess/setGroup',
      name: 'setGroup',
      component: SetGroup,
      meta: {
        title: '权限组管理'
      },
      hidden: true
    }
  ]
}

export default visitor
