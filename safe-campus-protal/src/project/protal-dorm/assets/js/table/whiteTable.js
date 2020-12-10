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
    title: '有效期至',
    dataIndex: 'expirationTime',
    width: '10%',
    scopedSlots: {
      customRender: 'expirationTime'
    }
  }, {
    title: '场地',
    dataIndex: 'buildingName',
    width: '8%',
    scopedSlots: {
      customRender: 'buildingName'
    }
  }, {
    title: '原因',
    dataIndex: 'reason',
    width: '10%'
  }, {
    title: '添加人',
    dataIndex: 'createUserName',
    width: '8%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '10%',
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
    width: '10%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default invadeTable
