const formData = [
  {
    value: 'subjectName',
    initValue: '',
    type: 'input',
    label: '学科名称',
    max: 20,
    placeholder: '请输入学科名称(限20字内)'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'textarea',
    label: '备注',
    max: 200,
    required: false,
    minRows: 5,
    placeholder: '请输入备注(限200字内)'
  }
]

export default formData
