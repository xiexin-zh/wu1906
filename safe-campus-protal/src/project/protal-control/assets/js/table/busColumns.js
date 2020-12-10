import Tools from '@/utils/tools'

const busColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '10%'
}, {
  title: '业务名称',
  dataIndex: 'appName',
  width: '20%'
},
{
  title: '请求路径',
  dataIndex: 'bussUrl',
  width: '25%'
},
{
  title: '业务类型',
  dataIndex: 'bussType',
  width: '15%',
  customRender: (text) => {
    return Tools.busTypeName(text)
  }
},
{
  title: '状态',
  dataIndex: 'status',
  width: '10%',
  customRender: (text) => {
    return status === 1 ? '开启' : '关闭'
  }
},
{
  title: '备注',
  dataIndex: 'remark',
  width: '10%'
},
{
  title: '操作',
  key: 'action',
  width: '10%',
  scopedSlots: {
    customRender: 'action'
  }
}
]
export default busColumns
