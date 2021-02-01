const DutyList = resolve => require(['../views/duty-manage/DutyList'], resolve)

const dutyManage = {
  path: '/dutyList',
  name: 'dutyList',
  component: DutyList,
  meta: {
    title: '职务管理'
  }
}

export default dutyManage
