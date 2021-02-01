export const submitStreet = [
  {
    value: 'streetName',
    initValue: '',
    type: 'input',
    label: '街道名称',
    placeholder: '请输入街道名称'
  },
  {
    value: 'workAddress',
    initValue: '',
    type: 'input',
    required: false,
    label: '办公地点',
    placeholder: '请输入办公地点'
  }
]
// 督办小组
export const submitGroup = [
  {
    value: 'groupName',
    initValue: '',
    type: 'input',
    label: '小组名称',
    placeholder: '请输入小组名称'
  },
  {
    type: 'slotOne',
    label: '小组长'
  },
  {
    type: 'slotThree',
    required: true,
    label: '小组长联系方式'
  },
  // {
  //   value: 'leaderPhone',
  //   initValue: '',
  //   type: 'input',
  //   label: '小组长联系方式',
  //   disabled: true,
  //   required: false,
  //   placeholder: '请选择小组长'
  // },
  {
    type: 'slotTwo',
    label: '成员'
  }
]
