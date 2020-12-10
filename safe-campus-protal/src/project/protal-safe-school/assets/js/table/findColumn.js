import $tools from '@u/tools'
const findColumn = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '5%'
    },
    {
      title: '隐患图片',
      dataIndex: 'dangerPhotoUrl',
      width: '8%',
      scopedSlots: {
        customRender: 'photoPic'
      }
    },
    {
      title: '整改图片',
      dataIndex: 'completePhotoUrl',
      width: '8%',
      scopedSlots: {
        customRender: 'photoPic'
      }
    },
    {
      title: '隐患描述',
      ellipsis: true,
      dataIndex: 'description',
      width: '8%'
    },
    {
      title: '隐患来源',
      dataIndex: 'source',
      width: '8%',
      customRender: text => {
        if (text === '1') {
          return '隐患排查'
        } else if (text === '2') {
          return '日常巡查'
        } else if (text === '3') {
          return '专项检查'
        } else if (text === '4') {
          return '社会监督'
        }
      }
    },
    {
      title: '隐患类型',
      dataIndex: 'categoryName',
      width: '8%'
    },
    {
      title: '上报人',
      dataIndex: 'reportName',
      width: '8%'
    },
    {
      title: '隐患状态',
      dataIndex: 'state',
      width: '8%',
      customRender: text => {
        if (text === '1') {
          return '已上报'
        } else if (text === '2') {
          return '已指派'
        } else if (text === '3') {
          return '已处理'
        } else if (text === '4') {
          return '已验收'
        } else if (text === '5') {
          return '已撤销'
        }
      }
    },
    {
      title: '隐患等级',
      dataIndex: 'level',
      width: '8%',
      customRender: text => {
        if (text === '1') {
          return '低风险'
        } else if (text === '2') {
          return '一般风险'
        } else if (text === '3') {
          return '较大风险'
        } else if (text === '4') {
          return '重大风险'
        }
      }
    },
    {
      title: '处理人',
      dataIndex: 'handerName',
      width: '8%'
    },
    {
      title: '最近操作时间',
      dataIndex: 'optTime',
      width: '10%',
      customRender: text => {
        return $tools.getDate(text)
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
          val: '已上报'
        },
        {
          key: '2',
          val: '已指派'
        },
        {
          key: '3',
          val: '已处理'
        },
        {
          key: '4',
          val: '已验收'
        },
        {
          key: '5',
          val: '已撤销'
        }
      ],
      value: 'state',
      type: 'select',
      label: '隐患状态'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '隐患排查'
        },
        {
          key: '2',
          val: '日常检查'
        },
        {
          key: '3',
          val: '专项检查'
        },
        {
          key: '4',
          val: '社会监督'
        }
      ],
      value: 'source',
      type: 'select',
      label: '隐患来源'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '低风险'
        },
        {
          key: '2',
          val: '一般风险'
        },
        {
          key: '3',
          val: '较大风险'
        },
        {
          key: '4',
          val: '重大风险'
        }
      ],
      value: 'level',
      type: 'select',
      label: '隐患等级'
    },
    {
      value: 'rangeTime', // 日期区间
      type: 'rangeTime',
      label: '操作时间'
    },
    {
      value: 'userName',
      type: 'input',
      label: '上报人/处理人',
      placeholder: '请输入'
    }
  ]
}
export default findColumn
