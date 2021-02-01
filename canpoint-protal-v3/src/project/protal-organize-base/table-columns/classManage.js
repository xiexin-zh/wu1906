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
    width: '10%',
    customRender: (text, record) => {
      return record.gradeName + record.className
    }
  },
  {
    title: '班主任',
    width: '20%',
    dataIndex: 'headTeacherList',
    customRender: (text) => {
      return text.map(el => el.userName).join('，') || ''
    }
  },
  {
    title: '教室',
    width: '20%',
    dataIndex: 'placeName'
  },
  {
    title: '班级学生',
    width: '10%',
    scopedSlots: {
      customRender: 'slotThree'
    }
  },
  // {
  //   title: '任课老师',
  //   width: '10%',
  //   scopedSlots: {
  //     customRender: 'slotOne'
  //   }
  // },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
