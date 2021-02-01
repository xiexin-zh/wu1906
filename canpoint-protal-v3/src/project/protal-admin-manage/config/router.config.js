// eslint-disable-next-line
import { BasicLayout, RouteView } from '../layouts'
import institution from './institution'
import apply from './apply'
import dictionaryManage from './dictionary'
import userManage from './user'
const Message = resolve =>
  require(['../views/message/MessageList.vue'], resolve)
const SendMessage = resolve =>
  require(['../views/message/SendMessage.vue'], resolve)

export const asyncRouterMap = [
  {
    path: '/',
    name: 'pcManage',
    component: BasicLayout,
    meta: {
      title: '平台管理'
    },
    redirect: '/pcMenu',
    children: [
      apply,
      institution,
      userManage,
      dictionaryManage,
      {
        path: '/message',
        name: 'message',
        component: Message,
        meta: {
          title: '平台消息'
        }
      },
      {
        path: '/message/send',
        name: 'sendMessage',
        component: SendMessage,
        meta: {
          title: '发布公告'
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
