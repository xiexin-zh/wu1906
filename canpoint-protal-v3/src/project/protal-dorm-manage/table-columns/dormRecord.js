import { getDataState } from '@u/libs/data-state'
export const dormRecordSearchLabel = [
  {
    value: 'keyword',
    type: 'selectInput',
    label: '姓名',
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '学号'
      }
    ],
    placeholder: '请输入'
  }
]
export const dormRecordColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学生姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '10%',
    customRender: text => getDataState('sex', text)
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '15%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '宿舍',
    dataIndex: 'buildingName',
    width: '15%'
  },
  {
    title: '楼层',
    dataIndex: 'floorName',
    width: '10%'
  },
  {
    title: '房间',
    dataIndex: 'roomName',
    width: '10%'
  }
]
