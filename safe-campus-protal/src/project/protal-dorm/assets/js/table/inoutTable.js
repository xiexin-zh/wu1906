const inoutTable = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'number'
    },
    width: '6%'
  }, {
    title: '姓名',
    dataIndex: 'userName'
  }, {
    title: '性别',
    dataIndex: 'gender',
    width: '6%',
    scopedSlots: {
      customRender: 'gender'
    }
  }, {
    title: '楼栋',
    dataIndex: 'buildingName',
    width: '8%'
  }, {
    title: '宿舍',
    dataIndex: 'roomName',
    width: '8%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '监控设备',
    dataIndex: 'controllerName',
    width: '10%'
  },
  {
    title: '进出',
    dataIndex: 'inOrOut',
    width: '6%',
    scopedSlots: {
      customRender: 'inOrOut'
    }
  },
  {
    title: '记录类型',
    dataIndex: 'recordType',
    width: '8%',
    scopedSlots: {
      customRender: 'recordType'
    }
  }, {
    title: '通过时间',
    dataIndex: 'recordTime',
    width: '10%',
    scopedSlots: {
      customRender: 'recordTime'
    }
  },
  {
    title: '人员备案照片',
    dataIndex: 'photoSrc',
    scopedSlots: {
      customRender: 'photoSrc'
    },
    width: '8%'
  },
  {
    title: '抓拍照片',
    dataIndex: 'snapSrc',
    width: '8%',
    scopedSlots: {
      customRender: 'snapSrc'
    }
  }
]

export default inoutTable
