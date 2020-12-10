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
    title: '账单号',
    dataIndex: 'billNo',
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
    dataIndex: 'classBoards',
    width: '6%'
  },
  {
    title: '设备号',
    dataIndex: 'sn',
    width: '6%'
  },
  {
    title: '消费金额',
    dataIndex: 'consumeAmount',
    width: '6%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '6%'
  },
  {
    title: '应收金额',
    dataIndex: 'arriveAmount',
    width: '6%'
  },
  {
    title: '消费方式',
    dataIndex: 'consumeType',
    width: '6%',
    customRender: (text) => {
      return text === '1' ? '刷卡' : '刷脸'
    }
  },
  {
    title: '是否联机消费',
    dataIndex: 'isOnline',
    width: '6%',
    customRender: (text) => {
      return text === '1' ? '联机' : '脱机'
    }
  },
  {
    title: '消费时间',
    dataIndex: 'createTime',
    width: '6%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '状态',
    dataIndex: 'consumeStatus',
    width: '6%'
  }/* ,
  {
    title: '操作',
    key: 'action',
    width: '6%',
    scopedSlots: {
      customRender: 'action'
    }
  } */
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
    title: '账单号',
    dataIndex: 'billNo',
    width: '9%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '9%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '9%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '9%'
  },
  {
    title: '充值金额',
    dataIndex: 'rechargeAmount',
    width: '9%'
  },
  {
    title: '赠送金额',
    dataIndex: 'discountAmount',
    width: '9%'
  },
  {
    title: '到账金额',
    dataIndex: 'arriveAmount',
    width: '9%'
  },
  {
    title: '充值方式',
    dataIndex: 'rechargeType',
    width: '9%'
  },
  {
    title: '操作人',
    dataIndex: 'createBy',
    width: '9%'
  },
  {
    title: '充值时间',
    dataIndex: 'createTime',
    width: '9%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '9%'
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
    title: '账单号',
    dataIndex: 'billNo',
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
    dataIndex: 'classBoards',
    width: '8%'
  },
  {
    title: '补助金额',
    dataIndex: 'rechargeAmount',
    width: '8%'
  },
  {
    title: '赠送金额',
    dataIndex: 'discountAmount',
    width: '8%'
  },
  {
    title: '到账金额',
    dataIndex: 'arriveAmount',
    width: '8%'
  },
  {
    title: '操作人',
    dataIndex: 'createBy',
    width: '8%'
  },
  {
    title: '补助时间',
    dataIndex: 'createTime',
    width: '8%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '9%'
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
    width: '10%'
  },
  {
    title: '账单号',
    dataIndex: 'billNo',
    width: '10%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '10%'
  },
  {
    title: '退款金额',
    dataIndex: 'returnAmount',
    width: '10%'
  },
  {
    title: '操作人',
    dataIndex: 'createBy',
    width: '10%'
  },
  {
    title: '退款时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '原消费账单号',
    dataIndex: 'origBillNo',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'returnStatus',
    width: '10%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  }
]
const clearColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '账单号',
    dataIndex: 'billNo',
    width: '10%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '10%'
  },
  {
    title: '退还金额',
    dataIndex: 'returnAmount',
    width: '10%'
  },
  {
    title: '退还押金',
    dataIndex: 'returnDeposit',
    width: '10%'
  },
  {
    title: '清零余额',
    dataIndex: 'clearAmount',
    width: '10%'
  },
  {
    title: '清零押金',
    dataIndex: 'clearDeposit',
    width: '10%'
  },
  {
    title: '操作人',
    dataIndex: 'createBy',
    width: '10%'
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '状态',
    dataIndex: 'clearStatus',
    width: '10%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
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
  dealColumn,
  clearColumns
}
export default columnList
