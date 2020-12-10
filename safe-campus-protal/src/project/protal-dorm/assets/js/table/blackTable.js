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
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '8%',
    customRender: text => {
      if (parseInt(text) === 1) {
        return '男'
      } else if (parseInt(text) === 2) {
        return '女'
      } else {
        return '未知'
      }
    }
  }, {
    title: '拉黑原因',
    dataIndex: 'reason',
    width: '12%'
  }, {
    title: '添加人',
    dataIndex: 'createUserName',
    width: '8%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '14%',
    scopedSlots: {
      customRender: 'createTime'
    }
  },
  {
    title: '照片',
    dataIndex: 'photoList',
    scopedSlots: {
      customRender: 'photoList'
    },
    width: '15%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '8%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default invadeTable
