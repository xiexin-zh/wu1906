export const currentTable = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '权限组',
    dataIndex: 'ruleGroupName',
    width: '15%'
  },
  {
    title: '通行时间',
    dataIndex: 'timeRuleList',
    width: '25%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '通行设备',
    dataIndex: 'controlGroupList',
    width: '25%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '成员人数',
    dataIndex: 'userCount',
    width: '15%',
    scopedSlots: {
      customRender: 'slotThree'
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
