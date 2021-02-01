const searchLabel = [
    {
      value: 'userName',
      type: 'input',
      label: '姓名',
      placeholder: '请输入'
    },
    {
      value: 'mobile',
      type: 'input',
      label: '手机号',
      placeholder: '请输入'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '男'
        },
        {
          key: '2',
          val: '女'
        }
      ],
      value: 'gender',
      type: 'select',
      label: '性别'
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
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '在职'
        },
        {
          key: '0',
          val: '离职'
        }
      ],
      value: 'hasJob',
      type: 'select',
      label: '状态'
    }
  ]

export default searchLabel
