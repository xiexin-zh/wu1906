import $tools from '@u/libs/tools'
export const tableStreet = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '街道名称',
    dataIndex: 'streetName',
    width: '15%'
  },
  {
    title: '办公点',
    dataIndex: 'workAddress',
    width: '10%'
  },
  {
    title: '街道负责人',
    dataIndex: 'leaderName',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
