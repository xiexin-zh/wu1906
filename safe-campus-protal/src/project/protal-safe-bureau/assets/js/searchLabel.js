// 隐患发现查询条件
export const dangerFindSearchLabel = [
  {
    value: 'source',
    label: '隐患来源',
    type: 'select',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '隐患排查'
      },
      {
        key: '2',
        val: '日常巡查'
      },
      {
        key: '3',
        val: '专项检查'
      },
      {
        key: '4',
        val: '社会监督'
      }
    ]
  },
  {
    label: '隐患等级',
    type: 'select',
    value: 'level',
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '低风险'
      },
      {
        key: '2',
        val: '一般风险'
      },
      {
        key: '3',
        val: '较大风险'
      },
      {
        key: '4',
        val: '重大风险'
      }
    ]
  },
  {
    value: 'streetCode',
    type: 'select',
    label: '所属街道',
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '已上报'
      },
      {
        key: '2',
        val: '已指派 '
      },
      {
        key: '3',
        val: '已处理'
      },
      {
        key: '4',
        val: '已验收'
      },
      {
        key: '5',
        val: '已撤销'
      }
    ]
  },
  {
    value: 'state',
    type: 'select',
    label: '隐患状态',
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '已上报'
      },
      {
        key: '2',
        val: '已指派 '
      },
      {
        key: '3',
        val: '已处理'
      },
      {
        key: '4',
        val: '已验收'
      },
      {
        key: '5',
        val: '已撤销'
      }
    ]
  },
  {
    value: 'schoolName', // 表单属性
    type: 'input', // 表单类型
    label: '', // 表单label值
    placeholder: '请输入学校名称' // 表单默认值(非必选字段)
  }
]
// 隐患督办查询条件
export const searchLabelSupervise = [
  {
    value: 'state',
    type: 'select',
    label: '隐患状态',
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '已上报'
      },
      {
        key: '2',
        val: '已指派 '
      },
      {
        key: '3',
        val: '已处理'
      },
      {
        key: '4',
        val: '已验收'
      },
      {
        key: '5',
        val: '已撤销'
      }
    ]
  },
  {
    value: 'superviseState',
    type: 'select',
    label: '督办状态',
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '正在督办'
      },
      {
        key: '1',
        val: '结束督办 '
      }
    ]
  },
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '', // 表单label值
    placeholder: '请输入督办人姓名' // 表单默认值(非必选字段)
  }
]
// 专项检查
export const checkSearchLabel = [
  {
    value: 'name', // 表单属性
    type: 'input', // 表单类型
    label: '', // 表单label值
    placeholder: '请输入检查项目名称' // 表单默认值(非必选字段)
  }
]
export const taskSearchLabel = [
  {
    value: 'name', // 表单属性
    type: 'input', // 表单类型
    label: '', // 表单label值
    placeholder: '请输入任务名称' // 表单默认值(非必选字段)
  }
]
// 安全事故
export const IncidentSearchLabel = [

  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '新填报'
      },
      {
        key: '2',
        val: '处理中'
      },
      {
        key: '3',
        val: '已结案'
      }
    ],
    value: 'accidentStatus',
    type: 'select',
    label: '事故状态'
  },
  {
    value: 'schoolName',
    type: 'input',
    placeholder: '请输入学校名称',
    label: '学校名称'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '事故时间'
  }
]
// 安全任务
// 任务下发
export const issuanceSearchLabel = [
  {
    value: 'taskType', // 表单属性
    type: 'select', // 表单类型
    label: '任务类型', // 表单label值
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '一次性计划'
      },
      {
        key: '2',
        val: '周计划'
      },
      {
        key: '3',
        val: '月计划'
      }
    ]
  },
  {
    value: 'state', // 表单属性
    type: 'select', // 表单类型
    label: '任务状态', // 表单label值
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '未发布'
      },
      {
        key: '1',
        val: '未开始'
      },
      {
        key: '2',
        val: '进行中'
      },
      {
        key: '3',
        val: '已结束'
      }
    ]
  },
  {
    value: 'taskName', // 表单属性
    type: 'input', // 表单类型
    label: '任务名称', // 表单label值
    placeholder: '请输入任务名称' // 表单默认值(非必选字段)
  }
]
