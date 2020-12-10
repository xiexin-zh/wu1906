// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import classMoral from './class'
import studentMoral from './student'
import behavior from './behavior'
import ClassSchedule from './class-schedule'
const SchoolShow = resolve => require(['../views/schoolShow/SchoolShow.vue'], resolve)
const ClassAlbum = resolve => require(['../views/classShow/ClassAlbum.vue'], resolve)
const ClassCard = resolve => require(['../views/classShow/ClassCard.vue'], resolve)
const ClassHonor = resolve => require(['../views/classHonor/ClassHonor.vue'], resolve)
const LostFound = resolve => require(['../views/lostFound/LostFound.vue'], resolve)
const ClassNewspaper = resolve => require(['../views/classNewspaper/ClassNewspaper.vue'], resolve)
const CountDown = resolve => require(['../views/countDown/CountDown.vue'], resolve)
const Duty = resolve => require(['../views/duty/Duty.vue'], resolve)
const Homework = resolve => require(['../views/homework/Homework.vue'], resolve)
const SchemaSet = resolve => require(['../views/set/SchemaSet.vue'], resolve)
const WelCome = resolve => require(['../views/set/AddWelcome.vue'], resolve)
const TemplateManage = resolve => require(['../views/set/TemplateManage.vue'], resolve)
const Template = resolve => require(['../views/set/AddTemplate.vue'], resolve)
const ClassManage = resolve => require(['../views/deviceManage/ClassManage.vue'], resolve)
// /* const TemplateSet = resolve => require(['../views/deviceManage/TemplateSet.vue'], resolve) */
const UpDownPlan = resolve => require(['../views/deviceManage/UpDownPlan.vue'], resolve)
const AddPlan = resolve => require(['../views/deviceManage/AddPlan.vue'], resolve)
const ExamPlan = resolve => require(['../views/examPlan/examPlan.vue'], resolve)
const Addexamplan = resolve => require(['../views/examPlan/Addexamplan.vue'], resolve)
const ScoreDetail = resolve => require(['../views/examPlan/ScoreDetail.vue'], resolve)
const AttendanceRecord = resolve => require(['../views/attendance/AttendanceRecord.vue'], resolve)
const AttendanceStatistics = resolve =>
  require(['../views/attendance/AttendanceStatistics.vue'], resolve)
const Classpraisec = resolve => require(['../views/praisecColumn/Classpraisec.vue'], resolve)
const Personalpraisec = resolve => require(['../views/praisecColumn/Personalpraisec.vue'], resolve)
const Compliments = resolve => require(['../views/praisecColumn/Compliments.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '电子班牌'
    },
    redirect: '/classCard',
    children: [
      {
        path: '/schoolShow',
        name: 'schoolShow',
        component: SchoolShow,
        meta: {
          title: '校园概况'
        }
      },
      {
        path: '/classCard',
        name: 'classCard',
        component: RouteView,
        meta: {
          title: '班级风采'
        },
        children: [
          {
            path: '/classCard',
            name: 'classCard',
            component: ClassCard,
            meta: {
              title: '班级名片'
            }
          },
          {
            path: '/classAlbum',
            name: 'classAlbum',
            component: ClassAlbum,
            meta: {
              title: '班级相册'
            }
          }
        ]
      },
      {
        path: '/classpraisec',
        name: 'classpraisec',
        component: RouteView,
        meta: {
          title: '表扬栏'
        },
        children: [
          {
            path: '/classpraisec',
            name: 'classpraisec',
            component: Classpraisec,
            meta: {
              title: '班级表扬栏'
            }
          },
          {
            path: '/personalpraisec',
            name: 'personalpraisec',
            component: Personalpraisec,
            meta: {
              title: '个人表扬栏'
            }
          },
          {
            path: '/compliments',
            name: 'compliments',
            component: Compliments,
            meta: {
              title: '表演语设置'
            }
          }
        ]
      },
      {
        path: '/classHonor',
        name: 'classHonor',
        component: ClassHonor,
        meta: {
          title: '班级荣誉'
        }
      },
      {
        path: '/classNewspaper',
        name: 'classNewspaper',
        component: ClassNewspaper,
        meta: {
          title: '电子板报'
        }
      },
      {
        path: '/countDown',
        name: 'countDown',
        component: CountDown,
        meta: {
          title: '倒数日'
        }
      },
      {
        path: '/duty',
        name: 'duty',
        component: Duty,
        meta: {
          title: '值日生'
        }
      },
      {
        path: '/homework',
        name: 'homework',
        component: Homework,
        meta: {
          title: '作业统计'
        }
      },
      {
        path: '/lostFound',
        name: 'lostFound',
        component: LostFound,
        meta: {
          title: '失物招领'
        }
      },
      {
        path: '/examPlan',
        name: 'examPlan',
        component: ExamPlan,
        meta: {
          title: '考试计划'
        }
      },
      {
        path: '/examPlan/Addexamplan',
        name: 'addexamplan',
        component: Addexamplan,
        meta: {
          title: '创建考试计划'
        },
        hidden: true
      },
      {
        path: '/examPlan/ScoreDetail',
        name: 'scoreDetail',
        component: ScoreDetail,
        meta: {
          title: '查看考试成绩'
        },
        hidden: true
      },
      {
        path: '/templateManage/template',
        name: 'template',
        component: Template,
        meta: {
          title: '模板管理',
          isHide: true
        }
      },
      {
        path: '/set',
        name: 'set',
        component: RouteView,
        meta: {
          title: '系统设置'
        },
        children: [
          {
            path: '/schemaSet',
            name: 'schemaSet',
            component: SchemaSet,
            meta: {
              title: '模式设置'
            }
          },
          {
            path: '/templateManage',
            name: 'templateManage',
            component: TemplateManage,
            meta: {
              title: '模板管理'
            }
          },
          {
            path: '/schemaSet/welCome',
            name: 'WelCome',
            component: WelCome,
            meta: {
              title: '欢迎模式',
              isHide: true
            }
          }
        ]
      },
      {
        path: '/deviceManage',
        name: 'deviceManage',
        component: RouteView,
        meta: {
          title: '设备管理'
        },
        children: [
          {
            path: '/classManage',
            name: 'classManage',
            component: ClassManage,
            meta: {
              title: '班牌管理'
            }
          },
          {
            path: '/upDownPlan',
            name: 'upDownPlan',
            component: UpDownPlan,
            meta: {
              title: '开关机计划'
            }
          },
          {
            path: '/upDownPlan/addPlan',
            name: 'addPlan',
            component: AddPlan,
            meta: {
              title: '计划设置'
            },
            hidden: true
          }
          /*
                      {
                        path: '/templateSet',
                        name: 'templateSet',
                        component: TemplateSet,
                        meta: {
                          title: '模板设置'
                        }
                      } */
        ]
      },
      classMoral,
      studentMoral,
      behavior,
      ClassSchedule,
      {
        path: '/attendance',
        name: 'attendance',
        component: RouteView,
        meta: {
          title: '考勤记录'
        },
        children: [
          {
            path: '/attendanceRecord',
            name: 'attendanceRecord',
            component: AttendanceRecord,
            meta: {
              title: '考勤记录'
            }
          },
          {
            path: '/attendanceStatistics',
            name: 'attendanceStatistics',
            component: AttendanceStatistics,
            meta: {
              title: '考勤统计'
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
// const constantRouterMap = [{
//   path: '',
//   name: 'login',
//   component: () => import(/* webpackChunkName: "login" */ '@/views/user/Login')
// }]

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
