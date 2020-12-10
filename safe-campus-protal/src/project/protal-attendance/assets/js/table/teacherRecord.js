import $tools from '@u/tools'
const teacherRecord = {
  columns: [{
    title: '序号',
    width: 50,
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
    title: '组织机构',
    dataIndex: 'orgName',
    width: 150,
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
    width: 280,
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
  searchLabel: [
    {
      value: 'searchKey', // 表单属性
      type: 'input', // 表单类型
      label: '姓名', // 表单label值
      placeholder: '请输入姓名' // 表单默认值(非必选字段)
    },
    {
      value: 'rangeTime', // 日期区间
      type: 'rangeTime',
      initValue: [],
      label: '日期'
    },
    {
      list: [ // 选择列表项，select控件必传
        {
          key: '',
          val: '全部'
        },
        {
          key: '5',
          val: '正常'
        },
        {
          key: '1',
          val: '迟到'
        },
        {
          key: '3',
          val: '缺卡'
        },
        {
          key: '4',
          val: '请假'
        }
      ],
      value: 'morningOnState',
      type: 'select',
      initValue: '',
      label: '上午上班'
    },
    {
      list: [ // 选择列表项，select控件必传
        {
          key: '',
          val: '全部'
        },
        {
          key: '5',
          val: '正常'
        },
        {
          key: '2',
          val: '早退'
        },
        {
          key: '3',
          val: '缺卡'
        },
        {
          key: '4',
          val: '请假'
        }
      ],
      value: 'morningOffState',
      type: 'select',
      initValue: '',
      label: '上午下班'
    },
    {
      list: [ // 选择列表项，select控件必传
        {
          key: '',
          val: '全部'
        },
        {
          key: '5',
          val: '正常'
        },
        {
          key: '1',
          val: '迟到'
        },
        {
          key: '3',
          val: '缺卡'
        },
        {
          key: '4',
          val: '请假'
        }
      ],
      value: 'noonOnState',
      type: 'select',
      initValue: '',
      label: '下午上班'
    },
    {
      list: [ // 选择列表项，select控件必传
        {
          key: '',
          val: '全部'
        },
        {
          key: '5',
          val: '正常'
        },
        {
          key: '2',
          val: '早退'
        },
        {
          key: '3',
          val: '缺卡'
        },
        {
          key: '4',
          val: '请假'
        }
      ],
      value: 'noonOffState',
      type: 'select',
      initValue: '',
      label: '下午下班'
    }
  ]
}
export default teacherRecord
