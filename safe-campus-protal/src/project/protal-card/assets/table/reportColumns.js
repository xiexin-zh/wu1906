import Tools from '@u/tools'
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
    dataIndex: 'createTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '消费总次数',
    dataIndex: 'consumerCount',
    width: '20%'
  },
  {
    title: '消费总金额',
    dataIndex: 'cousumerAmonut',
    width: '20%'
  },
  {
    title: '退款总次数',
    dataIndex: 'refundCount',
    width: '10%'
  },
  {
    title: '退款总金额',
    dataIndex: 'refundAmount',
    width: '10%'
  }
]
export default reportColumns
