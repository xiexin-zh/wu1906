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
  }
]

export default searchLabel
