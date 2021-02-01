const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    value: 'mobile', // 分类查询
    type: 'input', // 表单类型
    label: '手机号', // 表单label值
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '在职'
      },
      {
        key: 0,
        val: '离职'
      }
    ],
    value: 'hasJob',
    type: 'select',
    label: '状态'
  }
]

export default searchLabel
