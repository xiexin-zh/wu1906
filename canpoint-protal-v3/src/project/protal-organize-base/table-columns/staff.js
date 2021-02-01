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
    title: '性别',
    dataIndex: 'gender',
    width: '10%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    width: '15%',
    customRender: text => {
      if (text.indexOf(',') === -1) return text
      const arr = text.split(',')
      return arr[arr.length - 2]
    }
  },
  {
    title: '职务',
    dataIndex: 'stationNameStr',
    width: '15%',
    customRender: text => {
      return text || '--'
    }
  },
  {
    title: '状态',
    dataIndex: 'hasJob',
    width: '10%',
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
]

export default columns
