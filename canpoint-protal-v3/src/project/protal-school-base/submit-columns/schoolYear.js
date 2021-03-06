const formData = [
  {
    value: 'roleName',
    initValue: '',
    type: 'input',
    label: '角色名称',
    max: 10,
    placeholder: '请输入角色名称(限10字内)'
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
