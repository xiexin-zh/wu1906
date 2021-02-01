// import { RouteView } from '../layouts'
const Staff = resolve => require(['../views/staff/Staff.vue'], resolve)

const staffManage = {
  path: '/staff',
  name: 'staff',
  component: Staff,
  meta: {
    title: '员工管理'
  }
}

export default staffManage
