const totalTable = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'number'
    },
    width: '80px'
  }, {
    title: '姓名',
    dataIndex: 'userName',
    width: '100px'
  }, {
    title: '学号',
    dataIndex: 'userNo',
    width: '200px'
  }, {
    title: '年级',
    dataIndex: 'gradeName',
    width: '80px'
  }, {
    title: '班级',
    dataIndex: 'className',
    width: '150px'
  }, {
    title: '楼宇',
    dataIndex: 'buildingName',
    width: '160px'
  }, {
    title: '楼层',
    dataIndex: 'floorName',
    width: '60px'
  }, {
    title: '宿舍',
    dataIndex: 'roomName',
    width: '120px'
  }, {
    title: '未归',
    dataIndex: 'noReturnNum',
    width: '80px'
  }, {
    title: '晚归',
    dataIndex: 'lateNum',
    width: '80px'
  }, {
    title: '请假',
    dataIndex: 'leaveNum',
    width: '80px'
  }]

export default totalTable
