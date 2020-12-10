// 系统表单
import { RouteView } from '../layouts'
const DoorSet = resolve => require(['../views/systemSet/DoorSet.vue'], resolve)
const system = {
  path: '/doorSet',
  name: 'doorSet',
  component: RouteView,
  meta: {
    title: '系统设置'
  },
  children: [
    {
      path: '/doorSet',
      name: 'doorSet',
      component: DoorSet,
      meta: {
        title: '门卫设置'
      }
    }
  ]
}

export default system
