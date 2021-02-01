import $tools from '@u/libs/tools'
const columns = {
  record: [{
    title: '序号',
    width: 60,
    scopedSlots: {
      customRender: 'index'
    },
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: 80,
    fixed: 'left'
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    width: 80,
    fixed: 'left'
  },
  {
    title: '日期',
    dataIndex: 'dateTime',
    width: 120,
    fixed: 'left',
    customRender: text => {
      return text ? $tools.getDate(text, 1) : ''
    }
  },
  {
    title: '班次',
    dataIndex: 'shiftTime',
    width: 180,
    fixed: 'left'
  },
  {
    title: '上午上班',
    children: [
      {
        title: '时间',
        dataIndex: 'morningOnRealTime',
        customRender: text => {
          return text ? $tools.getDate(text, 7) : ''
        },
        width: 120
      },
      {
        title: '体温',
        dataIndex: 'morningOnTemperature',
        width: 80
      },
      {
        title: '状态',
        scopedSlots: {
          customRender: 'other1'
        },
        width: 100
      }
    ]
  },
  {
    title: '上午下班',
    children: [
      {
        title: '时间',
        dataIndex: 'morningOffRealTime',
        customRender: text => {
          return text ? $tools.getDate(text, 7) : ''
        },
        width: 120
      },
      {
        title: '体温',
        dataIndex: 'morningOffTemperature',
        width: 80
      },
      {
        title: '状态',
        scopedSlots: {
          customRender: 'other2'
        },
        width: 100
      }
    ]
  },
  {
    title: '下午上班',
    children: [
      {
        title: '时间',
        dataIndex: 'noonOnRealTime',
        customRender: text => {
          return text ? $tools.getDate(text, 7) : ''
        },
        width: 120
      },
      {
        title: '体温',
        dataIndex: 'noonOnTemperature',
        width: 80
      },
      {
        title: '状态',
        scopedSlots: {
          customRender: 'other3'
        },
        width: 100
      }
    ]
  },
  {
    title: '下午下班',
    children: [
      {
        title: '时间',
        dataIndex: 'noonOffRealTime',
        customRender: text => {
          return text ? $tools.getDate(text, 7) : ''
        },
        width: 80
      },
      {
        title: '体温',
        dataIndex: 'noonOffTemperature',
        width: 80
      },
      {
        title: '状态',
        scopedSlots: {
          customRender: 'other4'
        },
        width: 100
      }
    ]
  }
  ],
  total: [
    {
      title: '序号',
      width: '7%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      width: '8%'
    },
    {
      title: '部门',
      dataIndex: 'orgName',
      width: '8%'
    },
    {
      title: '次数统计',
      children: [
        {
          title: '正常',
          dataIndex: 'normalCount',
          width: '7%'
        },
        {
          title: '迟到',
          dataIndex: 'lateCount',
          width: '7%'
        },
        {
          title: '早退',
          dataIndex: 'earlyCount',
          width: '7%'
        },
        {
          title: '上班缺卡',
          dataIndex: 'onNoRecordCount',
          width: '7%'
        },
        {
          title: '下班缺卡',
          dataIndex: 'offNoRecordCount',
          width: '7%'
        },
        {
          title: '缺勤',
          dataIndex: 'noRecord',
          width: '7%'
        }
      ]
    },
    {
      title: '天数统计',
      children: [
        {
          title: '考勤天数',
          dataIndex: 'attendanceDays',
          width: '7%'
        },
        {
          title: '正常',
          dataIndex: 'normalDays',
          width: '7%'
        },
        {
          title: '异常',
          dataIndex: 'abnormalDays',
          width: '7%'
        }
      ]
    },
    {
      title: '操作',
      width: '7%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  detail: [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '日期',
    dataIndex: 'dayTime',
    width: '25%',
    customRender: (text) => {
      return text ? $tools.getDate(text, 1) : ''
    }
  },
  {
    title: '打卡时间',
    dataIndex: 'dealTime',
    width: '25%',
    customRender: (text) => {
      return text ? $tools.getDate(text) : ''
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'onSnacpUrl',
    width: '25%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }]
}
export default columns
