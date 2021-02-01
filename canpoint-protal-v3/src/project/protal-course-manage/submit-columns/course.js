const formData = [
  {
    value: 'dutyName',
    initValue: '',
    type: 'input',
    label: '课程名称',
    max: 20,
    placeholder: '请输入课程名称(限20字内)'
  },
  {
    value: 'mark',
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
