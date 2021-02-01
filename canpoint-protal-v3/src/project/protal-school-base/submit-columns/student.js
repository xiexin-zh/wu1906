const formData = [
  {
    value: 'parentName',
    initValue: '',
    type: 'input',
    label: '家长姓名',
    max: 10,
    placeholder: '请输入'
  },
  {
    value: 'parentPhone',
    initValue: '',
    type: 'input',
    label: '家长手机号',
    placeholder: '请输入',
    regular: 'phone'
  },
  {
    value: 'relationship',
    initValue: [],
    list: [
      {
        key: '1',
        val: '爸爸'
      },
      {
        key: '2',
        val: '妈妈'
      },
      {
        key: '3',
        val: '爷爷'
      },
      {
        key: '4',
        val: '奶奶'
      },
      {
        key: '5',
        val: '其他'
      }
    ],
    type: 'select',
    label: '亲属关系',
    placeholder: '请选择'
  }
]

export default formData
