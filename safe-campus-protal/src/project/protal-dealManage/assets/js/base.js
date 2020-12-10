const baseData = {
  payStatus: [
    {
      key: '',
      val: '全部'
    },
    {
      key: '0',
      val: '未支付'
    },
    {
      key: '1',
      val: '支付成功'
    },
    {
      key: '2',
      val: '支付失败'
    }
  ],
  dealStatus: [
    {
      key: '',
      val: '全部'
    },
    {
      key: '0',
      val: '未进行'
    },
    {
      key: '1',
      val: '进行中'
    },
    {
      key: '2',
      val: '已完成'
    },
    {
      key: '3',
      val: '已失败'
    },
    {
      key: '4',
      val: '已中断'
    }
  ],
  // 交易状态
  dealType(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 0:
        msg = '未进行'
        break
      case 1:
        msg = '进行中'
        break
      case 2:
        msg = '已完成'
        break
      case 3:
        msg = '已失败'
        break
      case 4:
        msg = '已中断'
        break
      default:
        msg = '其他'
    }
    return msg
  },
  // 支付状态
  payType(type) {
    let msg = ''
    switch (parseInt(type)) {
      case 0:
        msg = '未支付'
        break
      case 2:
        msg = '支付成功'
        break
      case 3:
        msg = '支付失败'
        break
      default:
        msg = '其他'
    }
    return msg
  }
}

export default baseData
