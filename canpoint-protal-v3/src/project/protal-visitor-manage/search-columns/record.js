import { getDataSet } from '@u/libs/data-state'
const searchLabel = [
  {
    value: 'keyword', // 分类查询
    type: 'selectInput', // 表单类型
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '手机号'
      }
    ],
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      ...getDataSet('approvalStatus')
    ],
    value: 'state',
    type: 'select',
    label: '审批状态'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      ...getDataSet('visitState')
    ],
    value: 'visitState',
    type: 'select',
    label: '访问状态'
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '访问日期'
  }
]

export default searchLabel
