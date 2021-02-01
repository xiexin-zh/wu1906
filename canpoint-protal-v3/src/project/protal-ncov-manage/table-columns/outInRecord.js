import $tools from '@u/libs/tools'
import { getDataState } from '@u/libs/data-state'
export const TDailyColums = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '人像',
    dataIndex: 'photoUrl',
    width: '12%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '12%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '12%',
    scopedSlots: {
      customRender: 'slotOne'
    }

  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '12%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '12%'
  },
  {
    title: '最高温度',
    width: '10%',
    dataIndex: 'temperature',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '是否发热',
    dataIndex: 'enableFever',
    width: '10%',
    customRender: text => {
      if (text === null) {
        return '未知'
      } else if (text === false) {
        return '否'
      } else if (text === true) {
        return '是'
      }
    }
  },
  {
    title: '上报次数',
    dataIndex: 'upRecordCount',
    width: '10%'
  }
]
export const SDailyColums = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '人像',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '最高温度',
    width: '10%',
    dataIndex: 'temperature',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '是否发热',
    dataIndex: 'enableFever',
    width: '10%',
    customRender: text => {
      if (text) {
        return '是'
      } else {
        return '否'
      }
    }
  },
  {
    title: '上报次数',
    dataIndex: 'upRecordCount',
    width: '10%'
  }
]
export const ThealthyColums = [
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
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '15%',
    customRender: text => {
      if (text === false) {
        return '未建档'
      } else if (text === true) {
        return '已建档'
      }
    }
  },
  {
    title: '建档时间',
    dataIndex: 'createTime',
    width: '15%',
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
export const ShealthyColums = [
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
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '班级',
    width: '15%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '15%',
    customRender: text => {
      if (text === false) {
        return '未建档'
      } else if (text === true) {
        return '已建档'
      }
    }
  },
  {
    title: '建档时间',
    dataIndex: 'createTime',
    width: '15%',
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
export const personalColumns = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '男'
      } else if (text === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '发热状态',
    width: '8%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '8%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '8%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '16%',
    customRender: text => {
      return $tools.getDate(text)
    }
  }
]
export const TReportColums = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '8%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '发热状态',
    width: '8%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '8%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '8%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snacpUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
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
export const SReportColums = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '班级',
    width: '15%',
    scopedSlots: {
      customRender: 'slotThree'
    }
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '发热状态',
    width: '8%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '8%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '8%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snacpUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
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
export const otherColums = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '发热状态',
    width: '8%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '8%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '8%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snacpUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
