// import { RouteView } from '../layouts'
const Authority = resolve => require(['../views/athority/Athority.vue'], resolve)

const authorityManage = {
  path: '/authority',
  name: 'authority',
  component: Authority,
  meta: {
    title: '权限管理'
  }
}

export default authorityManage
