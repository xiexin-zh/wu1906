import { getDataSet } from '@u/libs/data-state'
export const studentSearchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入'
  },
  {
    value: 'workNo',
    type: 'input',
    label: '学号',
    placeholder: '请输入'
  },
  {
    list: getDataSet('sex'),
    value: 'gender',
    type: 'select',
    label: '性别'
  }
]
