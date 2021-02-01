import $tools from '@u/libs/tools'
export default [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: '15%'
  },
  {
    title: '正文',
    width: '15%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  },
  {
    title: '是否弹出',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '发布时间',
    width: '20%',
    dataIndex: 'createTime',
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
