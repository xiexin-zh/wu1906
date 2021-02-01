import $tools from '@u/libs/tools'
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
    dataIndex: 'visitorName',
    width: '8%'
  },
  {
    title: '手机号',
    width: '8%',
    dataIndex: 'visitorMobile'
  },
  {
    title: '照片',
    width: '8%',
    dataIndex: 'certificatePhoto',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '来访事由',
    width: '8%',
    dataIndex: 'causeName'
  },
  {
    title: '进入时间',
    width: '12%',
    dataIndex: 'accessStartTime',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '进入地点',
    width: '14%',
    dataIndex: 'inPlace'
  },
  {
    title: '被访人',
    width: '8%',
    dataIndex: 'respondentName'
  },
  {
    title: '审批状态',
    width: '8%',
    dataIndex: 'state',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '访问状态',
    width: '8%',
    dataIndex: 'visitState',
    scopedSlots: {
      customRender: 'slotThree'
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

export default columns
