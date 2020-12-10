import Tools from '@u/tools'

const deviceGroupColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '8%'
}, {
  title: '设备组名称',
  dataIndex: 'deviceGroupName',
  width: '20%'
},
{
  title: '设备组编码',
  dataIndex: 'deviceGroupCode',
  width: '20%'
},
{
  title: '设备组类型',
  dataIndex: 'deviceGroupType',
  width: '12%',
  customRender: (text) => {
    return Tools.deviceTypeName(text)
  }
},
{
  title: '阈值',
  dataIndex: 'threshold',
  width: '10%'
},
{
  title: '备注',
  dataIndex: 'remarks',
  width: '10%'
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
export default deviceGroupColumns
