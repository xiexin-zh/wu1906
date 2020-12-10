import Tools from '@u/tools'
const dailyColumn = {
  task: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '6%'
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '10'
    },
    {
      title: '任务时间',
      dataIndex: 'dates',
      width: '12%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '巡查时间类型',
      dataIndex: 'taskTimeType',
      width: '12%',
      customRender: text => {
        if (text === '1') {
          return '自定义任务'
        } else if (text === '2') {
          return '周任务'
        } else if (text === '3') {
          return '月任务'
        } else if (text === '4') {
          return '季度任务'
        }
      }
    },
    {
      title: '巡查地点',
      dataIndex: 'address',
      width: '10%'
    },
    {
      title: '负责人',
      dataIndex: 'leaderName',
      width: '10'
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '8%',
      scopedSlots: {
        customRender: 'other2'
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: '10%',
      customRender: text => {
        return Tools.getDate(text)
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
  record: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '10%'
    },
    {
      title: '地点名称',
      dataIndex: 'areaName',
      width: '15'
    },
    {
      title: '巡查时间类型',
      dataIndex: 'taskTimeType',
      width: '12%',
      customRender: text => {
        if (text === '1') {
          return '自定义任务'
        } else if (text === '2') {
          return '周任务'
        } else if (text === '3') {
          return '月任务'
        } else if (text === '4') {
          return '季度任务'
        }
      }
    },
    {
      title: '巡查时间',
      width: '20%',
      scopedSlots: {
        customRender: 'other4'
      }
    },
    {
      title: '检查人',
      dataIndex: 'userName',
      width: '15'
    },
    {
      title: '巡查状态',
      dataIndex: 'state',
      width: '15%',
      customRender: text => {
        if (text === '1') {
          return '已巡查'
        } else {
          return '未巡查'
        }
      }
    },
    {
      title: '操作',
      width: '10%',
      scopedSlots: {
        customRender: 'other3'
      }
    }
  ]
}
export default dailyColumn
