
const reportColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '统计日期',
    dataIndex: 'stateDate',
    width: '10%'
  },
  {
    title: '退款总金额',
    dataIndex: 'returnAmount',
    width: '10%'
  },
  {
    title: '退款总次数',
    dataIndex: 'returnCount',
    width: '10%'
  },
  {
    title: '消费总金额',
    dataIndex: 'consumeAmount',
    width: '10%'
  },
  {
    title: '消费总次数',
    dataIndex: 'consumeCount',
    width: '10%'
  },
  {
    title: '脱机消费次数',
    dataIndex: 'offlineConsumeCount',
    width: '10%'
  }
]
export default reportColumns
