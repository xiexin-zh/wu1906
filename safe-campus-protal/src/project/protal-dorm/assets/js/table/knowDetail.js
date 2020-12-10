const detailTable = [{
  title: '序号',
  scopedSlots: {
    customRender: 'number'
  },
  width: '6%'
}, {
  title: '姓名',
  dataIndex: 'userName',
  width: '7%'
}, {
  title: '宿舍',
  dataIndex: 'buildingName',
  width: '10%'
}, {
  title: '楼栋',
  dataIndex: 'floorName',
  width: '7%'
}, {
  title: '房间',
  dataIndex: 'roomName',
  width: '7%'
},
{
  title: '班级',
  dataIndex: 'className',
  width: '10%'
},
{
  title: '抓拍时间',
  dataIndex: 'recordTime',
  width: '13%',
  scopedSlots: {
    customRender: 'recordTime'
  }
},
{
  title: '备案照片',
  dataIndex: 'photoSrc',
  width: '15%',
  scopedSlots: {
    customRender: 'photoSrc'
  }
},
{
  title: '抓拍照片',
  dataIndex: 'snapSrc',
  width: '15%',
  scopedSlots: {
    customRender: 'snapSrc'
  }
},
{
  title: '设备名称',
  dataIndex: 'controllerName',
  width: '10%',
  customRender: function (text) {
    return text !== '' ? text : '--'
  }
}
]

const konwTable = (type) => {
  if (type === 2) {
    const filterColumn = detailTable.filter(item => {
      return ['recordTime', 'snapSrc', 'controllerName'].indexOf(item.dataIndex) === -1
    })
    return filterColumn
  } else if (type === 3) {
    detailTable.splice(6, 1)
    detailTable.splice(8, 1)
    return detailTable
  }
  return detailTable
}

export default konwTable
