const today = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '广播名称',
      dataIndex: 'audioName',
      width: '10%'
    },
    {
      title: '播放时间',
      dataIndex: 'playTime',
      width: '12%'
    },
    {
      title: '播放区域',
      dataIndex: 'playArea',
      width: '10%'
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      width: '12%'
    },
    {
      title: '试听',
      width: '10%',
      scopedSlots: {
        customRender: 'action'
      }
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
      title: '播放状态',
      dataIndex: 'playState',
      width: '12%'
    },
    {
      title: '作息分类',
      width: '12%',
      dataIndex: 'taskCategory'
    }
  ],
  searchLabel: [
    {
      value: 'date',
      type: 'singleTime',
      label: '选择时间',
      initValue: '',
      placeholder: '请选择'
    },
    {
      value: 'areaName',
      type: 'input',
      label: '播放区域',
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
          val: '已播放'
        },
        {
          key: '0',
          val: '待播放'
        }
      ],
      value: 'playState',
      type: 'select',
      label: '播放状态'
    }
  ]
}
export default today
