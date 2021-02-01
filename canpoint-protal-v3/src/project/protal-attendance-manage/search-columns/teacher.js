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
      initValue: [],
      label: '日期'
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
      value: 'morningOnState',
      type: 'select',
      initValue: '',
      label: '上午上班'
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
          key: '3',
          val: '缺卡'
        }
      ],
      value: 'morningOffState',
      type: 'select',
      initValue: '',
      label: '上午下班'
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
      value: 'noonOnState',
      type: 'select',
      initValue: '',
      label: '下午上班'
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
          key: '3',
          val: '缺卡'
        }
      ],
      value: 'noonOffState',
      type: 'select',
      initValue: '',
      label: '下午下班'
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
