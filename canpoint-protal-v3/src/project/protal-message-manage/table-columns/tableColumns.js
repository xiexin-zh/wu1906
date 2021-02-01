import $tools from '@u/libs/tools'

export const msgLog = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '模板ID',
    ellipsis: true,
    dataIndex: 'messageTemplateCode',
    width: '12%'
  },
  {
    title: '消息类型',
    dataIndex: 'messageType',
    width: '10%',
    customRender: text => {
      if (text === '1') {
        return '短信消息'
      } else if (text === '2') {
        return '微信消息'
      }
    }
  },
  {
    title: '入参',
    dataIndex: 'requestParam',
    // ellipsis: true,
    width: '35%'
  },
  {
    title: '出参',
    // ellipsis: true,
    dataIndex: 'responseParam',
    width: '35%'
  },
  {
    title: '发送时间',
    dataIndex: 'requestTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '发送状态',
    dataIndex: 'responseState',
    customRender: text => {
      return text ? '成功' : '失败'
    },
    width: '10%'
  }
]
export const wechart = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: 'appKey',
    ellipsis: true,
    dataIndex: 'appKey',
    width: '12%'
  },
  {
    title: 'appSecret',
    dataIndex: 'appSecret',
    width: '10%'
  },
  {
    title: '学校编码',
    dataIndex: 'schoolCode',
    width: '10%'
  },
  {
    title: '是否启用',
    dataIndex: 'state',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export const note = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: 'appKey',
    ellipsis: true,
    dataIndex: 'appKey',
    width: '12%'
  },
  {
    title: 'appSecret',
    dataIndex: 'appSecret',
    width: '10%'
  },
  {
    title: '域名',
    dataIndex: 'domain',
    width: '10%'
  },
  {
    title: '学校编码',
    dataIndex: 'schoolCode',
    width: '10%'
  },
  {
    title: '签名',
    dataIndex: 'signName',
    width: '10%'
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: '10%'
  },
  {
    title: '是否启用',
    dataIndex: 'state',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export const template = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '模板类型',
    ellipsis: true,
    dataIndex: 'name',
    width: '12%'
  },
  {
    title: '模板消息编码',
    dataIndex: 'code',
    width: '10%'
  },
  {
    title: '消息类型',
    dataIndex: 'type',
    width: '10%',
    customRender: (text) => {
      if (text === '1') {
        return '短信消息'
      } else if (text === '2') {
        return '微信消息'
      }
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export const templateSet = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '模板名称',
    ellipsis: true,
    dataIndex: 'templateName'
  },
  {
    title: '模板内容',
    dataIndex: 'templateContent',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '模板类型',
    ellipsis: true,
    dataIndex: 'templateTypeName'
  },
  {
    title: '重试次数',
    ellipsis: true,
    dataIndex: 'retryCount'
  },
  {
    title: '间隔时间',
    ellipsis: true,
    dataIndex: 'intervalTime'
  },
  {
    title: '学校编码',
    dataIndex: 'schoolCode'
  },
  {
    title: '模板地址',
    dataIndex: 'templateUrl'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export const templateSetNote = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '模板名称',
    ellipsis: true,
    dataIndex: 'templateName'
  },
  {
    title: '模板内容',
    dataIndex: 'templateContent',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '模板类型',
    ellipsis: true,
    dataIndex: 'templateTypeName'
  },
  {
    title: '重试次数',
    ellipsis: true,
    dataIndex: 'retryCount'
  },
  {
    title: '间隔时间',
    ellipsis: true,
    dataIndex: 'intervalTime'
  },
  {
    title: '学校编码',
    dataIndex: 'schoolCode'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export const user = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '使用者',
    ellipsis: true,
    dataIndex: 'schoolCode'
  },

  {
    title: '被使用者',
    ellipsis: true,
    dataIndex: 'usedSchoolCode'
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
