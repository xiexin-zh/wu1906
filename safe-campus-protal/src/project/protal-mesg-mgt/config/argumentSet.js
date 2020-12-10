// 系统表单
import {
  RouteView
} from '../layouts'
const argumentSet = {
  path: '/argumentSet',
  name: 'argumentSet',
  component: RouteView,
  meta: {
    title: '参数配置'
  },
  children: [
    {
      path: '/argumentSet/WeChat',
      name: 'WeChat',
      component: () => import('../views/argumentSet/WeChat.vue'),
      meta: {
        title: '微信'
      }
    },
    // {
    //   path: '/argumentSet/addKlg',
    //   name: 'addKlg',
    //   component: AddKlg,
    //   meta: {
    //     title: '添加安全知识',
    //     isHide: true
    //   }
    // },
    {
      path: '/argumentSet/note',
      name: 'note',
      component: () => import('../views/argumentSet/Note.vue'),
      meta: {
        title: '短信'
      }
    }
  ]
}

export default argumentSet
