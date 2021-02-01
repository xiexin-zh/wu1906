export default [
  {
    value: 'title',
    initValue: '',
    type: 'input',
    label: '标题',
    placeholder: '请输入标题'
  },
  {
    type: 'slotOne',
    label: '正文'
  },
  {
    value: 'hasFrame',
    initValue: 0,
    list: [
      {
        key: 1,
        val: '是'
      },
      {
        key: 0,
        val: '否'
      }
    ],
    type: 'radio',
    label: '强制弹出',
    placeholder: '请选择是否强制弹出'
  }
]
