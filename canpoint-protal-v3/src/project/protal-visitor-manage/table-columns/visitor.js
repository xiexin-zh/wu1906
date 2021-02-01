import $tools from '@u/libs/tools'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '访客姓名',
    dataIndex: 'visitorName',
    width: '10%'
  },
  {
    title: '手机号',
    width: '10%',
    dataIndex: 'visitorMobile'
  },
  {
    title: '来访事由',
    width: '10%',
    dataIndex: 'causeName'
  },
  {
    title: '照片',
    width: '10%',
    dataIndex: 'certificatePhoto',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '预约时间',
    width: '20%',
    customRender: (text, record) => {
      return $tools.getDate(record.accessStartTime)
    }
  },
  {
    title: '被访人',
    width: '10',
    dataIndex: 'respondentName'
  },
  {
    title: '被访人手机号',
    width: '10%',
    dataIndex: 'resMobile'
  },
  {
    title: '状态',
    width: '10%',
    dataIndex: 'state',
    scopedSlots: {
      customRender: 'slotOne'
    }
  }
]

export default columns
