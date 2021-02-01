const Mixins = {
  methods: {
    getLastDay (type) {
      let date = ''
      if (type === 0) {
        date = this.gmtToDate(new Date().getTime() - 3600 * 24 * 2000)
      } else if (type === 1) {
        date = this.gmtToDate(new Date().getTime() - 3600 * 24 * 1000)
      } else if (type === 2) {
        date = this.gmtToDate(new Date().getTime())
      }
      return date.substring(0, 10)
    },
    gmtToDate (t) {
      let d = new Date(t)
      return d.getFullYear() + '-' + ((d.getMonth() + 1) > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) + ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) + ':' + (d.getMinutes() > 9 ? d.getMinutes() : '0' +
          d.getMinutes()) +
        ':' + (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
    },
    formatter (type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      } else if (type === 'hour') {
        return `${value}点`
      } else if (type === 'minute') {
        return `${value}分`
      }
      return value
    },
    // 获取最近的3个月
    lastMonth (num = 3) {
      var monthArr = []
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if (month > num) {
        for (var i = month; i > month - num; i--) {
          monthArr.push(year + '-' + (i > 9 ? i : '0' + i))
        }
      } else {
        var lastY = year - 1
        var cMonth = month
        var lastM = num - (month - 1)
        for (let i = cMonth; i > 0; i--) {
          monthArr.push(year + '-' + (i > 9 ? i : '0' + i))
        }
        for (let i = 12; i > 12 - lastM + 1; i--) {
          monthArr.push(lastY + '-' + (i > 9 ? i : '0' + i))
        }
      }
      return monthArr.reverse()
    }
  }
}

export default Mixins
