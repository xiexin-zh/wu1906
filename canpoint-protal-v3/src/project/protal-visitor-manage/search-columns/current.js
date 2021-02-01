import { getDataSet } from '@u/libs/data-state'
const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入'
  },
  {
    value: 'keyword',
    type: 'input',
    label: '安装位置',
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      ...getDataSet('deviceType')
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      ...getDataSet('inOrOut')
    ],
    value: 'inOrOut',
    type: 'select',
    label: '控制类型'
  }
]

export default searchLabel
