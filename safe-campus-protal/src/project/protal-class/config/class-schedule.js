/**
 * @description 校园管理路由列表
 */

import { RouteView } from '../layouts'
const ClassHour = resolve => require(['../views/classSchedule/ClassHour.vue'], resolve)
const CourseManage = resolve => require(['../views/classSchedule/CourseManage.vue'], resolve)
// const TeacherManage = resolve => require(['../views/classSchedule/TeacherManage.vue'], resolve)
const Schedule = resolve => require(['../views/classSchedule/Schedule'], resolve)

const ScheduleList = {
  path: '/classSchedule',
  name: 'classSchedule',
  component: RouteView,
  meta: {
    title: '课程表'
  },
  children: [
    {
      path: '/classHour',
      name: 'classHour',
      component: ClassHour,
      meta: {
        title: '课时管理'
      }
    },
    /* {
      path: '/teacherManage',
      name: 'teacherManage',
      component: TeacherManage,
      meta: {
        title: '教师管理'
      }
    }, */
    {
      path: '/courseManage',
      name: 'courseManage',
      component: CourseManage,
      meta: {
        title: '课表管理'
      }
    },
    {
      path: '/schedule',
      name: 'Schedule',
      component: Schedule,
      meta: {
        title: '课程表'
      }
    }
  ]
}

export default ScheduleList
