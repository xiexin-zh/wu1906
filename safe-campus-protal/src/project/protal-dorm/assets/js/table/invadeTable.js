const invadeTable = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: {
      customRender: 'index'
    },
    width: '6%'
  },
  {
    title: '身份',
    dataIndex: 'userType',
    width: '6%',
    customRender: text => {
      if (parseInt(text) === 0) {
        return '陌生人'
      } else if (parseInt(text) === 1) {
        return '黑名单'
      } else if (parseInt(text) === 2) {
        return '学生'
      } else if (parseInt(text) === 3) {
        return '教职工'
      }
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '6%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '6%',
    customRender: text => {
      if (parseInt(text) === 1) {
        return '男'
      } else if (parseInt(text) === 2) {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '级别',
    dataIndex: 'level',
    width: '6%',
    customRender: text => {
      if (text === '1') {
        return '重大'
      } else if (text === '2') {
        return '严重'
      } else {
        return '一般'
      }
    }
  },
  {
    title: '入侵时间',
    dataIndex: 'invasionTime',
    width: '12%',
    scopedSlots: {
      customRender: 'invasionTime'
    }
  },
  {
    title: '入侵地点',
    dataIndex: 'buildingName',
    width: '12%',
    scopedSlots: {
      customRender: 'buildingName'
    }
  },
  {
    title: '出入类型',
    dataIndex: 'inOrOut',
    width: '8%',
    customRender: text => {
      if (parseInt(text) === 1) {
        return '进'
      } else if (parseInt(text) === 2) {
        return '出'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snapSrc',
    scopedSlots: {
      customRender: 'snapSrc'
    },
    width: '12%'
  },
  {
    title: '底库照片',
    dataIndex: 'photoSrc',
    scopedSlots: {
      customRender: 'photoSrc'
    },
    width: '12%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '18%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default invadeTable
