// import Tools from '@u/tools'
// 开户表单
export const openActFrom = parmas => {
  return [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      disabled: true,
      required: false
    },
    {
      value: 'studentJobNumber',
      initValue: '',
      type: 'input',
      label: '学工/工号',
      required: false,
      disabled: true

    },
    {
      value: 'classDepartment',
      initValue: '',
      type: 'input',
      label: '班级/部门',
      required: false,
      disabled: true
    },
    {
      value: 'identity',
      initValue: '',
      type: 'input',
      label: '身份',
      required: false,
      disabled: true

    },
    {
      value: 'status',
      initValue: '',
      type: 'input',
      label: '状态',
      required: false,
      disabled: true

    },
    {
      value: 'dailyConsumptionLimit',
      initValue: '',
      type: 'input',
      label: '每日消费限额',
      disabled: false,
      required: false,
      placeholder: '请输入充值金额'
    },
    {
      value: 'singleConsumptionLimit',
      initValue: '',
      type: 'input',
      label: '单次消费限额',
      disabled: false,
      required: false,
      placeholder: '请输入充值金额'
    },
    {
      value: 'offerType',
      initValue: '',
      type: 'radio',
      label: '优惠类型',
      placeholder: '请选择优惠类型',
      list: [
        {
          key: 1,
          val: '无优惠'
        },
        {
          key: 2,
          val: '折扣'
        },
        {
          key: 3,
          val: '减免'
        }
      ]
    },
    {
      value: 'accountBalance',
      initValue: '',
      type: 'input',
      label: '账户余额',
      required: false,
      disabled: true

    },
    {
      value: 'deposit',
      initValue: '',
      type: 'input',
      label: '押金',
      required: false,
      disabled: true
    },
    {
      type: 'text',
      label: '',
      text: '* 请确认核对收到一致的现金金额',
      style: {
        color: 'red'
      }
    }
  ]
}
// 编辑消费表单
export const editConsumpFrom = parmas => {
  return [
    {
      value: 'dailyConsumptionLimit',
      initValue: '',
      type: 'input',
      label: '每日消费限额',
      disabled: false,
      required: false,
      placeholder: '请输每日消费限额'
    },
    {
      value: 'singleConsumptionLimit',
      initValue: '',
      type: 'input',
      label: '单次消费限额',
      disabled: false,
      required: false,
      placeholder: '单次消费限额'
    },
    {
      value: 'offerType',
      initValue: '',
      type: 'radio',
      label: '优惠类型',
      placeholder: '请选择优惠类型',
      list: [
        {
          key: 1,
          val: '无优惠'
        },
        {
          key: 2,
          val: '折扣'
        },
        {
          key: 3,
          val: '减免'
        }
      ]
    }
  ]
}
// 冻结
export const freezeFrom = parmas => {
  return [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      disabled: true,
      required: false
    },
    {
      value: 'studentJobNumber',
      initValue: '',
      type: 'input',
      label: '学工/工号',
      required: false,
      disabled: true

    },
    {
      value: 'classDepartment',
      initValue: '',
      type: 'input',
      label: '班级/部门',
      required: false,
      disabled: true
    },
    {
      value: 'identity',
      initValue: '',
      type: 'input',
      label: '身份',
      required: false,
      disabled: true

    },
    {
      value: 'status',
      initValue: '',
      type: 'input',
      label: '状态',
      required: false,
      disabled: true

    },
    {
      value: 'accountBalance',
      initValue: '',
      type: 'input',
      label: '账户余额',
      required: false,
      disabled: true

    },
    {
      value: 'deposit',
      initValue: '',
      type: 'input',
      label: '押金',
      required: false,
      disabled: true
    },
    {
      value: 'remarks',
      initValue: '',
      type: 'input',
      label: '备注',
      required: false,
      disabled: false
    },
    {
      type: 'text',
      label: '',
      text: '* 冻结后，账户资金将无法使用',
      style: {
        color: 'red'
      }
    }
  ]
}
// 解冻
export const thawForm = parmas => {
  return [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      disabled: true,
      required: false
    },
    {
      value: 'studentJobNumber',
      initValue: '',
      type: 'input',
      label: '学工/工号',
      required: false,
      disabled: true

    },
    {
      value: 'classDepartment',
      initValue: '',
      type: 'input',
      label: '班级/部门',
      required: false,
      disabled: true
    },
    {
      value: 'identity',
      initValue: '',
      type: 'input',
      label: '身份',
      required: false,
      disabled: true

    },
    {
      value: 'status',
      initValue: '',
      type: 'input',
      label: '状态',
      required: false,
      disabled: true

    },
    {
      value: 'accountBalance',
      initValue: '',
      type: 'input',
      label: '账户余额',
      required: false,
      disabled: true,
      style: {
        color: 'red'
      }
    },
    {
      value: 'deposit',
      initValue: '',
      type: 'input',
      label: '押金',
      required: false,
      disabled: true
    }
  ]
}
// 余额清算
export const balanceClearForm = parmas => {
  return [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      disabled: true,
      required: false
    },
    {
      value: 'studentJobNumber',
      initValue: '',
      type: 'input',
      label: '学工/工号',
      required: false,
      disabled: true

    },
    {
      value: 'classDepartment',
      initValue: '',
      type: 'input',
      label: '班级/部门',
      required: false,
      disabled: true
    },
    {
      value: 'identity',
      initValue: '',
      type: 'input',
      label: '身份',
      required: false,
      disabled: true

    },
    {
      value: 'status',
      initValue: '',
      type: 'input',
      label: '状态',
      required: false,
      disabled: true
    },
    {
      value: 'accountBalance',
      initValue: '',
      type: 'input',
      label: '账户余额',
      required: false,
      disabled: true,
      style: {
        color: 'red'
      }
    },
    {
      value: 'deposit',
      initValue: '',
      type: 'input',
      label: '押金',
      required: false,
      disabled: true
    },
    {
      value: 'balanceRefund',
      initValue: '',
      type: 'radio',
      label: '余额退还',
      required: false,
      disabled: true,
      list: [
        {
          key: 1,
          val: '退余额'
        },
        {
          key: 2,
          val: '不退余额'
        }
      ]
    },
    {
      value: 'depositRefund',
      initValue: '',
      type: 'radio',
      label: '押金退还',
      required: false,
      disabled: true,
      list: [
        {
          key: 1,
          val: '退押金'
        },
        {
          key: 2,
          val: '不退押金'
        }
      ]
    },
    {
      value: 'totalRefund',
      initValue: '',
      type: 'input',
      label: '共计退还',
      required: false,
      disabled: true
    },
    {
      value: 'remarks',
      initValue: '',
      type: 'input',
      label: '备注',
      required: false,
      disabled: false
    }
  ]
}
// 销户
export const accountCancellaForm = parmas => {
  return [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      disabled: true,
      required: false
    },
    {
      value: 'studentJobNumber',
      initValue: '',
      type: 'input',
      label: '学工/工号',
      required: false,
      disabled: true

    },
    {
      value: 'classDepartment',
      initValue: '',
      type: 'input',
      label: '班级/部门',
      required: false,
      disabled: true
    },
    {
      value: 'identity',
      initValue: '',
      type: 'input',
      label: '身份',
      required: false,
      disabled: true

    },
    {
      value: 'status',
      initValue: '',
      type: 'input',
      label: '状态',
      required: false,
      disabled: true
    },
    {
      value: 'accountBalance',
      initValue: '',
      type: 'input',
      label: '账户余额',
      required: false,
      disabled: true,
      style: {
        color: 'red'
      }
    },
    {
      value: 'deposit',
      initValue: '',
      type: 'input',
      label: '押金',
      required: false,
      disabled: true
    },
    {
      value: 'remarks',
      initValue: '',
      type: 'input',
      label: '备注',
      required: false,
      disabled: false
    }
  ]
}
// 充值
export const rechargeForm = parmas => {
  return [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      disabled: true,
      required: false
    },
    {
      value: 'studentJobNumber',
      initValue: '',
      type: 'input',
      label: '学工/工号',
      required: false,
      disabled: true

    },
    {
      value: 'classDepartment',
      initValue: '',
      type: 'input',
      label: '班级/部门',
      required: false,
      disabled: true
    },
    {
      value: 'identity',
      initValue: '',
      type: 'input',
      label: '身份',
      required: false,
      disabled: true

    },
    {
      value: 'accountStatus',
      initValue: '',
      type: 'input',
      label: '账户状态',
      required: false,
      disabled: true
    },
    {
      value: 'accountBalance',
      initValue: '',
      type: 'input',
      label: '账户余额',
      required: false,
      disabled: true,
      style: {
        color: 'red'
      }
    },
    {
      value: 'remarks',
      initValue: '',
      type: 'input',
      label: '备注',
      required: false,
      disabled: false
    }
  ]
}
