const scoreTable = [{
  title: '序号',
  scopedSlots: {
    customRender: 'number'
  },
  width: '5%'
}, {
  title: '楼宇',
  dataIndex: 'buildingName',
  width: '15%'
}, {
  title: '楼层',
  dataIndex: 'floorName',
  width: '15%'
}, {
  title: '宿舍',
  dataIndex: 'roomName',
  width: '15%'
}, {
  title: '总得分',
  dataIndex: 'scoreValue',
  width: '15%'
},
{
  title: '查寝人员',
  dataIndex: 'createUserName',
  width: '15%'
},
{
  title: '查寝时间',
  dataIndex: 'createDate',
  width: '25%',
  scopedSlots: {
    customRender: 'createDate'
  }
}
]

export default scoreTable
