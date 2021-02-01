import $tools from '@u/libs/tools'
const columns = {
  record: [{
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%',
    customRender: (text, record) => {
      return record.schoolYearCode + record.gradeName + record.className
    }
  },
  {
    title: '日期',
    dataIndex: 'dateTime',
    width: '10%',
    customRender: text => {
      return text ? $tools.getDate(text, 1) : ''
    }
  },
  {
    title: '上学',
    width: '30%',
    children: [
      {
        title: '时间',
        dataIndex: 'onTime',
        customRender: text => {
          return text ? $tools.getDate(text, 7) : ''
        },
        width: '10%'
      },
      {
        title: '体温',
        dataIndex: 'onTemperature',
        width: '10%'
      },
      {
        title: '状态',
        scopedSlots: {
          customRender: 'slotFour'
        },
        width: '10%'
      }
    ]
  },
  {
    title: '放学',
    width: '30%',
    children: [
      {
        title: '时间',
        dataIndex: 'offTime',
        customRender: text => {
          return text ? $tools.getDate(text, 7) : ''
        },
        width: '10%'
      },
      {
        title: '体温',
        dataIndex: 'offTemperature',
        width: '10%'
      },
      {
        title: '状态',
        scopedSlots: {
          customRender: 'slotFive'
        },
        width: '10%'
      }
    ]
  }],
  total: [{
    title: '序号',
    width: '6%',
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
    title: '班级',
    dataIndex: 'className',
    width: '10%',
    customRender: (text, record) => {
      return record.schoolYearCode + record.gradeName + record.className
    }
  },
  {
    title: '次数统计',
    width: '46%',
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
        title: '上学缺卡',
        dataIndex: 'onNoRecordCount',
        width: '9%'
      },
      {
        title: '放学缺卡',
        dataIndex: 'offNoRecordCount',
        width: '9%'
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
    width: '23%',
    children: [
      {
        title: '考勤天数',
        dataIndex: 'attendanceDays',
        width: '9%'
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
  }],
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
