const leaveTable = [{
  title: '序号',
  scopedSlots: {
    customRender: 'number'
  },
  width: '6%'
}, {
  title: '姓名',
  dataIndex: 'userName',
  width: '9%'
}, {
  title: '学号',
  dataIndex: 'userNo',
  width: '13%'
}, {
  title: '年级',
  dataIndex: 'gradeName',
  width: '9%'
}, {
  title: '班级',
  dataIndex: 'className',
  width: '9%'
},
{
  title: '楼宇',
  dataIndex: 'buildingName',
  width: '9%'
},
{
  title: '楼层',
  dataIndex: 'floorName',
  width: '6%'
},
{
  title: '宿舍',
  dataIndex: 'roomName',
  width: '6%'
},
{
  title: '请假类型',
  dataIndex: 'type',
  width: '9%'
  // scopedSlots: {
  //   customRender: 'type'
  // }
},
{
  title: '开始时间',
  dataIndex: 'beginTime',
  width: '12%',
  scopedSlots: {
    customRender: 'beginTime'
  }
}, {
  title: '结束时间',
  dataIndex: 'endTime',
  width: '12%',
  scopedSlots: {
    customRender: 'endTime'
  }
}
]

export default leaveTable
