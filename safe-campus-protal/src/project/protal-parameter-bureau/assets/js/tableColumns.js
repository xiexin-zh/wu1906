// import Tools from '@u/tools'

// 局端 综合分析统计
export const patrolAllColumns = [
  {
    title: '排名',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    align: 'center',
    width: '40%',
    dataIndex: 'schoolName'
  },
  {
    title: '任务总数',
    align: 'center',
    dataIndex: 'taskCount'
  },
  {
    title: '详细数据',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export const dangerColumns = [
  {
    title: '排名',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    align: 'center',
    width: '40%',
    dataIndex: 'schoolName'
  },
  {
    title: '隐患整改率',
    dataIndex: 'reformRate',
    align: 'center',
    customRender: (text) => {
      return `${text}%`
    }
  },
  {
    title: '详细数据',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export const specialColumns = [
  {
    title: '排名',
    width: '12%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    align: 'center',
    width: '40%',
    dataIndex: 'schoolName'
  },
  {
    title: '专项检查完成率',
    dataIndex: 'doneRate',
    width: '30%',
    align: 'center',
    customRender: (text) => {
      return `${text}%`
    }
  },
  {
    title: '详细数据',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
// 积分规则
export const ruleColumns = [
  {
    title: '项目',
    dataIndex: 'name',
    width: '10%'
  },
  {
    title: '分值',
    dataIndex: 'points',
    width: '8%'
  },
  {
    title: '积分规则',
    dataIndex: 'pointsRules',
    width: '80%'
  }
  // {
  //   title: '操作',
  //   width: '15%',
  //   scopedSlots: {
  //     customRender: 'action'
  //   }
  // }
]
// 安全数据统计
export const dailyStatis = [
  {
    title: '排名',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    align: 'center',
    dataIndex: 'schoolName'
  },
  {
    title: '任务巡查数',
    align: 'center',
    dataIndex: 'allTaskCount'
    // customRender: (text) => {
    //   return `${text}%`
    // }
  },
  {
    title: '已巡查任务数',
    align: 'center',
    dataIndex: 'doneTaskCount'
  },
  {
    title: '未巡查任务数',
    align: 'center',
    // dataIndex: 'undoneTaskCount',
    scopedSlots: {
      customRender: 'action'
    }
  },
  {
    title: '巡查区域数',
    align: 'center',
    dataIndex: 'areaCount'
  },
  {
    title: '完成率',
    align: 'center',
    dataIndex: 'doneRate'
  },
  {
    title: '次数占比',
    align: 'center',
    dataIndex: 'proportion'
  }
]
// 未巡查表格
export const UndoneTaskColumns = [
  {
    title: '巡查记录ID',
    align: 'center',
    dataIndex: 'id'
  },
  {
    title: '巡查人',
    align: 'center',
    dataIndex: 'userName'
    // customRender: (text) => {
    //   return `${text}%`
    // }
  },
  {
    title: '巡查区域',
    align: 'center',
    dataIndex: 'addressName'
  },
  {
    title: '巡查任务名称',
    align: 'center',
    dataIndex: 'taskName'

  },
  {
    title: '巡查时间',
    align: 'center',
    dataIndex: 'checkTime'
  }
]
// 考核统计-查看全部-学校排名
export const schRankingColumns = [
  {
    title: '排名',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    align: 'center',
    dataIndex: 'schoolName'
  },
  {
    title: '得分',
    align: 'center',
    dataIndex: 'ultimateGrade'
    // customRender: (text) => {
    //   return `${text}%`
    // }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
