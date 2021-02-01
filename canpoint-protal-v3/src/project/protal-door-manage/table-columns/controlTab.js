
export const leftTableColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '20%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '20%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '20%'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  }
]

export const rightTableColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '40%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '40%'
  }
  /* {
    title: '操作',
    dataIndex: 'gender',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  } */
]
