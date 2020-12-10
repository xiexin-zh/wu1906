const historyTable = [{
    title: '序号',
    scopedSlots: {
      customRender: 'number'
    },
    width: '8%'
  }, {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  }, {
    title: '学号',
    dataIndex: 'userNo',
    width: '8%'
  }, {
    title: '年级',
    dataIndex: 'gradeName',
    width: '8%'
  }, {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '楼宇',
    dataIndex: 'buildingName',
    width: '10%'
  },
  {
    title: '楼层',
    dataIndex: 'floorName',
    width: '8%'
  },
  {
    title: '宿舍',
    dataIndex: 'roomName',
    width: '10%'
  },

  {
    title: '住宿日期',
    dataIndex: 'inDateTime',
    width: '10%',
    scopedSlots: {
      customRender: 'inDateTime'
    }
  }, {
    title: '离宿日期',
    dataIndex: 'leaveDateTime',
    width: '10%',
    scopedSlots: {
      customRender: 'leaveDateTime'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '8%',
    customRender: text => {
      if (parseInt(text) === 1) {
        return '入住'
      } else if (parseInt(text) === 2) {
        return '退宿'
      } 
    }
  }
]

export default historyTable