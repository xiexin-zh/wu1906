import $tools from '@u/tools'
const identify = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: '12%'
    },
    {
      title: '项目类型',
      dataIndex: 'typeName',
      width: '12%'
    },
    {
      title: '评估方式',
      dataIndex: 'methodName',
      width: '12%'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      width: '15%',
      customRender: text => {
        return text ? $tools.getDate(text, 1) : ''
      }
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      width: '10%',
      customRender: text => {
        if (text === '1') {
          return '未开始'
        } else if (text === '2') {
          return '进行中'
        } else if (text === '3') {
          return '已完成'
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
  searchLabel: [
    {
      value: 'name',
      type: 'input',
      label: '项目名称',
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
          val: '设备设施及区域'
        },
        {
          key: '2',
          val: '教育教学活动'
        }
      ],
      value: 'typeCode',
      type: 'select',
      label: '项目类型'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '风险矩阵-LS'
        },
        {
          key: '2',
          val: '教学条件危险性分析法-LEC'
        }
      ],
      value: 'methodCode',
      type: 'select',
      label: '评估方式'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
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
          val: '已完成'
        }
      ],
      value: 'status',
      type: 'select',
      label: '项目状态'
    }
  ],
  identifyColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '风险分类',
      dataIndex: 'categoryName',
      width: '15%'
    },
    {
      title: '检查对象',
      dataIndex: 'checkObject',
      width: '15%'
    },
    {
      title: '潜在风险',
      dataIndex: 'riskContent',
      width: '15%'
    },
    {
      title: '事故类型',
      dataIndex: 'riskType',
      width: '15%'
    },
    {
      title: '操作',
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  identifyCheck: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '风险分类',
      dataIndex: 'categoryName',
      width: '20%'
    },
    {
      title: '检查对象',
      dataIndex: 'checkObject',
      width: '20%'
    },
    {
      title: '潜在风险',
      dataIndex: 'riskContent',
      width: '25%'
    },
    {
      title: '事故类型',
      dataIndex: 'riskType',
      width: '25%'
    }
  ]
}
export default identify
