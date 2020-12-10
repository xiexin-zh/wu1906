const studentStatistics = [
  {
    title: '序号',
    width: '7%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '8%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '8%'
  },
  {
    title: '次数统计',
    children: [
      {
        title: '正常次数',
        dataIndex: 'normalCount',
        width: '7%'
      },
      {
        title: '迟到次数',
        dataIndex: 'lateCount',
        width: '7%'
      },
      {
        title: '早退次数',
        dataIndex: 'earlyCount',
        width: '7%'
      },
      {
        title: '上学缺卡',
        dataIndex: 'onNoRecordCount',
        width: '7%'
      },
      {
        title: '放学缺卡',
        dataIndex: 'offNoRecordCount',
        width: '7%'
      },
      {
        title: '请假次数',
        dataIndex: 'leaveCount',
        width: '7%'
      },
      {
        title: '缺勤次数',
        dataIndex: 'noRecord',
        width: '7%'
      }
    ]
  },
  {
    title: '天数统计',
    children: [
      {
        title: '考勤天数',
        dataIndex: 'attendanceDays',
        width: '7%'
      },
      {
        title: '正常天数',
        dataIndex: 'normalDays',
        width: '7%'
      },
      {
        title: '异常天数',
        dataIndex: 'abnormalDays',
        width: '7%'
      }
    ]
  },
  {
    title: '操作',
    width: '6%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
// const studentStatistics = [
//   {
//     title: '序号',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'index'
//     }
//   },
//   {
//     title: '姓名',
//     dataIndex: 'userName',
//     width: '10%'
//   },
//   {
//     title: '学号',
//     dataIndex: 'workNo',
//     width: '10%'
//   },
//   {
//     title: '年级',
//     dataIndex: 'gradeName',
//     width: '10%'
//   },
//   {
//     title: '班级',
//     dataIndex: 'className',
//     width: '10%'
//   },
//   {
//     title: '正常次数',
//     dataIndex: 'normalCount',
//     width: '10%',
//     scopedSlots: {
//       customRender: 'other1'
//     }
//   },
//   {
//     title: '迟到次数',
//     dataIndex: 'lateCount',
//     width: '10%',
//     scopedSlots: {
//       customRender: 'other2'
//     }
//   },
//   {
//     title: '早退次数',
//     dataIndex: 'earlyCount',
//     width: '10%',
//     scopedSlots: {
//       customRender: 'other3'
//     }
//   },
//   // {
//   //   title: '上学缺卡次数',
//   //   dataIndex: 'start',
//   //   width: '10%'
//   // },
//   // {
//   //   title: '放学缺卡次数',
//   //   dataIndex: 'end',
//   //   width: '10%'
//   // },
//   // {
//   //   title: '请假次数',
//   //   dataIndex: 'leave',
//   //   width: '10%'
//   // },
//   {
//     title: '缺勤次数',
//     dataIndex: 'noRecord',
//     width: '10%',
//     scopedSlots: {
//       customRender: 'other4'
//     }
//   },
//   {
//     title: '操作',
//     width: '10%',
//     scopedSlots: {
//       customRender: 'action'
//     }
//   }
// ]
export default studentStatistics
