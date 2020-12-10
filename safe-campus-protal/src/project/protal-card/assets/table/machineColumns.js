const machineColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '10%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: (text) => {
      return text === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: 'SN',
    dataIndex: 'deviceSn',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: (text) => {
      return text === 1 ? '离线' : '在线'
    }
  },
  {
    title: 'IP地址',
    dataIndex: 'deviceIp',
    width: '10%'
  },
  {
    title: '关联场地',
    dataIndex: 'fieldName',
    width: '10%'
  },
  {
    title: '授权',
    key: 'action',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  },
  {
    title: '操作',
    key: 'other1',
    width: '12%',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
export default machineColumns
