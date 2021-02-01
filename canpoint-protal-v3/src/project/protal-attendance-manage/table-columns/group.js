export const groupTable = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '考勤组',
    dataIndex: 'name',
    width: '15%'
  },
  {
    title: '考勤时间',
    dataIndex: 'ruleTime',
    width: '25%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '考勤设备',
    dataIndex: 'controllerNames',
    width: '25%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '考勤人数',
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
export const groupSetTea = [
  {
    title: '工作日',
    align: 'center',
    dataIndex: 'weekDay'
  },
  {
    title: '考勤时间',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
export const groupSetStu = [
  {
    title: '工作日',
    align: 'center',
    dataIndex: 'weekDay'
  },
  {
    title: '上学时间一放学时间',
    dataIndex: 'accessTime',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export const specialColumns = [
  {
    title: '日期',
    align: 'center',
    dataIndex: 'current'
  },
  {
    title: '考勤时间',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
export const classColumns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '班次名称',
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: '考勤时间',
    width: '35%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export const classSearchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '班次名称',
    placeholder: '请输入'
  }
]
