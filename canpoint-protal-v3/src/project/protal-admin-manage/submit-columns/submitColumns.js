const submitColumns = {
  apply: [
    {
      value: 'appName',
      initValue: '',
      type: 'input',
      label: '应用名称',
      // max: 8, // 最大长度
      placeholder: '请输入应用名称'
    },
    {
      value: 'appCode',
      initValue: '',
      type: 'input',
      label: '应用编码',
      placeholder: '请输入应用编码'
    },
    {
      value: 'appUrl',
      initValue: '',
      type: 'input',
      label: '应用路径',
      max: 300,
      placeholder: '请输入应用路径'
    },
    {
      value: 'appBusinessUrl',
      initValue: '',
      type: 'input',
      label: '业务地址',
      placeholder: '请输入业务地址'
    },
    {
      value: 'photoUrl',
      initValue: [],
      label: '应用Logo',
      type: 'uploadImg',
      length: 1,
      required: true
    },
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '备注',
      minRows: 3,
      maxRows: 5,
      required: false,
      placeholder: '请输入备注'
    }
  ],
  app: [
    {
      value: 'appName',
      initValue: '',
      type: 'input',
      label: '应用名称',
      // max: 8, // 最大长度
      placeholder: '请输入应用名称'
    },
    {
      value: 'appCode',
      initValue: '',
      type: 'input',
      label: '应用编码',
      placeholder: '请输入应用编码'
    },
    {
      value: 'appUrl',
      initValue: '',
      type: 'input',
      label: '应用路径',
      max: 300,
      placeholder: '请输入应用路径'
    },
    {
      value: 'appBusinessUrl',
      initValue: '',
      type: 'input',
      label: '业务地址',
      placeholder: '请输入业务地址'
    },
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '备注',
      minRows: 3,
      maxRows: 5,
      required: false,
      placeholder: '请输入备注'
    }
  ],
  applyDetail: [
    {
      value: 'menuName',
      initValue: '',
      type: 'input',
      label: '菜单名称',
      placeholder: '请输入菜单名称'
    }
  ],
  edu: [
    {
      value: 'schoolName',
      initValue: '',
      type: 'input',
      label: '机构名称',
      max: 30,
      placeholder: '请输入机构名称'
    },
    {
      value: 'schoolCode',
      initValue: '',
      type: 'input',
      label: '机构编码',
      max: 30,
      placeholder: '请输入机构编码'
    },
    {
      value: 'level',
      initValue: [],
      list: [
        {
          key: '1',
          val: '省级'
        },
        {
          key: '2',
          val: '市级'
        },
        {
          key: '3',
          val: '区/县级'
        }
      ],
      type: 'select',
      label: '机构级别',
      placeholder: '请选择机构级别'
    },
    {
      value: 'areaList',
      initValue: [],
      label: '地区',
      type: 'area',
      required: true
    },
    {
      value: 'detailAddress',
      initValue: '',
      type: 'input',
      required: false,
      label: '详细地址',
      max: 200,
      placeholder: '请输入详细地址'
    },
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '备注',
      required: false,
      max: 200,
      placeholder: '请输入备注'
    }
  ],
  school: [
    {
      value: 'schoolName',
      initValue: '',
      type: 'input',
      label: '学校名称',
      max: 30,
      placeholder: '请输入学校名称'
    },
    {
      value: 'schoolCode',
      initValue: '',
      type: 'input',
      label: '学校编码',
      max: 30,
      placeholder: '请输入学校编码'
    },
    {
      type: 'slotOne',
      label: '办学层次'
    },
    {
      type: 'slotTwo',
      label: '学校类型'
    },
    {
      value: 'areaList',
      initValue: [],
      label: '选择地区',
      type: 'area',
      allowClear: false,
      required: true
    },
    {
      value: 'detailAddress',
      initValue: '',
      type: 'input',
      required: false,
      label: '详细地址',
      max: 200,
      placeholder: '请输入详细地址'
    },
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '备注',
      required: false,
      max: 200,
      placeholder: '请输入备注'
    }
  ],
  schDetail: [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名'
    },
    {
      value: 'mobile',
      initValue: '',
      type: 'input',
      label: '手机号',
      placeholder: '请输入手机号',
      regular: 'phone'
    }
  ]
}
export default submitColumns
