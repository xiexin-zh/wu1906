const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'respondentName',
    width: '15%'
  },
  {
    title: '性别',
    width: '15%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '手机号码',
    width: '20%',
    dataIndex: 'respondentMobile'
  },
  {
    title: '组织机构',
    width: '20%',
    dataIndex: 'orgName'
  },
  {
    title: '人脸照片',
    width: '10%',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
