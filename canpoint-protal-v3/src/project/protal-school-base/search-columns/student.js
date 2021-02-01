const searchLabel = [
    {
      value: 'keyword',
      type: 'input',
      label: '姓名',
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
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '已绑定'
        },
        {
          key: '0',
          val: '未绑定'
        }
      ],
      value: 'hasBindParent',
      type: 'select',
      label: '家长'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '已分班'
        },
        {
          key: '0',
          val: '未分班'
        }
      ],
      value: 'hasClass',
      type: 'select',
      label: '班级'
    }
  ]

export default searchLabel
