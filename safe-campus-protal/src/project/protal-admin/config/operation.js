// 系统表单
import {
  RouteView
} from '../layouts'
const Server = resolve => require(['../views/operation/Server.vue'], resolve)
const Video = resolve => require(['../views/operation/Video.vue'], resolve)
const Panel = resolve => require(['../views/operation/Panel.vue'], resolve)
const operation = {
  path: '/ope',
  name: 'ope',
  component: RouteView,
  meta: {
    title: '运维管理'
  },
  children: [{
    path: '/server',
    name: 'server',
    component: Server,
    meta: {
      title: '服务器管理'
    }
  }, {
    path: '/video',
    name: 'video',
    component: Video,
    meta: {
      title: '摄像机管理'
    }
  }, {
    path: '/panel',
    name: 'panel',
    component: Panel,
    meta: {
      title: '面板机管理'
    }
  }]
}

export default operation
