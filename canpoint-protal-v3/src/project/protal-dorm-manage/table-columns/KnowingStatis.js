import $tools from '@u/libs/tools'
import { getDataState } from '@u/libs/data-state'
export const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    slots: { title: 'customTitle' },
    // dataIndex: 'address',
    width: '10%',
    scopedSlots: {
      customRender: 'slotThree'
    }
  },
  {
    title: '日期',
    dataIndex: 'wdate',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '应查寝（人）',
    dataIndex: 'total',
    width: '10%',
    scopedSlots: {
      customRender: 'slotFour'
    }
  },
  {
    title: '出寝（人）',
    // dataIndex: 'outNum',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '未出寝（人）',
    // dataIndex: 'unOutNum',
    width: '10%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  }
]
export const columnsDetail = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    customRender: text => {
     return getDataState('sex', text)
    },
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '宿舍',
    dataIndex: 'buildingName',
    width: '10%'
  },
  {
    title: '底照',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'photoPic'
    },
    width: '15%'
  }
]
export const personColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    customRender: text => {
     return getDataState('sex', text)
    },
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '宿舍',
    dataIndex: 'buildingName',
    width: '10%'
  },
  {
    title: '应查寝（人）',
    dataIndex: 'total',
    width: '10%',
    scopedSlots: {
      customRender: 'slotFour'
    }
  },
  {
    title: '出寝（人）',
    // dataIndex: 'outNum',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '未出寝（人）',
    // dataIndex: 'unOutNum',
    width: '10%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  }
]
