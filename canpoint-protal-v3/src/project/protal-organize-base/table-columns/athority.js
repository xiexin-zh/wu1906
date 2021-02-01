const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '权限名称',
    dataIndex: 'roleName',
    width: '20%'
  },
  {
    title: '授权用户',
    width: '20%',
    dataIndex: 'userCount',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '备注',
    width: '20%',
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
