const formData = [
    {
      value: 'majorName',
      initValue: '',
      type: 'input',
      label: '专业名称',
      max: 10,
      placeholder: '请输入专业名称'
    },
    {
      value: 'annualSystem',
      initValue: [],
      list: [
        {
          key: 3,
          val: '三年制'
        },
        {
          key: 4,
          val: '四年制'
        },
        {
          key: 5,
          val: '五年制'
        }
      ],
      type: 'select',
      label: '专业学制',
      placeholder: '请选择专业学制'
    }
  ]
  const formDatas = [
    {
      value: 'majorNameList',
      initValue: '',
      type: 'textarea',
      label: '专业名称',
      placeholder: '请输入专业名称，如有多个请换行',
      minRows: 6,
      maxRows: 20,
      show: true
    },
    {
      value: 'annualSystem',
      initValue: [],
      list: [
        {
          key: 3,
          val: '三年制'
        },
        {
          key: 4,
          val: '四年制'
        },
        {
          key: 5,
          val: '五年制'
        }
      ],
      type: 'select',
      label: '专业学制',
      placeholder: '请选择专业学制'
    }
  ]

export default { formData, formDatas }
