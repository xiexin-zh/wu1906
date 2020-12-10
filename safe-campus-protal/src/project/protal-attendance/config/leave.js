// 系统表单
import { RouteView } from '../layouts'
const TeacherLeave = resolve => require(['../views/leaveManage/TeacherLeave.vue'], resolve)
const TeacherLeaveDetail = resolve => require(['../views/leaveManage/TeacherLeaveDetail.vue'], resolve)
const StudentLeave = resolve => require(['../views/leaveManage/StudentLeave.vue'], resolve)
const StudentLeaveDetail = resolve => require(['../views/leaveManage/StudentLeaveDetail.vue'], resolve)
const leave = {
  path: '/teacherLeave',
  name: 'teacherLeave',
  component: RouteView,
  meta: {
    title: '请假管理'
  },
  children: [
    {
      path: '/teacherLeave',
      name: 'teacherLeave',
      component: TeacherLeave,
      meta: {
        title: '教职工请假'
      }
    },
    {
      path: '/teacherLeave/detail',
      name: 'teacherDetail',
      component: TeacherLeaveDetail,
      meta: {
        title: '请假详情',
        isHide: true
      }
    },
    {
      path: '/studentLeave',
      name: 'studentLeave',
      component: StudentLeave,
      meta: {
        title: '学生请假'
      }
    },
    {
      path: '/studentLeave/detail',
      name: 'studentDetail',
      component: StudentLeaveDetail,
      meta: {
        title: '请假详情',
        isHide: true
      }
    }
  ]
}

export default leave
