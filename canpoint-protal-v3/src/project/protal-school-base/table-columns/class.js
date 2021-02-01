import $tools from '@u/libs/tools'
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
    dataIndex: 'joinClassTime',
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

export default columns
