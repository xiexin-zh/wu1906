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
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
