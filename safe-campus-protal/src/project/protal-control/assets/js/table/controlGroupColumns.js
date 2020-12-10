import Tools from '@u/tools'

const controlGroupColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '8%'
}, {
  title: '控制组名称',
  dataIndex: 'controlGroupName',
  width: '15%'
}, {
  title: '控制组编码',
  dataIndex: 'controlGroupCode',
  width: '15%'
},
{
  title: '控制组类型',
  dataIndex: 'controlGroupType',
  width: '12%',
  customRender: (text) => {
    return Tools.controlTypeName(text)
  }
},
// {
//   title: '设备组数',
//   dataIndex: 'number',
//   width: '10%'
// },
// {
//   title: '状态',
//   dataIndex: 'status',
//   width: '10%'
// },
{
  title: '备注',
  dataIndex: 'remarks',
  width: '30%'
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
export default controlGroupColumns
