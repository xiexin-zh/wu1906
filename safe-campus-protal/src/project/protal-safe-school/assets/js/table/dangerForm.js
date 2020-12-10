const dangerForm = {
  formData1: [
    {
      value: 'categoryCode',
      initValue: '',
      list: [],
      type: 'select',
      label: '隐患类型',
      placeholder: '请选择类型'
    },
    {
      value: 'level',
      initValue: '1',
      list: [
        {
          key: '1',
          val: '低风险'
        },
        {
          key: '2',
          val: '一般风险'
        },
        {
          key: '3',
          val: '较大风险'
        },
        {
          key: '4',
          val: '重大风险'
        }
      ],
      type: 'select',
      label: '隐患等级',
      placeholder: '请选择隐患等级'
    },
    {
      value: 'handlerCode',
      initValue: '',
      list: [],
      type: 'select',
      label: '处理人',
      placeholder: '请选择处理人'
    },
    {
      value: 'countHourse',
      initValue: '',
      type: 'numberInput',
      label: '要求处理完成时间',
      min: 1,
      max: 72,
      placeholder: '1-72小时内（单位：小时）'
    },
    {
      value: 'hasDispense',
      initValue: '1',
      list: [
        {
          key: '1',
          val: '允许'
        },
        {
          key: 0,
          val: '不允许'
        }
      ],
      type: 'radio',
      label: '是否允许转派',
      placeholder: '请选择是否允许转派'
    }
  ],
  formData2: [
    {
      value: 'handlerCode',
      initValue: '',
      list: [],
      type: 'select',
      label: '处理人',
      placeholder: '请选择处理人'
    }
  ],
  formData3: [
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '撤销理由',
      placeholder: '请输入撤销理由'
    }
  ]
}
export default dangerForm
