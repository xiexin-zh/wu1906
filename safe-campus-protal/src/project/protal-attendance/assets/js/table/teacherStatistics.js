const teacherStatistics = [
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
    title: '部门',
    dataIndex: 'orgName',
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
        title: '上班缺卡',
        dataIndex: 'onNoRecordCount',
        width: '7%'
      },
      {
        title: '下班缺卡',
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
    width: '7%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
// const teacherStatistics = [
//   {
//     title: '序号',
//     width: '6%',
//     scopedSlots: {
//       customRender: 'index'
//     }
//   },
//   {
//     title: '姓名',
//     dataIndex: 'userName',
//     width: '8%'
//   },
//   {
//     title: '工号',
//     dataIndex: 'workNo',
//     width: '8%'
//   },
//   {
//     title: '组织机构',
//     dataIndex: 'orgName',
//     width: '8%'
//   },
//   {
//     title: '正常次数',
//     dataIndex: 'normalCount',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'other1'
//     }
//   },
//   {
//     title: '迟到次数',
//     dataIndex: 'lateCount',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'other2'
//     }
//   },
//   {
//     title: '早退次数',
//     dataIndex: 'earlyCount',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'other3'
//     }
//   },
//   {
//     title: '上班缺卡次数',
//     dataIndex: 'onNoRecordCount',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'other5'
//     }
//   },
//   {
//     title: '下班缺卡次数',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'totalNum'
//     }
//   },
//   {
//     title: '请假次数',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'other6'
//     }
//   },
//   {
//     title: '缺勤次数',
//     dataIndex: 'noRecord',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'other4'
//     }
//   },
//   {
//     title: '操作',
//     width: '8%',
//     scopedSlots: {
//       customRender: 'action'
//     }
//   }
// ]
export default teacherStatistics
