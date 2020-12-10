import { RouteView } from '../layouts'
// 通知公告
const SysTemTemplate = resolve => require(['../views/notice/SysTemTemplate.vue'], resolve)
const notice = {
  path: '/noticeType',
  name: 'noticeType',
  redirect: '/NoticeType',
  component: RouteView,
  meta: {
    title: '通知公告'
  },
  children: [
    {
      path: '/systemTemplate',
      name: 'systemTemplate',
      component: SysTemTemplate,
      meta: {
        title: '系统模板'
      }
    }
  ]
}

export default notice
