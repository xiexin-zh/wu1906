import { RouteView } from '../layouts'
const Class = resolve => require(['../views/set/Class.vue'], resolve)
const Check = resolve => require(['../views/set/Check.vue'], resolve)
const Warn = resolve => require(['../views/set/Warn.vue'], resolve)
const Equip = resolve => require(['../views/set/Equip.vue'], resolve)
const AddCheck = resolve => require(['../views/set/AddCheck.vue'], resolve)
const set = {
  path: '/class',
  name: 'class',
  component: RouteView,
  meta: {
    title: '系统设置'
  },
  children: [
    {
      path: '/class',
      name: 'class',
      component: Class,
      meta: {
        title: '查寝班次'
      }
    },
    {
      path: '/check',
      name: 'check',
      component: Check,
      meta: {
        title: '查寝设置'
      }
    },
    {
      path: '/addCheck',
      name: 'addCheck',
      component: AddCheck,
      meta: {
        title: '添加查寝组',
        isHide: true
      }
    },
    {
      path: '/warn',
      name: 'warn',
      component: Warn,
      meta: {
        title: '预警设置'
      }
    },
    {
      path: '/equip',
      name: 'equip',
      component: Equip,
      meta: {
        title: '设备管理'
      }
    }
  ]
}

export default set
