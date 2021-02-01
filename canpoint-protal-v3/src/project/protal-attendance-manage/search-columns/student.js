const searchLabel = {
  record: [
    {
      value: 'searchKey',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名'
    },
    {
      value: 'rangeTime',
      type: 'rangeTime',
      label: '起始时间'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '5',
          val: '正常'
        },
        {
          key: '1',
          val: '迟到'
        },
        {
          key: '3',
          val: '缺卡'
        }
      ],
      value: 'onStatue',
      type: 'select',
      label: '上学'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '5',
          val: '正常'
        },
        {
          key: '2',
          val: '早退'
        },
        {
          key: '6',
          val: '缺卡'
        }
      ],
      value: 'offStatue',
      type: 'select',
      label: '放学'
    }
  ],
  total: [
    {
      value: 'searchKey',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名'
    },
    {
      value: 'rangeTime',
      type: 'rangeTime',
      label: '日期'
    }
  ]
}

export default searchLabel
