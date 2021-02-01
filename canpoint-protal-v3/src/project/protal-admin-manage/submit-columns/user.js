const userFormData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '员工姓名',
    placeholder: '请输入'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '手机号码',
    regular: 'phone',
    placeholder: '请输入'
  },
  {
    value: 'roleId',
    initValue: [],
    type: 'select',
    label: '角色名称',
    list: [],
    placeholder: '请选择'
  }
]
const roleFormData = [
  {
    value: 'roleName',
    initValue: '',
    type: 'input',
    label: '角色名称',
    placeholder: '请输入'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'textarea',
    minRows: 5,
    maxRows: 10,
    label: '备注',
    required: false,
    placeholder: '请输入'
  }
]

export default {
  userFormData,
  roleFormData
}
