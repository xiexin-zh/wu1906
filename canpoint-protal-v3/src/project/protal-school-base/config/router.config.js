// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import authorityManage from './authority'
import classManage from './class-manage'
const Home = resolve => require(['../views/Home.vue'], resolve)
const OrgManage = resolve => require(['../views/OrgManage.vue'], resolve)
const Teacher = resolve => require(['../views/teacher/Teacher.vue'], resolve)
const DutyManage = resolve => require(['../views/DutyManage.vue'], resolve)
const BatchImport = resolve => require(['../views/teacher/BatchImport.vue'], resolve)
const SchoolYear = resolve => require(['../views/schoolYear/SchoolYear.vue'], resolve)
const ClassUp = resolve => require(['../views/class-up/ClassUp.vue'], resolve)
const Student = resolve => require(['../views/student/Student.vue'], resolve)
const StuDetail = resolve => require(['../views/student/StuDetail.vue'], resolve)
const Major = resolve => require(['../views/major/Major.vue'], resolve)

const PlaceManage = resolve => require(['../views/place-manage/PlaceManage.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: '_orgManage',
    component: BasicLayout,
    meta: {
      title: '基础数据'
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
        path: '/orgManage',
        name: 'orgManage',
        component: OrgManage,
        meta: {
          title: '部门管理'
        }
      },
      {
        path: '/dutyManage',
        name: 'dutyManage',
        component: DutyManage,
        meta: {
          title: '职务管理'
        }
      },
      ...classManage,
      authorityManage,
      {
        path: '/teacher',
        name: 'teacher',
        component: Teacher,
        meta: {
          title: '教职工管理'
        }
      },
      {
        path: '/batchImport',
        name: 'batchImport',
        component: BatchImport,
        meta: {
          title: '批量导入'
        },
        hidden: true
      },
      {
        path: '/placeManage',
        name: 'placeManage',
        component: PlaceManage,
        meta: {
          title: '场地管理'
        }
      },
      {
        path: '/schoolYear',
        name: 'schoolYear',
        component: SchoolYear,
        meta: {
          title: '学年管理'
        }
      },
      {
        path: '/classUp',
        name: 'classUp',
        component: ClassUp,
        meta: {
          title: '班级升级'
        }
      },
      {
        path: '/student',
        name: 'student',
        component: Student,
        meta: {
          title: '学生管理'
        }
      },
      {
        path: '/student/stuDetail',
        name: 'stuDetail',
        component: StuDetail,
        meta: {
          title: '学生详情'
        },
        hidden: true
      },
      {
        path: '/major',
        name: 'major',
        component: Major,
        meta: {
          title: '专业管理'
        }
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
