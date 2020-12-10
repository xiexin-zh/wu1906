// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import consumer from './consumer'
import appManage from './appManage'
import apply from './apply'
import subject from './subject'
import library from './library'
const InstituteManage = resolve => require(['../views/institute/InstituteManage.vue'], resolve)
const InstituteDetail = resolve => require(['../views/institute/InstituteDetail.vue'], resolve)
const PanelDetail = resolve => require(['../views/operation/PanelDetail.vue'], resolve)
const SchoolCalendar = resolve => require(['../views/calendar/schoolCalendar.vue'], resolve)
const BureauManage = resolve => require(['../views/bureau/BureauManage.vue'], resolve)
const BureauDetail = resolve => require(['../views/bureau/BureauDetail.vue'], resolve)
const Notice = resolve => require(['../views/notice/Notice.vue'], resolve)
const AddNotice = resolve => require(['../views/notice/AddNotice.vue'], resolve)
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/pcMenu',
    children: [
      appManage,
      apply,
      {
        path: '/ins',
        name: 'ins',
        component: RouteView,
        meta: {
          title: '机构管理'
        },
        children: [
          {
            path: '/institute',
            name: 'institute',
            component: InstituteManage,
            meta: {
              title: '学校机构'
            }
          },
          {
            path: '/bureau',
            name: 'bureau',
            component: BureauManage,
            meta: {
              title: '局端机构'
            }
          },
          {
            path: '/institute/detail',
            name: 'instituteDetail',
            component: InstituteDetail,
            meta: {
              title: '机构详情',
              isHide: true
            }
          },
          {
            path: '/bureau/detail',
            name: 'bureauDetail',
            component: BureauDetail,
            meta: {
              title: '机构详情',
              isHide: true
            }
          }
        ]
      },
      consumer,
      subject,
      {
        path: '/calendar',
        name: 'calendar',
        component: SchoolCalendar,
        meta: {
          title: '校历管理'
        }
      },
      {
        path: '/panel/detail',
        name: 'panelDetail',
        component: PanelDetail,
        meta: {
          title: '应用编辑',
          isHide: true
        }
      },
      {
        path: '/notice',
        name: 'notice',
        component: Notice,
        meta: {
          title: '通知公告'
        }
      },
      {
        path: '/notice/add',
        name: 'noticeAdd',
        component: AddNotice,
        meta: {
          title: '公告操作',
          isHide: true
        }
      },
      library
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
//   component: () => import(/* webpackChunkName: "login" */ '../views/user/Login')
// }]

let RouterMap = [...asyncRouterMap]
if (process.env.NODE_ENV === 'development') {
  RouterMap = [...asyncRouterMap]
}

export default RouterMap
