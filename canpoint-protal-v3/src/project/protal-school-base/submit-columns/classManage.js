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
    value: 'classNum',
    initValue: '',
    type: 'numberInput',
    label: '班级数量',
    isInt: true,
    max: 20,
    placeholder: '请选择班级数量'
  },
  {
    value: 'startOrderNum',
    initValue: '',
    type: 'numberInput',
    label: '起始序号',
    isInt: true,
    max: 50,
    placeholder: '请选择起始序号'
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
    value: 'className',
    initValue: '',
    type: 'input',
    label: '班级',
    max: 20,
    placeholder: '请输入班级名称'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'textarea',
    label: '备注',
    max: 30,
    required: false
  }
]

export { singleForm, allForm }
