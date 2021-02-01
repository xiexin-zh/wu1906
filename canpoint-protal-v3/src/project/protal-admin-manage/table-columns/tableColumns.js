import { getDataState } from '@u/libs/data-state'
import $tools from '@u/libs/tools'
const tableColumns = {
  apply: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: '10%'
    },
    {
      title: '应用编码',
      dataIndex: 'appCode',
      width: '8%'
    },
    {
      title: '业务地址',
      dataIndex: 'appBusinessUrl',
      width: '13%'
    },
    {
      title: 'logo',
      dataIndex: 'appLogo',
      width: '10%',
      scopedSlots: {
        customRender: 'photoPic'
      }
    },
    {
      title: '关联学校',
      width: '10%',
      dataIndex: 'relationSchoolNum',
      scopedSlots: {
        customRender: 'slotOne'
      }
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '15%',
      customRender: text => {
        return $tools.getDate(text, 1)
      },
      sorter: (a, b) => a.createTime - b.createTime
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '10%'
    },
    {
      title: '操作',
      width: '17%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  app: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: '10%'
    },
    {
      title: '应用编码',
      dataIndex: 'appCode',
      width: '10%'
    },
    {
      title: '业务地址',
      dataIndex: 'appBusinessUrl',
      width: '15%'
    },
    {
      title: '关联学校',
      width: '10%',
      dataIndex: 'relationSchoolNum',
      scopedSlots: {
        customRender: 'slotOne'
      }
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '15%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '10%'
    },
    {
      title: '操作',
      width: '15%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  applyDetail: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
      width: '30%'
    },
    {
      title: '管理员',
      dataIndex: 'userName',
      width: '30%'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: '30%'
    }
  ],
  school: [
    {
      title: '序号',
      width: '6%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
      width: '12%'
    },
    {
      title: '学校编码',
      width: '12%',
      dataIndex: 'schoolCode'
    },
    {
      title: '办学层次',
      width: '12%',
      dataIndex: 'sectionTypeList',
      customRender: text => {
        const newArr = []
        for (let i = 0; i < text.length; i++) {
          if (text[i] === '1') {
            newArr.push('幼儿园')
          } else if (text[i] === '2') {
            newArr.push('小学')
          } else if (text[i] === '3') {
            newArr.push('初中')
          } else if (text[i] === '4') {
            newArr.push('高中')
          } else if (text[i] === '5') {
            newArr.push('中职')
          } else if (text[i] === '6') {
            newArr.push('高校')
          }
        }
        return newArr.join(',')
      }
    },
    {
      title: '学校类型',
      width: '12%',
      dataIndex: 'schoolType',
      customRender: text => {
        return getDataState('schoolType', text)
      }
    },
    {
      title: '地区',
      width: '15%',
      dataIndex: 'area'
    },
    {
      title: '管理员手机号',
      width: '15%',
      dataIndex: 'mobile'
    },
    {
      title: '移动端二维码',
      width: '12%',
      scopedSlots: {
        customRender: 'slotOne'
      }
    },
    {
      title: '操作',
      width: '15%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  edu: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '机构名称',
      dataIndex: 'schoolName',
      width: '12%'
    },
    {
      title: '机构编码',
      width: '12%',
      dataIndex: 'schoolCode'
    },
    {
      title: '机构级别',
      width: '12%',
      dataIndex: 'level',
      customRender: text => {
        return getDataState('eduLevel', text)
      }
    },
    {
      title: '地区',
      width: '18%',
      dataIndex: 'area'
    },
    {
      title: '地址',
      width: '18%',
      dataIndex: 'detailAddress'
    },
    {
      title: '操作',
      width: '20%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  schDetail: [
    {
      title: '姓名',
      dataIndex: 'userName',
      width: '33%'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: '33%'
    },
    {
      title: '注册日期',
      dataIndex: 'createTime',
      width: '33%',
      customRender: text => {
        return $tools.getDate(text, 1)
      }
    }
  ],
  subSchool: [
    {
      title: '序号',
      width: '6%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
      width: '15%'
    },
    {
      title: '学校编码',
      width: '15%',
      dataIndex: 'schoolCode'
    },
    {
      title: '办学层次',
      width: '15%',
      dataIndex: 'sectionTypeList',
      customRender: text => {
        const newArr = []
        for (let i = 0; i < text.length; i++) {
          if (text[i] === '1') {
            newArr.push('幼儿园')
          } else if (text[i] === '2') {
            newArr.push('小学')
          } else if (text[i] === '3') {
            newArr.push('初中')
          } else if (text[i] === '4') {
            newArr.push('高中')
          } else if (text[i] === '5') {
            newArr.push('中职')
          } else if (text[i] === '6') {
            newArr.push('高校')
          }
        }
        return newArr.join(',')
      }
    },
    {
      title: '学校类型',
      width: '15%',
      dataIndex: 'schoolType',
      customRender: text => {
        return getDataState('schoolType', text)
      }
    },
    {
      title: '地区',
      width: '15%',
      dataIndex: 'area'
    },
    {
      title: '地址',
      width: '15%',
      dataIndex: 'detailAddress'
    }
  ],
  subEdu: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '机构名称',
      dataIndex: 'schoolName',
      width: '18%'
    },
    {
      title: '机构编码',
      width: '18%',
      dataIndex: 'schoolCode'
    },
    {
      title: '机构级别',
      width: '12%',
      dataIndex: 'level',
      customRender: text => {
        return getDataState('eduLevel', text)
      }
    },
    {
      title: '地区',
      width: '20%',
      dataIndex: 'area'
    },
    {
      title: '地址',
      width: '20%',
      dataIndex: 'detailAddress'
    }
  ],
  bindSchool: [
    {
      title: '序号',
      width: '20%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
      width: '40%'
    },
    {
      title: '学校编码',
      width: '40%',
      dataIndex: 'schoolCode'
    }
  ]
}
export default tableColumns
