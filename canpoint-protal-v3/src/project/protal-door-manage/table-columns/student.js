const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '节日名称',
    dataIndex: 'name',
    width: '15%'
  },
  {
    title: '放假时间',
    width: '40%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '放假天数',
    width: '20%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  }
]

export default columns
