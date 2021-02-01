export const TDailysearchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '出入时间'
  },
  {
    value: 'recordType',
    type: 'select',
    label: '上报情况',
    placeholder: '请选择',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '抓拍'
      },
      {
        key: '2',
        val: '班牌签到'
      },
      {
        key: '4',
        val: '补卡'
      }
    ]
  }
]
export const invadesearchLabel = [
  {
    value: 'inOrOut',
    type: 'select',
    label: '出入类型',
    placeholder: '请选择',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '进'
      },
      {
        key: 2,
        val: '出'
      }
    ]
  },
  {
    value: 'snapSite',
    type: 'input',
    label: '入侵地点',
    placeholder: '请输入入侵地点'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '入侵时间'
  }
]
