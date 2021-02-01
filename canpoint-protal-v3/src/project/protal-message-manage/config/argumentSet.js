import { RouteView } from '../layouts'
const argumentSet = {
  path: '/argumentSet',
  name: 'argumentSet',
  redirect: '/argumentSetWeChat',
  component: RouteView,
  meta: {
    title: '参数配置'
  },
  children: [
    {
      path: '/argumentSetWeChat',
      name: 'WeChat',
      component: () => import('../views/argumentSet/WeChat.vue'),
      meta: {
        title: '微信'
      }
    },
    {
      path: '/argumentSetNote',
      name: 'note',
      component: () => import('../views/argumentSet/Note.vue'),
      meta: {
        title: '短信'
      }
    }
  ]
}

export default argumentSet
