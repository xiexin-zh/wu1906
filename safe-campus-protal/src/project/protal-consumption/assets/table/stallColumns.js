const stallColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '20%'
  },
  {
    title: '档口名称',
    dataIndex: 'windowName',
    width: '20%'
  },
  {
    title: '绑定场地',
    dataIndex: 'buildName',
    width: '20%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
export default stallColumns
