const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学科名称',
    dataIndex: 'subjectName',
    width: '30%'
  },
  {
    title: '备注',
    width: '30%',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
