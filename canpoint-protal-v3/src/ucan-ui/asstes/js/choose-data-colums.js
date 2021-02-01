import { getDataSet, getDataState } from '@u/libs/data-state'
const classColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '20%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '20%'
  },
  {
    title: '班主任',
    dataIndex: 'teacherName',
    width: '20%'
  },
  {
    title: '场地',
    dataIndex: 'placeName',
    width: '20%'
  }
]
const highClassColumns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '15%'
  },
  {
    title: '专业',
    dataIndex: 'majorName',
    width: '15%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '15%'
  },
  {
    title: '班主任',
    dataIndex: 'teacherName',
    width: '15%'
  },
  {
    title: '场地',
    dataIndex: 'placeName',
    width: '15%'
  }
]
const teacherColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '状态',
    dataIndex: 'hasJob',
    width: '20%',
    customRender: text => getDataState('hasJob', text)
  },
  {
    title: '照片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
const deviceColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '20%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '20%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: text => getDataState('deviceType', text)
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '10%',
    customRender: text => getDataState('inOrOut', text)
  }
]
const doorDeviceColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => getDataState('deviceType', text)
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%',
    align: 'center'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    customRender: text => getDataState('inOrOut', text)
  },
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
const dormColumns = [
  {
    title: '序号',
    width: '25%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '25%'
  },
  {
    title: '绑定场地',
    dataIndex: 'buildingName',
    width: '25%'
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '25%'
  }
]
const studentColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '10%',
    customRender: text => getDataState('sex', text)
  },
  {
    title: '走住读',
    width: '15%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '照片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
const schoolColumns = [
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
    title: '学段',
    dataIndex: 'schoolType',
    width: '10%',
    customRender: text => getDataState('schoolType', text)
  },
  {
    title: '学校编码',
    dataIndex: 'schoolCode',
    width: '10%'
  },
  {
    title: '地区',
    dataIndex: 'area',
    width: '20%'
  },
  {
    title: '详细地址',
    dataIndex: 'detailAddress',
    width: '20%'
  }
]
const teacherSearchLabel = [
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
    list: getDataSet('hasPhoto'),
    value: 'hasPhoto',
    type: 'select',
    label: '是否有人脸'
  },
  {
    list: getDataSet('hasJob'),
    value: 'hasJob',
    type: 'select',
    label: '状态'
  }
]
const deviceSearchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入'
  },
  {
    list: getDataSet('deviceType'),
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
  },
  {
    list: getDataSet('inOrOut'),
    value: 'inOrOut',
    type: 'select',
    label: '控制类型'
  }
]
const studentSearchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入'
  },
  {
    value: 'workNo',
    type: 'input',
    label: '学号',
    placeholder: '请输入'
  },
  {
    list: getDataSet('sex'),
    value: 'gender',
    type: 'select',
    label: '性别'
  },
  {
    list: getDataSet('hasPhoto'),
    value: 'hasPhoto',
    type: 'select',
    label: '是否有人脸'
  },
  {
    list: getDataSet('hasDorm'),
    value: 'hasDorm',
    type: 'select',
    label: '走住读类型'
  }
]
const schoolLabel = [
  {
    value: 'schoolName',
    type: 'input',
    label: '学校名称',
    placeholder: '请输入'
  },
  {
    list: getDataSet('sectionType'),
    value: 'sectionType',
    type: 'select',
    label: '学段'
  },
  {
    value: 'areaList',
    type: 'area',
    label: '地区'
  }
]
export default {
  classColumns,
  highClassColumns,
  teacherColumns,
  deviceColumns,
  doorDeviceColumns,
  dormColumns,
  studentColumns,
  teacherSearchLabel,
  deviceSearchLabel,
  studentSearchLabel,
  schoolLabel,
  schoolColumns
}
