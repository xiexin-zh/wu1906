import { getDataState } from '@u/libs/data-state'
const columns = [
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
    dataIndex: 'className'
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
  },
  {
    title: '操作',
    width: '10%',
    align: 'center',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
