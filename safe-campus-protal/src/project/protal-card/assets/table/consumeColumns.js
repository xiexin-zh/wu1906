import Tools from '@u/tools'
const consumeColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '6%'
  },
  {
    title: '交易号',
    dataIndex: 'oddNumbers',
    width: '6%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '6%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '6%'
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '6%'
  },
  {
    title: '消费方式',
    dataIndex: 'payType',
    width: '6%',
    customRender: (text) => {
      return text === '1' ? '刷脸' : '刷卡'
    }
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '6%'
  },
  {
    title: '设备号',
    dataIndex: 'deviceName',
    width: '6%'
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '6%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '6%'
  },
  {
    title: '实付金额',
    dataIndex: 'actualAmount',
    width: '6%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '6%'
  },
  {
    title: '消费时间',
    dataIndex: 'createTime',
    width: '12%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '12%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const rechargeColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '9%'
  },
  {
    title: '交易号',
    dataIndex: 'oddNumbers',
    width: '9%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '9%'
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '9%'
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '9%'
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '9%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '9%'
  },
  {
    title: '充值金额',
    dataIndex: 'rechargeMoney',
    width: '9%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '9%'
  },
  {
    title: '充值时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  }
]
const subsidyColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '交易号',
    dataIndex: 'oddNumbers',
    width: '8%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '8%'
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '8%'
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '8%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '8%'
  },
  {
    title: '补助金额',
    dataIndex: 'subsidyAmount',
    width: '8%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '8%'
  },
  {
    title: '补助时间',
    dataIndex: 'createTime',
    width: '14%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  }
]
const deducColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '交易号',
    dataIndex: 'oddNumbers',
    width: '8%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '8%'
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '8%'
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '8%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '8%'
  },
  {
    title: '扣款金额',
    dataIndex: 'deductionAmount',
    width: '8%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '8%'
  },
  {
    title: '扣款时间',
    dataIndex: 'createTime',
    width: '14%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '8%'
  }
]
const refundColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '6%'
  },
  {
    title: '交易号',
    dataIndex: 'oddNumbers',
    width: '6%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '6%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '6%'
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '6%'
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '6%'
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '6%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '6%'
  },
  {
    title: '退款金额',
    dataIndex: 'refundAmount',
    width: '6%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '6%'
  },
  {
    title: '退款时间',
    dataIndex: 'createTime',
    width: '12%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '原消费单号',
    dataIndex: 'oldNumbers',
    width: '6%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '12%'
  }
]
const dealColumn = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '6%'
  },
  {
    title: '交易号',
    dataIndex: 'oddNumbers',
    width: '6%'
  },
  {
    title: '交易类型',
    dataIndex: 'status',
    width: '6%'
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '6%'
  },
  {
    title: '设备号',
    dataIndex: 'deviceName',
    width: '6%'
  },
  {
    title: '交易方式',
    dataIndex: 'payType',
    width: '6%',
    customRender: (text) => {
      return text === '1' ? '刷脸' : '刷卡'
    }
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '6%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '6%'
  },
  {
    title: '实付金额',
    dataIndex: 'actualAmount',
    width: '6%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '6%'
  },
  {
    title: '交易时间',
    dataIndex: 'createTime',
    width: '12%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '备注',
    key: 'remark',
    width: '12%'
  }
]

const columnList = {
  consumeColumns,
  rechargeColumns,
  subsidyColumns,
  deducColumns,
  refundColumns,
  dealColumn
}
export default columnList
