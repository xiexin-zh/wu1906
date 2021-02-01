const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '班主任',
    width: '20%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '教室',
    width: '20%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '班级学生',
    width: '10%',
    scopedSlots: {
      customRender: 'slotThree'
    }
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
