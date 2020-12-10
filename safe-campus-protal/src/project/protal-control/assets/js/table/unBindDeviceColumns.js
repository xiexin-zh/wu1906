import Tools from '@u/tools'
const unBindDeviceColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '10%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return Tools.deviceTypeName(text)
    }
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%'
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
    title: '状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return text === 1 ? '在线' : '离线'
    }
  }
]
export default unBindDeviceColumns
