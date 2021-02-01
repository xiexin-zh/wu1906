// import { RouteView } from '../layouts'
const Course = resolve => require(['../views/course/Course.vue'], resolve)

const courseManage = {
  path: '/course',
  name: 'course',
  component: Course,
  meta: {
    title: '课程管理'
  }
}

export default courseManage
