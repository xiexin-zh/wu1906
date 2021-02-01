const allForm = [
  {
    value: 'gradeCode',
    initValue: [],
    list: [],
    type: 'select',
    label: '年级',
    placeholder: '请选择年级'
  },
  {
    value: 'majorCode',
    initValue: [],
    type: 'select',
    label: '专业',
    list: [],
    placeholder: '请选择专业'
  },
  {
    value: 'classNum',
    initValue: '',
    type: 'numberInput',
    label: '班级数量',
    isInt: true,
    max: 20,
    placeholder: '请输入'
  },
  {
    value: 'startOrderNum',
    initValue: '',
    type: 'numberInput',
    label: '起始序号',
    isInt: true,
    max: 50,
    placeholder: '请输入'
  }
]

const singleForm = [
  {
    value: 'gradeCode',
    initValue: [],
    list: [],
    type: 'select',
    label: '年级',
    placeholder: '请选择年级'
  },
  {
    value: 'majorCode',
    initValue: [],
    type: 'select',
    label: '专业',
    list: [],
    placeholder: '请选择专业'
  },
  {
    value: 'className',
    initValue: '',
    type: 'input',
    label: '班级',
    max: 10,
    placeholder: '建议输入：X班'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'textarea',
    label: '备注',
    max: 100,
    required: false,
    minRows: 5,
    placeholder: '请输入备注(限100字内)'
  }
]

export { singleForm, allForm }
