const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '40%'
  },
  {
    title: '手机号',
    width: '40%',
    dataIndex: 'mobile'
  }
]

export default columns
