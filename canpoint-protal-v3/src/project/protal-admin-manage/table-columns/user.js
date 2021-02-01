const userColumns = [
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
    width: '20%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '角色',
    width: '20%',
    scopedSlots: {
      customRender: 'slotOne'
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
const roleColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: '20%'
  },
  {
    title: '授权用户数',
    width: '20%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default {
  userColumns,
  roleColumns
}
