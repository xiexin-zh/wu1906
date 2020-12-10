// 系统表单
import {
  RouteView
} from '../layouts'
const templateSet = {
  path: '/templateSet',
  name: 'templateSet',
  component: RouteView,
  meta: {
    title: '模板配置'
  },
  children: [
    {
      path: '/templateSet/WeChat',
      name: 'WeChat1',
      component: () => import('../views/templateSet/WeChat.vue'),
      meta: {
        title: '微信'
      }
    },
    {
      path: '/templateSet/note',
      name: 'note1',
      component: () => import('../views/templateSet/Note.vue'),
      meta: {
        title: '短信'
      }
    }
  ]
}

export default templateSet
