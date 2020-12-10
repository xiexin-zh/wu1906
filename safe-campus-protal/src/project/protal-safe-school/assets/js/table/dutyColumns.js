import $tools from '@u/tools'
const dutyColumns = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '上报人',
      dataIndex: 'reporterName',
      width: '10'
    },
    {
      title: '上报时间',
      dataIndex: 'reportTime',
      width: '12%',
      customRender: text => {
        return text ? $tools.getDate(text) : ''
      }
    },
    {
      title: '值班人员',
      dataIndex: 'watch',
      width: '10'
    },
    {
      title: '带班领导',
      dataIndex: 'leader',
      width: '10'
    },
    {
      title: '状态',
      dataIndex: 'patrolStatus',
      width: '8%',
      customRender: text => {
        if (text === '1') {
          return '正常'
        } else if (text === '0') {
          return '异常'
        }
      }
    },
    {
      title: '值班轨迹',
      width: '15%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '巡查点数量',
      width: '10%',
      scopedSlots: {
        customRender: 'other2'
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
      value: 'time',
      type: 'rangeTime',
      label: '上报时间'
    },
    {
      value: 'reporterName',
      type: 'input',
      label: '上报人姓名',
      placeholder: '请输入'
    },
    {
      value: 'watchName',
      type: 'input',
      label: '值班人姓名',
      placeholder: '请输入'
    },
    {
      value: 'leaderName',
      type: 'input',
      label: '带班领导姓名',
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
          val: '正常'
        },
        {
          key: '0',
          val: '异常'
        }
      ],
      value: 'status',
      type: 'select',
      label: '状态'
    }
  ],
  inspectColumns: [
    {
      title: '巡查地点名称',
      dataIndex: 'patrolPointName',
      width: '30'
    },
    {
      title: '巡查结果',
      dataIndex: 'patrolResult',
      width: '30',
      customRender: text => {
        return text ? '正常' : '异常'
      }
    },
    {
      title: '巡查时间',
      dataIndex: 'patrolTime',
      width: '30%',
      customRender: text => {
        return $tools.getDate(text)
      }
    }
  ]
}
export default dutyColumns
