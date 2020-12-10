const formData = {
  formData1: [
    {
      value: 'type',
      initValue: '',
      type: 'input',
      label: '型号',
      placeholder: '请输入型号'
    },
    {
      value: 'deviceName',
      initValue: '',
      list: [],
      type: 'select',
      label: '类型',
      placeholder: '请选择类型'
    },
    {
      value: 'hasTorn',
      initValue: '1',
      list: [
        {
          key: '1',
          val: '完好'
        },
        {
          key: 0,
          val: '损坏'
        }
      ],
      type: 'radio',
      label: '是否保存良好',
      placeholder: '请选择是否保存良好'
    },
    {
      value: 'buyDate',
      type: 'singleTime',
      label: '购买日期'
    },
    {
      value: 'validDate',
      type: 'singleTime',
      label: '有效期至'
    },
    {
      value: 'address',
      initValue: '',
      type: 'input',
      label: '存放地点',
      placeholder: '请输入存放地点'
    },
    {
      type: 'upload',
      label: '灭火器图片'
    }
  ],
  formData2: [
    {
      value: 'type',
      initValue: '',
      type: 'input',
      label: '型号',
      placeholder: '请输入型号'
    },

    {
      value: 'hasTorn',
      initValue: '1',
      list: [
        {
          key: '1',
          val: '完好'
        },
        {
          key: 0,
          val: '损坏'
        }
      ],
      type: 'radio',
      label: '是否保存良好',
      placeholder: '请选择是否保存良好'
    },
    {
      value: 'buyDate',
      type: 'singleTime',
      label: '购买日期'
    },
    {
      value: 'validDate',
      type: 'singleTime',
      label: '有效期至'
    },
    {
      value: 'address',
      initValue: '',
      type: 'input',
      label: '存放地点',
      placeholder: '请输入存放地点'
    },
    {
      type: 'upload',
      label: '灭火毯图片'
    }
  ],
  formData3: [
    {
      value: 'name',
      initValue: '',
      type: 'input',
      label: '名称',
      placeholder: '请输入名称'
    },
    {
      value: 'num',
      initValue: '',
      type: 'numberInput',
      label: '数量',
      placeholder: '请输入数量',
      min: 1,
      max: 99999
    },
    {
      value: 'hasTorn',
      initValue: '1',
      list: [
        {
          key: '1',
          val: '完好'
        },
        {
          key: 0,
          val: '损坏'
        }
      ],
      type: 'radio',
      label: '是否保存良好',
      placeholder: '请选择是否保存良好'
    },
    {
      value: 'buyDate',
      type: 'singleTime',
      label: '购买日期'
    },
    {
      value: 'validDate',
      type: 'singleTime',
      label: '有效期'
    },
    {
      value: 'address',
      initValue: '',
      type: 'input',
      label: '存放地点',
      placeholder: '请输入存放地点'
    },
    {
      type: 'upload',
      label: '设施图片'
    }
  ],
  formData4: [
    {
      value: 'hasFluent',
      initValue: true,
      list: [
        {
          key: true,
          val: '是'
        },
        {
          key: '1',
          val: '否'
        }
      ],
      type: 'radio',
      label: '是否流畅',
      placeholder: '请选择是否流畅'
    },
    {
      value: 'hasFireDoor',
      initValue: true,
      list: [
        {
          key: true,
          val: '有'
        },
        {
          key: '1',
          val: '无'
        }
      ],
      type: 'radio',
      label: '有无消防门',
      placeholder: '请选择有无消防门'
    },
    {
      value: 'address',
      initValue: '',
      type: 'input',
      label: '所在位置',
      placeholder: '请输入所在位置'
    },
    {
      type: 'upload',
      label: '安全通道图片'
    }
  ]
}
export default formData
