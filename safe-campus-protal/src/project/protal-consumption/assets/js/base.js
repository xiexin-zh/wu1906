const baseData = {
  cardStatus: [
    {
      key: '',
      val: '全部'
    },
    {
      key: '0',
      val: '未发卡'
    },
    {
      key: '1',
      val: '已发卡'
    },
    {
      key: '2',
      val: '已挂失'
    },
    {
      key: '3',
      val: '已退卡'
    }
  ],
  cardType: [
    {
      key: '',
      val: '全部'
    },
    {
      key: '1',
      val: '学生卡'
    },
    {
      key: '2',
      val: '教职工卡'
    }
  ],
  daelType: [
    {
      key: '',
      val: '全部'
    },
    {
      key: '1',
      val: '消费'
    },
    {
      key: '2',
      val: '充值'
    },
    {
      key: '3',
      val: '补助'
    },
    {
      key: '4',
      val: '扣款'
    },
    {
      key: '5',
      val: '退款'
    }
  ],
  // 用户类型
  userType(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 1:
        msg = '学生'
        break
      case 2:
        msg = '教职工'
        break
      default:
        msg = '其他'
    }
    return msg
  },
  // 账户状态
  actionType(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 1:
        msg = '开户'
        break
      case 2:
        msg = '冻结'
        break
      case 3:
        msg = '解冻'
        break
      case 4:
        msg = '销户'
        break
      default:
        msg = '其他'
    }
    return msg
  },
  // 获取账户状态
  getAccountType(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 0:
        msg = '未开户'
        break
      case 1:
        msg = '已开户'
        break
      case 2:
        msg = '已冻结'
        break
      case 3:
        msg = '已销户'
        break
      default:
        msg = '其他'
    }
    return msg
  },
  // 卡状态
  getCardStatus(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 0:
        msg = '未发卡'
        break
      case 1:
        msg = '已发卡'
        break
      case 2:
        msg = '已挂失'
        break
      case 3:
        msg = '已退卡'
        break
      default:
        msg = '其他'
    }
    return msg
  },
  // 卡操作类型
  getCardActionType(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 1:
        msg = '发卡'
        break
      case 2:
        msg = '挂失'
        break
      case 3:
        msg = '解挂'
        break
      case 4:
        msg = '退卡'
        break
      case 5:
        msg = '换卡'
        break
      default:
        msg = '其他'
    }
    return msg
  }
}

export default baseData
