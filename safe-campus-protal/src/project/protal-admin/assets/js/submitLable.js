// 上报隐患表单
export const reportDangerForm = [
  {
    value: 'userName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '指定学校',
    required: true, // 默认为true，不用填写
    readonly: false, // 是否只读,
    disabled: false, // 是否禁用
    // len: 3, // 固定长度
    // max: 4, // 最大长度
    placeholder: '请指定学校',
    change: true
    // regular: 'password' // 正则验证{密码：password，网址：url，IP：ip，手机号：phone，邮箱：email，身份证：card}
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
    value: 'enjoy',
    initValue: [],
    list: [
      {
        key: 1,
        val: '篮球'
      },
      {
        key: 2,
        val: '足球'
      },
      {
        key: 3,
        val: '羽毛球'
      }
    ],
    type: 'checkbox',
    label: '兴趣爱好',
    placeholder: '请选择兴趣爱好'
  },
  {
    value: 'marry',
    initValue: 1,
    list: [
      {
        key: 1,
        val: '已婚'
      },
      {
        key: 2,
        val: '未婚'
      }
    ],
    type: 'radio',
    label: '是否已婚',
    placeholder: '请选择是否已婚'
  },
  {
    type: 'upload',
    label: '上传图像'
  },
  {
    value: 'birthday',
    type: 'singleTime',
    label: '生日',
    initValue: '',
    placeholder: '请选择生日'
  },
  {
    value: 'workTime',
    type: 'rangeTime',
    label: '工作时间',
    initValue: '',
    placeholder: '请选择工作时间'
  }
]
// 安全事故批示表单
export const classificationFormData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '分类名称',
    placeholder: '请填输入分类名称',
    minRows: 2,
    maxRows: 6,
    max: 100
  }
]
