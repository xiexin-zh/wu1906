import Tools from '@u/tools'
const detail = {
  columns: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '姓名',
      dataIndex: 'parentName',
      width: '15%'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: '20%'
    },
    {
      title: '关系',
      dataIndex: 'relationship',
      width: '10%'
    },
    // {
    //   title: '工作单位',
    //   dataIndex: 'workUnit',
    //   width: '20%'
    // },
    // {
    //   title: '职务',
    //   dataIndex: 'duty',
    //   width: '15%'
    // },
    // {
    //   title: '政治面貌',
    //   dataIndex: 'publicFace',
    //   width: '15%',
    //   customRender: text => {
    //     return Tools.getPoliticsStatus(text)
    //   }
    // },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      width: '15%',
      customRender: text => {
        return Tools.getDate(text, 1)
      }
    },
    {
      slots: { title: 'customTitle' },
      dataIndex: 'hasMainParent',
      width: '20%',
      scopedSlots: {
        customRender: 'other1'
      }
    }
    // {
    //   title: '操作',
    //   width: '15%',
    //   scopedSlots: {
    //     customRender: 'action'
    //   }
    // }
  ],
  changeColumns: [
    {
      title: '序号',
      width: '20%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '异动类型',
      dataIndex: 'type',
      width: '20%',
      customRender: (text, record) => {
        const { inOrOut } = record
        let type = ''
        if (inOrOut === 1 || inOrOut === '1') {
          type = '(转入)'
        } else if (inOrOut === 2 || inOrOut === '2') {
          type = '(转出)'
        }
        switch (parseInt(text)) {
          case 0:
            return `转学${type}`
          case 1:
            return '入学'
          case 2:
            return '移出班级'
          case 3:
            return '加入班级'
          case 4:
            return '休学'
          case 5:
            return '退学'
          case 6:
            return '复学'
          case 7:
            return '升级'
          case 8:
            return '毕业'
          case 9:
            return '转班'
        }
      }
    },
    {
      title: '异动前',
      dataIndex: 'oldClassName',
      width: '20%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '异动后',
      dataIndex: 'newClassName',
      width: '20%',
      scopedSlots: {
        customRender: 'other2'
      }
    },
    {
      title: '异动时间',
      dataIndex: 'createTime',
      width: '20%',
      customRender: text => {
        return text ? Tools.getDate(text) :''
      }
    }
  ],
  dormColumns: [
    {
      title: '序号',
      width: '20%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '调宿类型',
      dataIndex: 'status',
      width: '20%',
      customRender: text => {
        switch (parseInt(text)) {
          case 1:
            return '入住'
          case 2:
            return '退宿'
          case 3:
            return '调宿'
        }
      }
    },
    {
      title: '调宿前',
      dataIndex: 'oldBuildingName',
      width: '20%'
    },
    {
      title: '调宿后',
      dataIndex: 'newBuildingName',
      width: '20%'
    },
    {
      title: '调宿时间',
      dataIndex: 'updateTime',
      width: '20%',
      customRender: text => {
        return Tools.getDate(text)
      }
    }
  ],
  statusList: [
    {
      name: '在读',
      key: '1'
    },
    {
      name: '休学',
      key: '2'
    },
    {
      name: '退学',
      key: '3'
    },
    {
      name: '复学',
      key: '4'
    }
  ],
  jlColumns: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '专业',
      dataIndex: 'gradeName',
      width: '12%'
    },
    {
      title: '班级',
      dataIndex: 'className',
      width: '12%'
    },
    {
      title: '奖励',
      dataIndex: 'awardType',
      width: '10%',
      customRender: (text) => {
        return Tools.getAwardType(text)
      }
    },
    {
      title: '奖金',
      dataIndex: 'awardMoney',
      width: '10%'
    },
    {
      title: '奖励日期',
      dataIndex: 'disposeDate',
      width: '14%',
      customRender: text => {
        return Tools.getDate(text, 1)
      }
    },
    {
      title: '颁奖单位',
      dataIndex: 'disposeUnit',
      width: '10%'
    },
    {
      title: '奖励原因',
      dataIndex: 'disposeReason',
      width: '10%'
    },
    {
      title: '添加人',
      dataIndex: 'createUser',
      width: '10%'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      width: '14%',
      customRender: text => {
        return Tools.getDate(text)
      }
    }
  ],
  cfColumns: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '专业',
      dataIndex: 'gradeName',
      width: '12%'
    },
    {
      title: '班级',
      dataIndex: 'className',
      width: '12%'
    },
    {
      title: '处分',
      dataIndex: 'punishmentType',
      width: '15%',
      customRender: text => {
        return Tools.getPunishmentType(text)
      }
    },
    {
      title: '处分日期',
      dataIndex: 'disposeDate',
      width: '15%',
      customRender: text => {
        return text ? Tools.getDate(text, 1) : ''
      }
    },
    {
      title: '处分原因',
      dataIndex: 'disposeReason',
      width: '20%'
    },
    {
      title: '撤销说明',
      dataIndex: 'cancelReason',
      width: '15%'
    },
    {
      title: '撤销日期',
      dataIndex: 'cancelTime',
      width: '20%',
      customRender: text => {
        return text ? Tools.getDate(text, 5) : ''
      }
    },
    {
      title: '添加人',
      dataIndex: 'createUser',
      width: '10%'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      width: '20%',
      customRender: text => {
        return Tools.getDate(text)
      }
    }
  ],
  cjColumns: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学年',
      dataIndex: 'schoolYearName',
      width: '20%'
    },
    {
      title: '考试名称',
      dataIndex: 'planName',
      width: '20%'
    },
    {
      title: '科目',
      dataIndex: 'subjectName',
      width: '20%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '总分',
      dataIndex: 'allScore',
      width: '10%',
      customRender: text => {
        return `${text}分`
      }
    },
    {
      title: '考试时间',
      dataIndex: 'createTime',
      width: '20%',
      customRender: text => {
        return Tools.getDate(text)
      }
    }
  ],
  pdColumns: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '专业',
      dataIndex: 'gradeName',
      width: '12%'
    },
    {
      title: '班级',
      dataIndex: 'className',
      width: '12%'
    },
    {
      title: '品德等级',
      dataIndex: 'moralityLevel',
      width: '15%'
    },
    {
      title: '品德评语',
      dataIndex: 'moralityComment',
      width: '20%'
    },
    {
      title: '填写人',
      dataIndex: 'writeUser',
      width: '10%'
    },
    {
      title: '填写日期',
      dataIndex: 'writeDate',
      width: '15%',
      customRender: text => {
        return Tools.getDate(text, 1)
      }
    },
    {
      title: '添加人',
      dataIndex: 'createUser',
      width: '10%'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      width: '20%',
      customRender: text => {
        return Tools.getDate(text)
      }
    }
  ],
  formData: [
    {
      value: 'parentName',
      initValue: '',
      type: 'input',
      label: '家长姓名',
      placeholder: '请输入'
    },
    {
      value: 'parentPhone',
      initValue: '',
      type: 'input',
      label: '手机号',
      placeholder: '请输入',
      regular: 'phone'
    },
    {
      value: 'relationship',
      list: [
        {
          key: '爸爸',
          val: '爸爸'
        },
        {
          key: '妈妈',
          val: '妈妈'
        },
        {
          key: '爷爷',
          val: '爷爷'
        },
        {
          key: '奶奶',
          val: '奶奶'
        },
        {
          key: '其他',
          val: '其他'
        }
      ],
      type: 'select',
      label: '关系',
      placeholder: '请选择'
    },
    {
      value: 'workUnit',
      initValue: '',
      type: 'input',
      label: '工作单位',
      placeholder: '请输入',
      required: false
    },
    {
      value: 'duty',
      initValue: '',
      type: 'input',
      label: '职务',
      placeholder: '请输入',
      required: false
    },
    {
      value: 'publicFace',
      list: [
        {
          key: 1,
          val: '党员'
        },
        {
          key: 2,
          val: '团员'
        },
        {
          key: 3,
          val: '群众'
        },
        {
          key: 4,
          val: '其他'
        }
      ],
      type: 'select',
      label: '政治面貌',
      placeholder: '请选择',
      required: false
    }
  ],
  studentMsg: [
    {
      id: '1',
      name: '联系电话',
      text: ''
    },
    {
      id: '2',
      name: '学生来源',
      text: ''
    },
    {
      id: '3',
      name: '招生对象',
      text: ''
    },
    {
      id: '4',
      name: '毕业学校',
      text: ''
    },
    {
      id: '5',
      name: '健康状况',
      text: ''
    },
    {
      id: '6',
      name: '籍贯',
      text: ''
    },
    {
      id: '7',
      name: '民族',
      text: ''
    },
    {
      id: '8',
      name: '政治面貌',
      text: ''
    },
    {
      id: '9',
      name: '户口性质',
      text: ''
    },
    {
      id: '10',
      name: '家长姓名',
      text: ''
    },
    {
      id: '11',
      name: '户口所在地区县以下详细地址',
      text: ''
    },
    {
      id: '12',
      name: '家长手机号',
      text: ''
    },
    {
      id: '13',
      name: '所属派出所',
      text: ''
    },
    {
      id: '14',
      name: '与本人关系',
      text: ''
    },
    {
      id: '15',
      name: '学生居住地类型',
      text: ''
    },
    {
      id: '16',
      name: '是否是监护人',
      text: ''
    },
    {
      id: '17',
      name: '家庭现住址',
      text: ''
    }
  ]
}
export default detail
