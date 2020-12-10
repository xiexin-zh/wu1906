// eslint-disable-next-line
import {
  BasicLayout,
  RouteView
} from '../layouts'
const Home = resolve => require(['../views/Home.vue'], resolve)
const BillList = resolve => require(['../views/chargeManage/billList.vue'], resolve)
const ChargingTask = resolve => require(['../views/chargeManage/chargingTask'], resolve)
const ChargeDay = resolve => require(['../views/reportStatistics/chargeDay'], resolve)
const ChargeWarning = resolve => require(['../views/reportStatistics/chargeWarning'], resolve)
const ClassSummary = resolve => require(['../views/reportStatistics/classSummary'], resolve)
// const Company = resolve => require(['../views/systemSet/company'], resolve)
const Message = resolve => require(['../views/systemSet/message'], resolve)
const Project = resolve => require(['../views/systemSet/project'], resolve)
// const Type = resolve => require(['../views/systemSet/type'], resolve)
const AddTask = resolve => require(['../views/components/AddTask.vue'], resolve)
const ChargeDetail = resolve => require(['../views/components/ChargeDetail.vue'], resolve)
const BillDetail = resolve => require(['../views/components/BillDetail.vue'], resolve)
export const asyncRouterMap = [{
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/home',
    children: [{
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/chargingTask',
        name: 'chargingTask',
        component: RouteView,
        meta: {
          title: '收费管理'
        },
        children: [{
            path: '/chargingTask',
            name: 'chargingTask',
            component: ChargingTask,
            meta: {
              title: '收费任务'
            }
          },
          {
            path: '/components/ChargeDetail',
            name: 'ChargeDetail',
            component: ChargeDetail,
            meta: {
              title: '任务详情',
              isHide: true
            }
          },
          {
            path: '/components/AddTask',
            name: 'addTask',
            component: AddTask,
            meta: {
              title: '新增任务'
            },
            hidden: true
          },
          {
            path: '/billList',
            name: 'billList',
            component: BillList,
            meta: {
              title: '账单列表'
            }
          },
          {
            path: '/components/BillDetail',
            name: 'BillDetail',
            component: BillDetail,
            meta: {
              title: '账单详情',
              isHide: true
            }
          },
        ]
      },
      {
        path: '/classSummary',
        name: 'classSummary',
        component: RouteView,
        meta: {
          title: '报表统计'
        },
        children: [{
            path: '/classSummary',
            name: 'classSummary',
            component: ClassSummary,
            meta: {
              title: '班级汇总统计'
            }
          },
          {
            path: '/chargeWarning',
            name: 'chargeWarning',
            component: ChargeWarning,
            meta: {
              title: '收费预警报表'
            }
          },
          {
            path: '/chargeDay',
            name: 'chargeDay',
            component: ChargeDay,
            meta: {
              title: '收费日统计'
            }
          }
        ]
      },
      {
        path: '/project',
        name: 'project',
        component: RouteView,
        meta: {
          title: '系统设置'
        },
        children: [{
            path: '/project',
            name: 'project',
            component: Project,
            meta: {
              title: '收费项'
            }
          },
          // {
          //   path: '/type',
          //   name: 'type',
          //   component: Type,
          //   meta: {
          //     title: '收费类型'
          //   }
          // },
          // {
          //   path: '/company',
          //   name: 'company',
          //   component: Company,
          //   meta: {
          //     title: '收费单位'
          //   }
          // },
          {
            path: '/message',
            name: 'message',
            component: Message,
            meta: {
              title: '消息设置'
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

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap