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
  },
  {
    title: '操作',
    width: '12%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
