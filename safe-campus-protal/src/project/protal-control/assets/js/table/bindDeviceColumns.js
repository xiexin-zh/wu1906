import Tools from '@/utils/tools'

const bindDeviceColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '10%'
}, {
  title: '设备名称',
  dataIndex: 'deviceName',
  width: '15%'
},
{
  title: '设备类型',
  dataIndex: 'deviceType',
  width: '10%',
  customRender: (text) => {
    return Tools.deviceTypeName(text)
  }
},
{
  title: 'IP地址',
  dataIndex: 'deviceIp',
  width: '15%'
},
{
  title: '安装位置',
  dataIndex: 'snapSite',
  width: '20%'
},
{
  title: '在线状态',
  dataIndex: 'deviceStatus',
  width: '10%',
  customRender: (text) => {
    return text === 1 ? '在线' : '离线'
  }
},
{
  title: '操作',
  key: 'action',
  width: '20%',
  scopedSlots: {
    customRender: 'action'
  }
}
]
export default bindDeviceColumns
