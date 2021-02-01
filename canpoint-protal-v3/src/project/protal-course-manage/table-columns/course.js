const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '课程名称',
    dataIndex: 'subjectName',
    width: '20%'
  },
  {
    title: '课程老师',
    width: '20%',
    dataIndex: 'courseTeacher',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '备注',
    width: '25%',
    dataIndex: 'mark',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '操作',
    width: '20%',
    align: 'center',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export default columns
