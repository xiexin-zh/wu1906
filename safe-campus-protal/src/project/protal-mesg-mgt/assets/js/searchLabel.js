// import Tools from '@u/tools'
export const templateTypeSearchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '模板类型',
    placeholder: '请输入模板类型'
  },
  {
    value: 'type',
    type: 'select',
    label: '消息类型',
    placeholder: '请选择消息类型',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '短信消息'
      },
      {
        key: '2',
        val: '微信消息'
      }
    ]
  }
]
export const templateSetSearchLabel = [
  {
    value: 'templateName',
    type: 'input',
    label: '模板名称',
    placeholder: '请输入模板名称'
  }
]
