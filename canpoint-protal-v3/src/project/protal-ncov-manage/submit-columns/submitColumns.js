// 添加微信
export const otherformData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'sex',
    initValue: [],
    list: [
      {
        key: 1,
        val: '男'
      },
      {
        key: 2,
        val: '女'
      },
      {
        key: 3,
        val: '未知'
      }
    ],
    type: 'select',
    label: '性别',
    placeholder: '请选择性别'
  },
  {
    value: 'temperature',
    initValue: '',
    type: 'numberInput',
    min: 30,
    max: 40,
    decimalSeparator: '1',
    label: '体温',
    placeholder: '请输入请输入体温'
  }
]
