const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入'
  },
  {
    value: 'deviceType',
    type: 'select',
    label: '设备类型',
    placeholder: '请选择',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '相机'
      },
      {
        key: '2',
        val: '面板机'
      },
      {
        key: '3',
        val: '班牌'
      }
    ]
  },
  {
    value: 'address',
    type: 'input',
    label: '安装位置',
    placeholder: '请输入'
  },
  {
    value: 'deviceSn',
    type: 'input',
    label: '设备SN码',
    placeholder: '请输入'
  },
  {
    value: 'inOrOut',
    type: 'select',
    label: '控制类型',
    placeholder: '请选择',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '进'
      },
      {
        key: '2',
        val: '出'
      },
      {
        key: '3',
        val: '无'
      }
    ]
  }

]

export default searchLabel
