// 系统表单
import {
  RouteView
} from '../layouts'
const useRelation = {
  path: '/useRelation',
  name: 'useRelation',
  component: RouteView,
  meta: {
    title: '使用关系'
  },
  children: [
    {
      path: '/useRelation/WeChat',
      name: 'WeChat2',
      component: () => import('../views/useRelation/WeChat.vue'),
      meta: {
        title: '微信'
      }
    },

    {
      path: '/useRelation/note',
      name: 'note2',
      component: () => import('../views/useRelation/Note.vue'),
      meta: {
        title: '短信'
      }
    }
  ]
}

export default useRelation
