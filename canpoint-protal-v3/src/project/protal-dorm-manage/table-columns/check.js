const check = {
  columns: [
    {
      title: '工作日',
      align: 'center',
      width: '10%',
      dataIndex: 'weekDay'
    },
    {
      title: '考勤时间',
      align: 'center',
      width: '80%',
      scopedSlots: {
        customRender: 'action'
      }
    },
    {
      title: '操作',
      align: 'center',
      width: '10%',
      scopedSlots: {
        customRender: 'other1'
      }
    }
  ],
  specialColumns: [
    {
      title: '日期',
      dataIndex: 'current'
    },
    {
      title: '查寝时间',
      scopedSlots: {
        customRender: 'action'
      }
    },
    {
      title: '操作',
      scopedSlots: {
        customRender: 'other1'
      }
    }
  ]
}
export default check
