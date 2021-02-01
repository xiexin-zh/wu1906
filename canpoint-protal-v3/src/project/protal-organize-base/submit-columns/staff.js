import { getDataSet } from '@u/libs/data-state'
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '姓名',
    max: 10,
    placeholder: '请输入姓名(限10字内)'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '手机号',
    regular: 'phone',
    placeholder: '请输入正确的手机号'
  },
  {
    value: 'hasJob',
    initValue: 1,
    type: 'radio',
    label: '状态',
    placeholder: '请选择状态',
    list: [
      {
        key: 1,
        val: '在职'
      },
      {
        key: 0,
        val: '离职'
      }
    ]
  },
  {
    value: 'gender',
    initValue: '',
    type: 'radio',
    label: '性别',
    placeholder: '请选择性别',
    list: getDataSet('sex')
  },
  {
    value: 'orgCode',
    initValue: [],
    label: '部门',
    type: 'org',
    required: false,
    allowClear: false
  },
  {
    value: 'stationCode',
    initValue: [],
    type: 'select',
    label: '职务',
    mode: true,
    placeholder: '请选择职务',
    required: false,
    list: []
  },
  {
    value: 'introduce',
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
