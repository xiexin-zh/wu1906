import $tools from '@u/libs/tools'
import { getDataState } from '@u/libs/data-state'
export const outInColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '5%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '5%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '5%',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '5%'
  },
  {
    title: '宿舍',
    dataIndex: 'roomName',
    width: '5%'
  },
  {
    title: '记录类型',
    dataIndex: 'recordType',
    width: '8%',
    scopedSlots: {
      customRender: 'slotOne'
    }
    // customRender: text => {
    //   return getDataState('recordType', text)
    // }
  },
  {
    title: '出入类型',
    dataIndex: 'inOrOut',
    width: '8%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
    // customRender: text => {
    //   return getDataState('inOrOut', text)
    // }
  },
  {
    title: '出入时间',
    dataIndex: 'recordTime',
    width: '8%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '底照',
    dataIndex: 'photoUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snapUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
export const invadeColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '5%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '5%'
  },
  {
    title: '入侵地点',
    dataIndex: 'snapSite',
    width: '5%',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '出入类型',
    dataIndex: 'inOrOut',
    width: '8%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '入侵时间',
    dataIndex: 'date',
    width: '8%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snapUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
