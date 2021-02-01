const columns = [
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
    width: '15%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '设备SN码',
    width: '15%',
    dataIndex: 'deviceSn'
  },
  {
    title: '安装位置',
    width: '20%',
    dataIndex: 'address'
  },
  {
    title: '控制类型',
    width: '10%',
    scopedSlots: {
      customRender: 'slotTwo'
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

export default columns
