// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
const TotalTable = resolve => require(['../views/totalTable/TotalTable.vue'], resolve)
const InoutRecord = resolve => require(['../views/inoutRecord/InoutRecord.vue'], resolve)
const RoomRecord = resolve => require(['../views/roomRecord/RoomRecord.vue'], resolve)
const RoomManage = resolve => require(['../views/roomManage/RoomManage.vue'], resolve)
const LeaveSearch = resolve => require(['../views/leaveSearch/LeaveSearch.vue'], resolve)
const RoomScore = resolve => require(['../views/roomScore/RoomScore.vue'], resolve)
const Record = resolve => require(['../views/invadeManag/Record.vue'], resolve)
const BlackList = resolve => require(['../views/invadeManag/BlackList.vue'], resolve)
const WhiteList = resolve => require(['../views/invadeManag/WhiteList.vue'], resolve)
const AlarmPush = resolve => require(['../views/invadeManag/AlarmPush.vue'], resolve)
const CurrentInvade = resolve => require(['../views/currentInvade/CurrentInvade.vue'], resolve)
const TimeSet = resolve => require(['../views/systemConfig/TimeSet.vue'], resolve)
const DeviceRelation = resolve => require(['../views/systemConfig/DeviceRelation.vue'], resolve)
const UserRelation = resolve => require(['../views/systemConfig/UserRelation.vue'], resolve)
const Home = resolve => require(['../views/Home.vue'], resolve)
const RealBedding = resolve => require(['../views/realBedding/RealBedding.vue'], resolve)
const CheckTotal = resolve => require(['../views/checkTotal/CheckTotal.vue'], resolve)
const AbnormalTotal = resolve => require(['../views/abnormalTotal/AbnormalTotal.vue'], resolve)
const DeviceManage = resolve => require(['../views/deviceManage/DeviceManage.vue'], resolve)
const DataView = resolve => require(['../views/DataView.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '系统首页' },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '系统首页',
          icon: 'home'
        }
      },
      // 实时查寝
      {
        path: '/realBedding',
        name: 'realBedding',
        component: RealBedding,
        meta: {
          title: '实时查寝',
          icon: 'loading'
        }
      },
      // 查寝统计
      {
        path: '/checkTotal',
        name: 'checkTotal',
        component: CheckTotal,
        meta: {
          title: '查寝统计',
          icon: 'area-chart'
        }
      },
      // 异常统计
      {
        path: '/abnormalTotal',
        name: 'abnormalTotal',
        component: AbnormalTotal,
        meta: {
          title: '异常统计',
          icon: 'warning'
        }
      },
      // 统计报表
      {
        path: '/totalTable',
        name: 'totalTable',
        component: TotalTable,
        meta: {
          title: '统计报表',
          icon: 'pie-chart'
        }
      },
      // 出入记录
      {
        path: '/inoutRecord',
        name: 'inoutRecord',
        component: InoutRecord,
        meta: {
          title: '出入记录',
          icon: 'usergroup-add'
        }
      },
      // 宿舍管理
      {
        path: '/roomManage',
        name: 'roomManage',
        component: RoomManage,
        meta: {
          title: '宿舍管理',
          icon: 'calculator'
        }
      },
      // 宿舍档案
      {
        path: '/roomRecord',
        name: 'roomRecord',
        component: RoomRecord,
        meta: {
          title: '宿舍档案',
          icon: 'profile'
        }
      },
      // 请假查询
      // {
      //   path: '/leaveSearch',
      //   name: 'leaveSearch',
      //   component: LeaveSearch,
      //   meta: {
      //     title: '请假查询',
      //     icon: 'search'
      //   }
      // },
      // 宿舍评分
      {
        path: '/roomScore',
        name: 'roomScore',
        component: RoomScore,
        meta: {
          title: '宿舍评分',
          icon: 'trophy'
        }
      },
      // 入侵管理
      {
        path: '/record',
        name: 'Record',
        component: Record,
        meta: {
          title: '入侵管理',
          icon: 'trophy'
        }
      },
      {
        path: '/blackList',
        name: 'blackList',
        component: BlackList,
        meta: {
          title: '黑名单',
          icon: 'trophy'
        }
      },
      {
        path: '/whiteList',
        name: 'whiteList',
        component: WhiteList,
        meta: {
          title: '白名单',
          icon: 'trophy'
        }
      },
      {
        path: '/alarmPush',
        name: 'alarmPush',
        component: AlarmPush,
        meta: {
          title: '报警推送',
          icon: 'trophy'
        }
      },
      // {
      //   path: '/invadeManag',
      //   name: 'invadeManag',
      //   component: RouteView,
      //   redirect: '/invadeManag/record',
      //   meta: {
      //     title: '入侵管理',
      //     icon: 'safety-certificate'
      //   },
      //   children: [
      //     {
      //       path: '/invadeManag/record',
      //       name: 'record',
      //       component: Record,
      //       meta: {
      //         title: '入侵记录',
      //         icon: 'thunderbolt'
      //       }
      //     },
      //     {
      //       path: '/invadeManag/blackList',
      //       name: 'blacklist',
      //       component: BlackList,
      //       meta: {
      //         title: '黑名单',
      //         icon: 'stop'
      //       }
      //     },
      //     {
      //       path: '/invadeManag/whiteList',
      //       name: 'whitelist',
      //       component: WhiteList,
      //       meta: {
      //         title: '白名单',
      //         icon: 'smile'
      //       }
      //     },
      //     {
      //       path: '/invadeManag/alarmPush',
      //       name: 'alarmPush',
      //       component: AlarmPush,
      //       meta: {
      //         title: '报警推送',
      //         icon: 'alert'
      //       }
      //     }
      //   ]
      // },
      // 实时入侵
      {
        path: '/dataView',
        name: 'dataView',
        component: DataView,
        meta: {
          title: '实时看板',
          icon: 'bell',
          currentKeep: true
        }
      },
      {
        path: '/currentInvade',
        name: 'currentInvade',
        component: CurrentInvade,
        meta: {
          title: '实时入侵',
          icon: 'bell',
          currentKeep: true
          // keepAlive: true
        }
      },
      // 系统配置
      {
        path: '/timeSet',
        name: 'timeSet',
        component: TimeSet,
        meta: {
          title: '时间设置',
          icon: 'trophy'
        }
      },
      // {
      //   path: '/deviceRelation',
      //   name: 'deviceRelation',
      //   component: DeviceRelation,
      //   meta: {
      //     title: '设备关联',
      //     icon: 'trophy'
      //   }
      // },
      {
        path: '/deviceManage',
        name: 'deviceManage',
        component: DeviceManage,
        meta: {
          title: '设备管理',
          icon: 'trophy'
        }
      },
      {
        path: '/userRelation',
        name: 'userRelation',
        component: UserRelation,
        meta: {
          title: '宿管关联',
          icon: 'trophy'
        }
      }
      // {
      //   path: '/systemConfit',
      //   name: 'systemConfit',
      //   component: RouteView,
      //   redirect: '/systemConfit/timeSet',
      //   meta: {
      //     title: '系统设置',
      //     icon: 'tool'
      //   },
      //   children: [
      //     {
      //       path: '/systemConfit/timeSet',
      //       name: 'timeSet',
      //       component: TimeSet,
      //       meta: {
      //         title: '时间设置',
      //         icon: 'schedule'
      //       }
      //     },
      //     {
      //       path: '/systemConfit/deviceRelation',
      //       name: 'deviceRelation',
      //       component: DeviceRelation,
      //       meta: {
      //         title: '设备关联',
      //         icon: 'api'
      //       }
      //     },
      //     {
      //       path: '/systemConfit/userRelation',
      //       name: 'userRelation',
      //       component: UserRelation,
      //       meta: {
      //         title: '宿管关联',
      //         icon: 'user'
      //       }
      //     }
      //   ]
      // }
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
// const constantRouterMap = [
//   {
//     path: '',
//     name: 'login',
//     component: () => import('../views/user/Login')
//   }
// ]
let RouterMap
if (process.env.VUE_APP_URL === 'prod') {
  RouterMap = [...asyncRouterMap]
} else {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
