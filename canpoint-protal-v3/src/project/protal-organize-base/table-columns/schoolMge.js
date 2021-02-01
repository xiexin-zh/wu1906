import { getDataState } from '@u/libs/data-state'
import $tools from '@u/libs/tools'

export const tableSchool = [
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
    width: '10%'
  },

  {
    title: '学校编码',
    dataIndex: 'schoolCode',
    width: '10%'
  },
  {
    title: '办学层次',
    dataIndex: 'sectionTypeList',
    width: '10%',
    customRender: text => {
      const str = text.map(el => {
        return getDataState('sectionType', el)
      })
      return str.join(',')
    }
  },
  {
    title: '学校类型',
    dataIndex: 'schoolType',
    width: '10%',
    customRender: text => {
      return getDataState('schoolType', text)
    }
  },
  {
    title: '地区',
    dataIndex: 'area',
    width: '20%'
  },
  {
    title: '详细地址',
    dataIndex: 'detailAddress',
    width: '10%'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export const tableSchoolAdmin = [
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
]
export const tableSchoolPost = [
  {
    title: '部门',
    dataIndex: 'orgName',
    width: '25%'
  },
  {
    title: '主管',
    dataIndex: 'dutyUserName',
    width: '25%'
  },
  {
    title: '成员人数',
    width: '20%',
    dataIndex: 'count'
  }
]
export const tableSchoolStudent = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '12%'
  },
  {
    title: '学号',
    width: '12%',
    dataIndex: 'workNo'
  },
  {
    title: '性别',
    width: '10%',
    dataIndex: 'gender',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '班级',
    width: '12%',
    dataIndex: 'gradeName',
    customRender: (text, record) => {
      return record.gradeName + record.className
    }
  },
  {
    title: '入学年份',
    width: '10%',
    dataIndex: 'admissionYear'
  },
  {
    title: '走住读',
    width: '10%',
    dataIndex: 'hasDorm',
    customRender: text => {
      return getDataState('hasDorm', text)
    }
  },
  {
    title: '照片',
    width: '12%',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export const tableSchoolStudentH = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号',
    width: '10%',
    dataIndex: 'workNo'
  },
  {
    title: '性别',
    width: '8%',
    dataIndex: 'gender',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '年级',
    width: '10%',
    dataIndex: 'gradeName'
  },
  {
    title: '专业',
    width: '10%',
    dataIndex: 'majorName'
  },
  {
    title: '班级',
    width: '10%',
    dataIndex: 'className',
    customRender: (text, record) => {
      return record.gradeName + record.className
    }
  },
  {
    title: '入学年份',
    width: '8%',
    dataIndex: 'admissionYear'
  },
  {
    title: '走住读',
    width: '8%',
    dataIndex: 'hasDorm',
    customRender: text => {
      return getDataState('hasDorm', text)
    }
  },
  {
    title: '照片',
    width: '10%',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export const tableSchoolTeacher = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    width: '10%',
    dataIndex: 'gender',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '手机号',
    width: '10%',
    dataIndex: 'mobile'
  },
  {
    title: '工号',
    width: '10%',
    dataIndex: 'workNo'
  },
  {
    title: '部门',
    width: '10%',
    dataIndex: 'orgName'
  },
  {
    title: '职务',
    width: '10%',
    dataIndex: 'stationNameStr'
  },
  {
    title: '状态',
    width: '10%',
    dataIndex: 'hasJob',
    customRender: text => {
      return getDataState('hasJob', text)
    }
  },
  {
    title: '照片',
    width: '10%',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export const studentTable = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '12%'
  },
  {
    title: '学号',
    width: '12%',
    dataIndex: 'workNo'
  },
  {
    title: '性别',
    width: '10%',
    dataIndex: 'gender',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '入学年份',
    width: '10%',
    dataIndex: 'admissionYear'
  },
  {
    title: '走住读',
    width: '10%',
    dataIndex: 'hasDorm',
    customRender: text => {
      return getDataState('hasDorm', text)
    }
  },
  {
    title: '照片',
    width: '10%',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '加入班级时间',
    width: '10%',
    dataIndex: 'createTime',
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
