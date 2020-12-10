// 添加微信
export const wechatFormData = [
  {
    value: 'appKey',
    initValue: '',
    type: 'input',
    label: 'appKey',
    placeholder: '请输入appKey'
  },
  {
    value: 'appSecret',
    initValue: '',
    type: 'input',
    label: 'appSecret',
    placeholder: '请输入appSecret'
  },
  {
    value: 'schoolCode',
    initValue: '',
    type: 'input',
    label: '学校编码',
    placeholder: '请输入学校编码'
  },
  {
    value: 'state',
    initValue: 0,
    list: [
      {
        key: 0,
        val: '否'
      },
      {
        key: 1,
        val: '是'
      }
    ],
    type: 'radio',
    label: '是否启用',
    placeholder: '请选择'
  }
]
export const noteFormData = [
  {
    value: 'appKey',
    initValue: '',
    type: 'input',
    label: 'appKey',
    placeholder: '请输入appKey'
  },
  {
    value: 'appSecret',
    initValue: '',
    type: 'input',
    label: 'appSecret',
    placeholder: '请输入appSecret'
  },
  {
    value: 'domain',
    initValue: '',
    type: 'input',
    label: '域名',
    placeholder: '请输入域名'
  },
  {
    value: 'schoolCode',
    initValue: '',
    type: 'input',
    label: '学校编码',
    placeholder: '请输入学校编码'
  },
  {
    value: 'signName',
    initValue: '',
    type: 'input',
    label: '签名',
    placeholder: '请输入签名'
  },
  {
    value: 'version',
    initValue: '',
    type: 'input',
    label: '版本',
    placeholder: '请输入版本'
  },
  {
    value: 'state',
    initValue: 0,
    list: [
      {
        key: 0,
        val: '否'
      },
      {
        key: 1,
        val: '是'
      }
    ],
    type: 'radio',
    label: '是否启用',
    placeholder: '请选择'
  }
]
export const TemTypeFormData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '模板类型',
    placeholder: '请输入模板类型'
  },
  {
    value: 'code',
    initValue: '',
    type: 'input',
    label: '模板消息编码',
    placeholder: '请输入模板消息编码'
  },
  {
    value: 'type',
    initValue: 0,
    list: [
      {
        key: '1',
        val: '短信消息'
      },
      {
        key: '2',
        val: '微信消息'
      }
    ],
    type: 'radio',
    label: '消息类型',
    placeholder: '请选择'
  }
]
export const temSetFormData = [
  {
    value: 'templateTypeCode',
    initValue: '',
    type: 'select',
    label: '模板类型',
    placeholder: '请输入模板类型',
    list: [
      {
        key: '1',
        val: '短信消息'
      },
      {
        key: '2',
        val: '微信消息'
      }
    ]
  },
  {
    value: 'templateName',
    initValue: '',
    type: 'input',
    label: '模板名称',
    placeholder: '请输入模板名称'
  },
  {
    value: 'templateContent',
    initValue: '',
    type: 'input',
    label: '模板内容',
    placeholder: '请输入模板内容'
  },
  {
    value: 'templateUrl',
    initValue: '',
    type: 'input',
    label: '模板链接',
    placeholder: '请输入模板链接'
    // regular: 'url'
  },
  {
    value: 'templateCode',
    initValue: '',
    type: 'input',
    label: '模板编码',
    placeholder: '请输入模板编码'
  },
  {
    value: 'schoolCode',
    initValue: '',
    type: 'input',
    label: '学校编码',
    placeholder: '请输入学校编码'
  },
  {
    value: 'retryCount',
    initValue: '',
    type: 'numberInput',
    label: '重试次数',
    placeholder: '请输入重试次数'
  },
  {
    value: 'intervalTime',
    initValue: '',
    type: 'numberInput',
    label: '重试间隔时间',
    placeholder: '请输入重试间隔时间'
  }
]
export const temSetNoteFormData = [
  {
    value: 'templateTypeCode',
    initValue: '',
    type: 'select',
    label: '模板类型',
    placeholder: '请输入模板类型',
    list: [

    ]
  },
  {
    value: 'templateName',
    initValue: '',
    type: 'input',
    label: '模板名称',
    placeholder: '请输入模板名称'
  },
  {
    value: 'templateContent',
    initValue: '',
    type: 'input',
    label: '模板内容',
    placeholder: '请输入模板内容'
  },
  {
    value: 'templateCode',
    initValue: '',
    type: 'input',
    label: '模板编码',
    placeholder: '请输入模板编码'
  },
  {
    value: 'schoolCode',
    initValue: '',
    type: 'input',
    label: '学校编码',
    placeholder: '请输入学校编码'
  },
  {
    value: 'retryCount',
    initValue: '',
    type: 'numberInput',
    label: '重试次数',
    placeholder: '请输入重试次数'
  },
  {
    value: 'intervalTime',
    initValue: '',
    type: 'numberInput',
    label: '重试间隔时间',
    placeholder: '请输入重试间隔时间'
  },
  {
    value: 'variableName',
    initValue: '',
    type: 'input',
    label: '变量名',
    placeholder: '请输入变量名,逗号隔开'
  }
]
export const userFormData = [
  {
    value: 'schoolCode',
    initValue: '',
    type: 'input',
    label: '使用者学校编码',
    placeholder: '请输入使用者学校编码'
  },
  {
    value: 'usedSchoolCode',
    initValue: '',
    type: 'input',
    label: '被使用者学校编码',
    placeholder: '请输入被使用者学校编码'
  }
]
