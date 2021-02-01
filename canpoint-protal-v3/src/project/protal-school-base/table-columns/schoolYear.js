const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学年名称',
    dataIndex: 'name',
    width: '15%'
  },
  {
    title: '起止日期',
    width: '15%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '第一学期',
    width: '15%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '第二学期',
    width: '15%',
    scopedSlots: {
      customRender: 'slotThree'
    }
  },
  {
    title: '是否使用中',
    width: '15%',
    scopedSlots: {
      customRender: 'slotFour'
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
