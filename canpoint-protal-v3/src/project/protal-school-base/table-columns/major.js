import { getDataState } from '@u/libs/data-state'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '专业',
    dataIndex: 'majorName',
    width: '30%'
  },
  {
    title: '年制',
    dataIndex: 'annualSystem',
    width: '30%',
    customRender: (text) => {
      return getDataState('annualSystem', text)
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
