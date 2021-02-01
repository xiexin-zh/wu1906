const searchLabel = [
    {
      value: 'keyword',
      type: 'input',
      label: '姓名',
      placeholder: '请输入'
    },
    {
      value: 'workNo',
      type: 'input',
      label: '学号',
      placeholder: '请输入'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '0',
          val: '走读'
        },
        {
          key: '1',
          val: '住读'
        }
      ],
      value: 'hasDorm',
      type: 'select',
      label: '走住读'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '有照片'
        },
        {
          key: '0',
          val: '无照片'
        }
      ],
      value: 'hasPhoto',
      type: 'select',
      label: '照片'
    }
  ]

export default searchLabel
