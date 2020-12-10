import $tools from '@u/tools'
const task = {
  taskColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      width: '10%'
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      width: '10%',
      customRender: text => {
        if (text === '1') {
          return '一次性计划'
        } else if (text === '2') {
          return '周计划'
        } else if (text === '3') {
          return '月计划'
        }
      }
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      width: '15%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      width: '15%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    },
    {
      title: '提交人',
      dataIndex: 'completeUserName',
      width: '10%'
    },
    {
      title: '提交时间',
      dataIndex: 'completeDate',
      width: '15%',
      customRender: text => {
        return text ? $tools.getDate(text) : ''
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '10%',
      customRender: text => {
        if (text === '1') {
          return '未填报'
        } else if (text === '2') {
          return '已填报待提交'
        } else if (text === '3') {
          return '已提交'
        } else if (text === '4') {
          return '已补交'
        } else if (text === '5') {
          return '已打回，请重报'
        } else if (text === '6') {
          return '已重报，请提交'
        } else {
          return ''
        }
      }
    },
    {
      title: '操作',
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  taskSearchLabel: [
    {
      value: 'taskName',
      type: 'input',
      label: '任务名称',
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
          val: '未填报'
        },
        {
          key: '2',
          val: '已填报待提交'
        },
        {
          key: '3',
          val: '已提交'
        },
        {
          key: '4',
          val: '已补交'
        },
        {
          key: '5',
          val: '已打回,请重报'
        },
        {
          key: '6',
          val: '已重报,请提交'
        }
      ],
      value: 'state',
      type: 'select',
      label: '状态'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '2',
          val: '教育局发布'
        },
        {
          key: '1',
          val: '学校发布'
        }
      ],
      value: 'source',
      type: 'select',
      label: '任务来源'
    }
  ],
  assignColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      width: '10%'
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      width: '10%',
      customRender: text => {
        if (text === '1') {
          return '一次性计划'
        } else if (text === '2') {
          return '周计划'
        } else if (text === '3') {
          return '月计划'
        }
      }
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      width: '12%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      width: '12%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    },
    {
      title: '发布人',
      dataIndex: 'publisherName',
      width: '10%'
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: '17%',
      customRender: text => {
        return text ? $tools.getDate(text) : ''
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '10%',
      customRender: text => {
        if (text === '0') {
          return '未发布'
        } else if (text === '1') {
          return '未开始'
        } else if (text === '2') {
          return '进行中'
        } else if (text === '3') {
          return '已结束'
        } else {
          return ''
        }
      }
    },
    {
      title: '操作',
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  assignSearchLabel: [
    {
      value: 'taskName',
      type: 'input',
      label: '任务名称',
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
      ],
      value: 'taskType',
      type: 'select',
      label: '任务类型'
    },
    {
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
      ],
      value: 'state',
      type: 'select',
      label: '任务状态'
    }
  ]
}
export default task
