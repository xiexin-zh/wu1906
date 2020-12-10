const source = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '10%'
    },
    {
      title: '广播名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      title: '资源分类',
      dataIndex: 'categoryName',
      width: '15%'
    },
    {
      title: '广播类型',
      dataIndex: 'type',
      width: '15%',
      customRender: text => {
        if (text === '2') {
          return '普通广播'
        } else if (text === '1') {
          return '应急广播'
        } else {
          return ''
        }
      }
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      width: '15%'
    },
    {
      title: '操作',
      width: '25%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  formData: [
    {
      value: 'name',
      initValue: '',
      max: 20,
      type: 'input',
      label: '资源分类名称',
      placeholder: '请输入资源分类名称'
    }
  ],
  searchLabel: [
    {
      list: [],
      value: 'categoryCode',
      type: 'select',
      label: '资源分类'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: 1,
          val: '应急广播'
        },
        {
          key: 2,
          val: '普通广播'
        }
      ],
      value: 'broadcastType',
      type: 'select',
      label: '广播类型'
    },
    {
      value: 'broadcastName',
      type: 'input',
      label: '广播名称',
      placeholder: '请输入'
    }
  ]
}
export default source
