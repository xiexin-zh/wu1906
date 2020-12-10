import Tools from '@u/tools'
const fireColumns = {
  mhqColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'number'
      },
      width: '8%'
    },
    {
      title: '型号',
      width: '12%',
      scopedSlots: {
        customRender: 'other2'
      }
    },
    {
      title: '类型',
      width: '17%',
      scopedSlots: {
        customRender: 'other4'
      }
    },
    {
      title: '有效期',
      width: '15%',
      scopedSlots: {
        customRender: 'other5'
      }
    },
    {
      title: '存放地点',
      width: '15%',
      scopedSlots: {
        customRender: 'other3'
      }
    },
    {
      title: '发布时间',
      width: '15%',
      scopedSlots: {
        customRender: 'totalNum'
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  mhtColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'number'
      },
      width: '15%'
    },
    {
      title: '型号',
      width: '15%',
      scopedSlots: {
        customRender: 'other2'
      }
    },
    {
      title: '有效期',
      width: '18%',
      scopedSlots: {
        customRender: 'other5'
      }
    },
    {
      title: '存放地点',
      width: '15%',
      scopedSlots: {
        customRender: 'other3'
      }
    },
    {
      title: '发布时间',
      width: '18%',
      scopedSlots: {
        customRender: 'totalNum'
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  aqtdColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'number'
      },
      width: '15%'
    },
    {
      title: '所在位置',
      dataIndex: 'address',
      width: '15%'
    },
    {
      title: '是否流畅',
      dataIndex: 'hasFluent',
      width: '15%',
      customRender: text => {
        return text ? '是' : '否'
      }
    },
    {
      title: '有无消防门',
      dataIndex: 'hasFireDoor',
      width: '15%',
      customRender: text => {
        return text ? '有' : '无'
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: '20%',
      customRender: text => {
        return Tools.getDate(text).substring(0, 10)
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  qtColumns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'number'
      },
      width: '12%'
    },
    {
      title: '其他消防设施名称',
      width: '15%',
      scopedSlots: {
        customRender: 'other2'
      }
    },
    {
      title: '数量',
      width: '12%',
      scopedSlots: {
        customRender: 'other4'
      }
    },
    {
      title: '存放地点',
      width: '15%',
      scopedSlots: {
        customRender: 'other3'
      }
    },
    {
      title: '有效期',
      width: '15%',
      scopedSlots: {
        customRender: 'other5'
      }
    },
    {
      title: '发布时间',
      width: '15%',
      scopedSlots: {
        customRender: 'totalNum'
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
}
export default fireColumns
