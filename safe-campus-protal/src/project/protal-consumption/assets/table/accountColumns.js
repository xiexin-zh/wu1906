
const accountColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '身份',
    dataIndex: 'userType',
    width: '15%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '10%'
  },
  {
    title: '账户状态',
    dataIndex: 'status',
    width: '10%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '10%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default accountColumns
