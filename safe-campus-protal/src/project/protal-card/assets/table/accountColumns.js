import Tools from '@u/tools'
const accountColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '6%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '9%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '身份',
    dataIndex: 'userIdentity',
    width: '9%',
    customRender: (text) => {
      return Tools.userType(text)
    }
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '9%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '9%'
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    width: '8%',
    customRender: (text) => {
      return Tools.getCardStatus(text)
    }
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '9%'
  },
  {
    title: '卡类型',
    dataIndex: 'cardName',
    width: '8%'
  },
  {
    title: '卡余额',
    dataIndex: 'balance',
    width: '8%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '9%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default accountColumns
