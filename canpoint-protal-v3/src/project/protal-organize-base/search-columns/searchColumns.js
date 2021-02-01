
export const searchStreet = [
  {
    value: 'streetName', // 表单属性
    type: 'input', // 表单类型
    label: '街道名称', // 表单label值
    placeholder: '请输入' // 表单默认值(非必选字段)
  }
]
export const searchSchool = [
  {
    value: 'schoolName',
    type: 'input',
    label: '学校名称',
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '幼儿园'
      },
      {
        key: '2',
        val: '小学'
      },
      {
        key: '3',
        val: '初中'
      },
      {
        key: '4',
        val: '高中'
      },
      {
        key: '5',
        val: '中职'
      },
      {
        key: '6',
        val: '高校'
      }
    ],
    value: 'sectionType',
    type: 'select',
    label: '办学层次'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '幼儿园'
      },
      {
        key: '2',
        val: '小学'
      },
      {
        key: '3',
        val: '初中'
      },
      {
        key: '4',
        val: '高中'
      },
      {
        key: '5',
        val: '九年制'
      },
      {
        key: '6',
        val: '十二年制'
      },
      {
        key: '7',
        val: '完全中学'
      },
      {
        key: '8',
        val: '中职'
      },
      {
        key: '9',
        val: '高校'
      }

    ],
    value: 'schoolType',
    type: 'select',
    label: '学校类型'
  },
  {
    value: 'areaList',
    type: 'area',
    label: '地区',
    placeholder: '请选择'
  }
]
export const searchStudent = [
  {
    value: 'keyword',
    type: 'input',
    label: '姓名',
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '走读'
      },
      {
        key: '1',
        val: '住读'
      }
    ],
    value: 'hasDorm',
    type: 'select',
    label: '走住读'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '有照片'
      },
      {
        key: '0',
        val: '无照片'
      }
    ],
    value: 'hasPhoto',
    type: 'select',
    label: '照片'
  }
]
export const searchTeacher = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入'
  },
  {
    value: 'mobile',
    type: 'input',
    label: '手机号',
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '男'
      },
      {
        key: '2',
        val: '女'
      }
    ],
    value: 'gender',
    type: 'select',
    label: '性别'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '在职'
      },
      {
        key: '0',
        val: '离职'
      }
    ],
    value: 'hasJob',
    type: 'select',
    label: '状态'
  }
]
