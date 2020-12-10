import $tools from '@u/tools'
const task = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: '10%'
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      width: '12%',
      customRender: text => {
        if (text === '2') {
          return '周任务'
        } else if (text === '1') {
          return '一次性任务'
        } else {
          return ''
        }
      }
    },
    {
      title: '作息分类',
      dataIndex: 'categoryName',
      width: '10%'
    },
    {
      title: '任务说明',
      dataIndex: 'taskDescription',
      width: '15%',
      customRender: text => {
        return `${text}一次`
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '12%',
      customRender: text => {
        return $tools.getDate(text)
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: '12%',
      customRender: text => {
        return $tools.getDate(text)
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '8%',
      customRender: text => {
        if (text === '0') {
          return '禁用'
        } else if (text === '1') {
          return '启用'
        } else {
          return ''
        }
      }
    },
    {
      title: '操作',
      width: '12%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  searchLabel: [
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '一次性任务'
        },
        {
          key: '2',
          val: '周任务'
        }
      ],
      value: 'taskType',
      type: 'select',
      label: '任务类型'
    },
    {
      list: [],
      value: 'categoryCode',
      type: 'select',
      label: '作息分类'
    },
    {
      value: 'name',
      type: 'input',
      label: '任务名称',
      placeholder: '请输入'
    }
  ],
  formData: [
    {
      value: 'name',
      initValue: '',
      type: 'input',
      label: '分类名称',
      placeholder: '请输入分类名称'
    },
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '备注',
      max: 200,
      minRows: 5,
      maxRows: 10,
      placeholder: '请输入备注, 不超过200个字符',
      required: false
    }
  ]
}
export default task
