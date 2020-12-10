import { RouteView } from '../layouts'
const TeacherTemperatureSet = resolve => require(['../views/setTemperatureGroup/TeacherTemperatureSet.vue'], resolve)
const StudentTemperatureSet = resolve => require(['../views/setTemperatureGroup/StudentTemperatureSet.vue'], resolve)
const SetGroup = resolve => require(['../views/setTemperatureGroup/SetGroup.vue'], resolve)

const set = {
  path: '/teacherTemperatureSet',
  name: 'teacherTemperatureSet',
  component: RouteView,
  meta: {
    title: '测温组设置',
    icon: 'folder-open'
  },
  children: [
    {
      path: '/teacherTemperatureSet',
      name: 'teacherTemperatureSet',
      component: TeacherTemperatureSet,
      meta: {
        title: '教职工测温组',
        icon: 'folder-open'
      }
    },
    {
      path: '/teacherTemperatureSet/setGroup',
      name: 'setGroup',
      component: SetGroup,
      meta: {
        title: '测温组管理'
      },
      hidden: true
    },
    {
      path: '/studentTemperatureSet',
      name: 'studentTemperatureSet',
      component: StudentTemperatureSet,
      meta: {
        title: '学生测温组',
        icon: 'folder-open'
      }
    },
    {
      path: '/studentTemperatureSet/setGroup',
      name: 'setGroup',
      component: SetGroup,
      meta: {
        title: '测温组管理'
      },
      hidden: true
    }
  ]
}

export default set
