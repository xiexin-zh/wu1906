const columns = [
  {
    title: '序号',
    width: '30%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '来访事由',
    dataIndex: 'causeName',
    width: '40%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
