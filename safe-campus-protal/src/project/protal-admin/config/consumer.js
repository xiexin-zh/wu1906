// 系统表单
import {
  RouteView
} from '../layouts'
const Role = resolve => require(['../views/consumer/Role.vue'], resolve)
const Staff = resolve => require(['../views/consumer/Staff.vue'], resolve)
const RoleList = resolve => require(['../views/consumer/RoleList.vue'], resolve)
const consumer = {
  path: '/con',
  name: 'con',
  component: RouteView,
  meta: {
    title: '用户管理'
  },
  children: [{
    path: '/role',
    name: 'role',
    component: Role,
    meta: {
      title: '角色管理'
    }
  }, {
    path: '/role/list',
    name: 'roleList',
    component: RoleList,
    meta: {
      title: '员工列表',
      isHide: true
    }
  }, {
    path: '/staff',
    name: 'staff',
    component: Staff,
    meta: {
      title: '员工管理'
    }
  }]
}

export default consumer
