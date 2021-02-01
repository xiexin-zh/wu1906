// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
const Home = resolve => require(['../views/Home.vue'], resolve)
const DoorRecord = resolve => require(['../views/DoorRecord.vue'], resolve)
const TeacherCurrent = resolve => require(['../views/TeacherCurrent.vue'], resolve)
const StudentCurrent = resolve => require(['../views/StudentCurrent.vue'], resolve)
const SetGroup = resolve => require(['../views/SetGroup.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/doorRecord',
        name: 'doorRecord',
        component: DoorRecord,
        meta: {
          title: '出入记录'
        }
      },
      {
        path: '/teacherCurrent',
        name: 'teacherCurrent',
        component: TeacherCurrent,
        meta: {
          title: '教职工通行'
        }
      },
      {
        path: '/studentCurrent',
        name: 'studentCurrent',
        component: StudentCurrent,
        meta: {
          title: '学生通行'
        }
      },
      {
        path: 'setGroup',
        name: 'setGroup',
        component: SetGroup,
        meta: {
          title: '权限组管理'
        },
        hidden: true
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
