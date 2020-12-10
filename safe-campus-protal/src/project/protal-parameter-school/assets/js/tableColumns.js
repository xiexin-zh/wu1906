// import Tools from '@u/tools'

// 局端
// 精品安全知识
export const boutKnowledgeColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '资源名称',
    dataIndex: 'name',
    width: '10%'
  },
  {
    title: '资源类型',
    dataIndex: 'resourceType',
    width: '10%'
  },
  {
    title: '文件类型',
    dataIndex: 'fileTypeName',
    width: '10%'
  },
  {
    title: '封面图',
    dataIndex: 'thumbnailUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '机构来源',
    dataIndex: 'sourceUnit',
    width: '10%'
  },
  {
    title: '操作',
    width: '15%',
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
