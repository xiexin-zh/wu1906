// 系统表单
const MachineManage = resolve => require(['../views/consumeManage/MachineManage.vue'], resolve)
const ConsumeRule = resolve => require(['../views/consumeManage/ConsumeRule.vue'], resolve)
const SetMachine = resolve => require(['../views/consumeManage/SetMachine.vue'], resolve)
const consume = [
  {
    path: '/machineManage',
    name: 'machineManage',
    component: MachineManage,
    meta: {
      title: '消费机管理'
    }
  },
  {
    path: '/consumeRule',
    name: 'consumeRule',
    component: ConsumeRule,
    meta: {
      title: '消费规则'
    }
  },
  {
    path: '/consume/setMachine',
    name: 'setMachine',
    component: SetMachine,
    meta: {
      title: '设置',
      isHide: true
    }
  }
]

export default consume
