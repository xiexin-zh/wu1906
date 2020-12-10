// 新生管理
import { RouteView } from '../layouts'
const StudentList = resolve => require(['../views/NewStudentManage/StudentManage.vue'], resolve)
const StudentDetails = resolve => require(['../views/NewStudentManage/StudentDetails.vue'], resolve)
const StudentClasses = resolve => require(['../views/NewStudentManage/StudentClass.vue'], resolve)
const DeviceManege = resolve => require(['../views/DeviceManege/DeviceManege.vue'], resolve)
const studentManage = {
  path: '/studentManage',
  name: 'studentManage',
  component: RouteView,
  meta: {
    title: '迎新管理'
  },
  children: [
    {
      path: '/studentManage',
      name: 'studentManage',
      component: StudentList,
      meta: {
        title: '新生管理'
      }
    },
    {
      path: '/studentClasses',
      name: 'studentClasses',
      component: StudentClasses,
      meta: {
        title: '新生分班'
      }
    },
    {
      path: '/deviceManage',
      name: 'deviceManage',
      component: DeviceManege,
      meta: {
        title: '迎新设备'
      }
    },
    {
      path: '/studentManage/studentDetails',
      name: 'studentDetails',
      component: StudentDetails,
      meta: {
        title: '新生详情',
        isHide: true
      },
      hidden: true
    }
  ]
}

export default studentManage
