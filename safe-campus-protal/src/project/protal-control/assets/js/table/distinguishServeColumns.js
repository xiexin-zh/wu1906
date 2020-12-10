const distinguishServeColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  }, {
    title: '交换机名称',
    dataIndex: 'queueName',
    width: '20%'
  },
  {
    title: '队列名称',
    dataIndex: 'exchange',
    width: '20%'
  },
  {
    title: '队列类型',
    dataIndex: 'queueType',
    width: '20%',
    customRender: (text) => {
      if (text === 1) {
        return 'rabbitMQ'
      } else {
        return 'mqtt'
      }
    }
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: '20%'
  },
  {
    title: '操作',
    key: 'action',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default distinguishServeColumns
