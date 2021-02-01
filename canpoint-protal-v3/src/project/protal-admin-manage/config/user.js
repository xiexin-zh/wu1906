import { RouteView } from '../layouts'
const Role = resolve => require(['../views/user/Role.vue'], resolve)
const User = resolve => require(['../views/user/User.vue'], resolve)
const userManage = {
  path: '/userManage',
  name: 'userManage',
  redirect: '/role',
  component: RouteView,
  meta: {
    title: '用户管理'
  },
  children: [
    {
      path: '/role',
      name: 'role',
      component: Role,
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        title: '员工管理'
      }
    }
  ]
}

export default userManage
