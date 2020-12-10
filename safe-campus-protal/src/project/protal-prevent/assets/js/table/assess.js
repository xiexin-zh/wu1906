const assess = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      title: '检查对象',
      dataIndex: 'checkObject',
      width: '15%'
    },
    {
      title: '潜在风险',
      width: '15%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '事故类型',
      dataIndex: 'accidentType',
      width: '15%'
    },
    {
      title: '建议风险等级',
      width: '15%',
      scopedSlots: {
        customRender: 'other2'
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: '15%',
      customRender: text => {
        if (text === '1') {
          return '未审核'
        } else if (text === '2') {
          return '已审核，已重新评定'
        } else if (text === '3') {
          return '已审核，已通过'
        } else {
          return ''
        }
      }
    },
    {
      title: '操作',
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  searchLabel: [
    {
      value: 'riskContent',
      type: 'input',
      label: '潜在风险',
      placeholder: '请输入'
    }
  ],
  controlList: [
    {
      key: '1',
      val: '校级'
    }, {
      key: '2',
      val: '副校级'
    }, {
      key: '3',
      val: '处级（科级、科室级、处科级）'
    }, {
      key: '4',
      val: '岗位责任人（责任人）'
    }, {
      key: '5',
      val: '园级'
    }, {
      key: '6',
      val: '副园级'
    }
  ],
  postList: [
    {
      key: '1',
      val: '学校负责人'
    }, {
      key: '2',
      val: '院系负责人'
    }, {
      key: '3',
      val: '科室负责人'
    }, {
      key: '4',
      val: '老师'
    }
  ],
  lList: [
    {
      key: '1',
      val: '可能性小，完全意外。或危害的发生容易被发现；现场有监测系统或曾经做过监测；或过去曾经发生类似事故、事件；或在异常情况下发生过类似事故、事件。'
    }, {
      key: '2',
      val: '可能，但不经常。或危害的发生不容易被发现；现场有监测系统或保护措施，在现场有控制措施，但未有效执行或控制措施不当。'
    }, {
      key: '3',
      val: '相当可能，危害的发生不能被发现。在现场没有采取防范、监测、保护、控制措施；在正常情况下经常发生此类事故、事件。'
    }, {
      key: '4',
      val: '完全可以预料。'
    }
  ],
  eList: [
    {
      key: '1',
      val: '非常罕见地暴露'
    }, {
      key: '2',
      val: '每年暴露几次'
    }, {
      key: '3',
      val: '每月一次暴露'
    }, {
      key: '4',
      val: '每周一次或偶然暴露'
    }, {
      key: '5',
      val: '每天工作时间内暴露'
    }, {
      key: '6',
      val: '连续暴露'
    }
  ],
  cList: [
    {
      key: '1',
      val: '不符合管理要求，能造成设备损坏或造成1万元以下经济损失。'
    }, {
      key: '2',
      val: '能造成人员轻伤受伤或造成1万元以上10万元以下经济损失'
    }, {
      key: '3',
      val: '能造成人员骨折、慢性病等严重伤害或造成10万元以上50以下经济损失。'
    }, {
      key: '4',
      val: '能造成人员伤亡或造成50万元以上经济损失。'
    }
  ],
  lsList: [
    {
      key: '1',
      val: '有充分、有效的防范、控制、监测、保护措施，管理人员安全意识高，严格执行操作规程，极不可能发生安全事故。'
    }, {
      key: '2',
      val: '现场有防范控制措施，如发生安全事故，能有效控制，发生安全事故的可能性很小。'
    }, {
      key: '3',
      val: '现场有防范、监测、保护、控制措施，但管理人员为有效执行或控制措施不当，可能发生安全事故。'
    }, {
      key: '4',
      val: '现场有采取防范、监测、保护、控制措施、曾发生过安全事故，安全管理不规范，发生安全事故的可能性大。'
    }
  ],
  sList: [
    {
      key: '1',
      val: '不符合安全管理要求，能造成设备损坏或造成1万元以下经济损失。'
    }, {
      key: '2',
      val: '能造成人员轻度受伤或造成1万元以上10万元以下经济损失。'
    }, {
      key: '3',
      val: '能造成人员骨折、慢性病等严重伤害或造成10万元以上50万元以下经济损失。'
    }, {
      key: '4',
      val: '能造成人员伤亡或造成50万元以上经济损失。'
    }
  ],
  remarkList: [
    {
      title: '科学技术：',
      key: 'scientificMeasures',
      val: ''
    }, {
      title: '个体防护：',
      key: 'protectiveMeasures',
      val: ''
    }, {
      title: '管理措施：',
      key: 'manageMeasures',
      val: ''
    }, {
      title: '应急处置：',
      key: 'emergencyMeasure',
      val: ''
    }, {
      title: '培训教育：',
      key: 'trainingMeasures',
      val: ''
    }
  ],
  checkColumns: [
    {
      title: '审核项目',
      dataIndex: 'val',
      width: '30%'
    },
    {
      title: '是否符合',
      width: '15%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '不符合原因',
      width: '50%',
      scopedSlots: {
        customRender: 'other2'
      }
    }
  ],
  dataSource: [
    {
      key: '1',
      val: '措施的可行性和有效性',
      reason: '',
      checkObject: true
    }, {
      key: '2',
      val: '是否是风险减低到可容许水平',
      reason: '',
      checkObject: true
    }, {
      key: '3',
      val: '是否产生新的危险有害因素',
      reason: '',
      checkObject: true
    }, {
      key: '4',
      val: '是否已选定了最新的解决方案',
      reason: '',
      checkObject: true
    }, {
      key: '5',
      val: '是否会被应用于实际工作中',
      reason: '',
      checkObject: true
    }
  ]
}
export default assess
