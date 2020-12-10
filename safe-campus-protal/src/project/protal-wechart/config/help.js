import { RouteView } from '../layouts'
// 帮助中心
const Help = resolve => require(['../views/help/Help.vue'], resolve)
const HelpDetail = resolve => require(['../views/help/HelpDetail.vue'], resolve)

const help = {
  path: '/help',
  name: 'help',
  redirect: '/help',
  component: RouteView,
  meta: {
    title: '帮助中心'
  },
  children: [
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        title: '帮助列表'
      }
    },
    {
      path: '/help/helpDetail',
      name: 'helpDetail',
      component: HelpDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    }
  ]
}

export default help
