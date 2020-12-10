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
    dataIndex: 'sn',
    width: '10%'
  },
  {
    title: '消费模式',
    dataIndex: 'consumerModel',
    width: '10%',
    customRender: (text) => {
      return parseInt(text) === 1 ? '定额模式' : '自由模式'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '10%',
    customRender: (text) => {
      return text === 1 ? '离线' : '在线'
    }
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    width: '10%'
  },
  {
    title: '所属档口',
    dataIndex: 'windowName',
    width: '10%'
  },
  {
    title: '是否启用',
    key: 'isOpen',
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
