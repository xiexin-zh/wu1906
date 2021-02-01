export const TDailysearchLabel = [
  {
    value: 'enableRecord',
    type: 'select',
    label: '上报情况',
    placeholder: '请选择',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '未上报'
      },
      {
        key: '1',
        val: '已上报'
      }
    ]
  },
  {
    value: 'enableFever',
    type: 'select',
    label: '是否发热',
    placeholder: '请选择',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '否'
      },
      {
        key: '1',
        val: '是'
      }
    ]
  },
  {
    value: 'dateTime',
    type: 'singleTime',
    label: '日期'
  }
]
export const ThealthySearchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 'false',
        val: '未建档'
      },
      {
        key: 'true',
        val: '已建档'
      }
    ],
    value: 'state',
    type: 'select',
    label: '状态'
  }
]
export const TReportSearchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '上报时间'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 'false',
        val: '未发热'
      },
      {
        key: 'true',
        val: '发热'
      }
    ],
    value: 'enableFever',
    type: 'select',
    label: '状态'
  }
]
export const otherSearchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '上报时间'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 'false',
        val: '未发热'
      },
      {
        key: 'true',
        val: '发热'
      }
    ],
    value: 'enableFever',
    type: 'select',
    label: '状态'
  }
]
