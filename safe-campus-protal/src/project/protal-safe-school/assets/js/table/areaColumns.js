const areaColumns = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '15%'
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      width: '27%'
    },
    {
      title: '设备档案类型',
      dataIndex: 'type',
      width: '28%'
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      width: '30%'
    }
  ],
  equipList: [
    {
      id: '12',
      name: '校车巡检表',
      type: '校车档案',
      time: '2019-01-04 11:10:01'
    },
    {
      id: '13',
      name: '器械巡检表',
      type: '器械档案',
      time: '2019-01-04 11:10:01'
    },
    {
      id: '111',
      name: '灭火器巡检表',
      type: '灭火器档案',
      time: '2019-01-04 11:10:01'
    },
    {
      id: '112',
      name: '灭火毯巡检表',
      type: '灭火毯档案',
      time: '2019-01-04 11:10:01'
    },
    {
      id: '113',
      name: '消火栓巡检表',
      type: '消火栓档案',
      time: '2019-01-04 11:10:01'
    },
    {
      id: '114',
      name: '消防通道巡检表',
      type: '消防通道档案',
      time: '2019-01-04 11:10:01'
    },
    {
      id: '115',
      name: '其他消防器械巡检表',
      type: '其他消防器械档案',
      time: '2019-01-04 11:10:01'
    }
  ]
}
export default areaColumns
