const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '职务名称',
    dataIndex: 'stationName',
    width: '20%'
  },
  {
    title: '成员人数',
    width: '20%',
    dataIndex: 'userCount',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '备注',
    width: '25%',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    width: '25%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
