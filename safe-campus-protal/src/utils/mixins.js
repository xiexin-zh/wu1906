import { mapActions } from 'vuex'
const mixins = {
  data () {
    return {
      bannerTop: 0,
      homeBuildHeight: 300,
      searchForm: {
        size: 20
      },
      tableHeight: 55,
      tableHeight1: 55,
      formatDate: 'YYYY/MM/DD',
      dateTime: [],
      loadTable: true
    }
  },
  mounted() {
    const isMenuTab = JSON.parse(window.localStorage.getItem('pro__DEFAULT_MULTI_TAB')).value
    if (isMenuTab) {
      try {
        this.bannerTop = 10
        this.homeBuildHeight = document.documentElement.clientHeight - 220 - 140
        document.querySelector('.tab-tree').style.height = document.documentElement.clientHeight - 83 - 46 + 'px'
        document.querySelector('.tab-tree').style.marginTop = '10px'
        document.querySelector('.search-form').style.marginTop = '22px'
        this.tableHeight = document.documentElement.clientHeight - 350
        this.tableHeight1 = document.querySelector('#app').offsetHeight - 555
      } catch (e) {}
    } else {
      try {
        this.homeBuildHeight = document.documentElement.clientHeight - 220 - 94
        document.querySelector('.tab-tree').style.height = document.documentElement.clientHeight - 83 + 'px'
        this.tableHeight = document.documentElement.clientHeight - 305
        this.tableHeight1 = document.querySelector('#app').offsetHeight - 510
      } catch (e) {}
    }
    const isDorm = sessionStorage.getItem('isDorm')
    console.log('isDorm', isDorm)
    if (!isDorm) {
      this.getCycleList({
        schoolCode: sessionStorage.getItem('schoolScheme')
      }).then(res => {
        if (!res.data) {
          const req = {
            startTime: '2020-06-01 00:00:00',
            endTime: '2020-06-02 00:00:00',
            schoolCode: sessionStorage.getItem('schoolScheme')
          }
          this.updateStatCycle(req).then(res => {
            this.$message.success('保存成功!')
          })
        }
      })
      this.getWarningSetDetail({ schoolCode: sessionStorage.getItem('schoolScheme') }).then(res => {
        if (!res.data) {
          const req = {
            schoolCode: sessionStorage.getItem('schoolScheme'),
            hasEnable: false,
            warnStartDate: '2020-06-01 22:00:00',
            warnEndDate: '2020-06-02 07:00:00',
            noticer: [],
            hasNextDay: true
          }
          this.updateWarningSet(req).then(res => {
            this.$message.success('预警设置成功!')
          })
        }
      })
      this.getSignTaskInfoList({ schoolCode: sessionStorage.getItem('schoolScheme') }).then(res => {
        if (res.data.length === 0 || !res.data) {
          const req1 = {
            schoolCode: sessionStorage.getItem('schoolScheme'),
            endTime: '1970-01-01 12:00:00',
            schoolName: sessionStorage.getItem('schoolName'),
            startTime: '1970-01-01 09:00:00',
            stat: true,
            taskName: '午休查寝',
            taskType: '1'
          }
          this.updateSignTaskInfo(req1).then(res => {
            this.$message.success('保存成功!')
          })
          const req2 = {
            schoolCode: sessionStorage.getItem('schoolScheme'),
            endTime: '1970-01-01 22:00:00',
            schoolName: sessionStorage.getItem('schoolName'),
            startTime: '1970-01-01 21:00:00',
            stat: true,
            taskName: '午休查寝',
            taskType: '1'
          }
          this.updateSignTaskInfo(req2).then(res => {
            this.$message.success('保存成功!')
          })
        }
      })
      sessionStorage.setItem('isDorm', true)
    }
  },
  methods: {
    ...mapActions('timeSet', ['getCycleList',
      'getWarningSetDetail',
      'getSignTaskInfoList',
      'updateSignTaskInfo',
      'updateWarningSet',
      'updateStatCycle']),
    getSex (val) {
      if (val === '1') {
        return '男'
      } else if (val === '2') {
        return '女'
      } else {
        return '未知'
      }
    },
    // 点击tree查询
    treeSearch(params, title, type) {
      this.downType = type
      this.downTitle = title
      this.searchForm = this.concatObj(this.searchForm, params)
      this.showTableList()
    },
    // 处理查询日期
    formDate() {
      if (this.dateTime.length === 0) {
        this.searchForm.startDate = null
        this.searchForm.endDate = null
        this.searchForm.startTime = null
        this.searchForm.endTime = null
        this.searchForm.beginTime = null
      } else {
        this.searchForm.startDate = this.getDateTime(this.dateTime[0])
        this.searchForm.endDate = this.getDateTime(this.dateTime[1])
        this.searchForm.startTime = this.getDateTime(this.dateTime[0])
        this.searchForm.endTime = this.getDateTime(this.dateTime[1])
        this.searchForm.beginTime = this.getDateTime(this.dateTime[1])
      }
    },
    // 时间戳和gmt转日期
    getDateTime(date, type = 0) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      if (type === 1) {
        return (
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
          '-' +
          (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
          ' ' +
          (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
          ':' +
          (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
          ':' +
          (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
        )
      } else if (type === 2) {
        return (
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
          '-' +
          (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
        )
      } else {
        return (
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
          '-' +
          (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
          ' ' +
          '00:00:00'
        )
      }
    },
    // 分页通用方法
    changeSize(page, size) {
      this.searchForm.size = size
      this.showTableList()
    },
    changePage(page) {
      this.searchForm.page = page
      this.showTableList()
    },
    concatObj: function(jsonbject1, jsonbject2) {
      var resultJsonObject = {}
      for (const attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr]
      }
      for (const attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr]
      }
      return resultJsonObject
    },
    indexMethod: function(index) {
      return (this.searchForm.page - 1) * this.searchForm.size + index + 1
    },
    /**
     * @des 统一设置表格的高度
     */
    getdate: function(timestamp) {
      var now = new Date(timestamp)
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + now.toTimeString().substr(0, 8)
    },
    getCurrentTimeAndOneMonth: function(type) {
      var now = new Date()
      now.setMonth(now.getMonth() - 1)
      var now2 = new Date()
      now2.setMonth(now.getMonth() + 1)
      if (type === 0) {
        return this.getdate(now.getTime())
      } else if (type === 1) {
        return this.getdate(now2.getTime())
      }
    },
    showInfo: function() {
      const event = window.event
      var dh = 280
      var dw = 300
      var screenH = window.screen.height
      var screenW = window.screen.width
      var eh = event.target.offsetHeight
      var cX = event.clientX
      var cY = event.clientY
      var oX = event.offsetX
      var oY = event.offsetY
      this.dialogTag = true
      if (cX + dw > screenW) {
        this.positionXY = {
          x: screenW - dw - oX,
          y: cY + (eh - oY + 10)
        }
        return
      } else if (cY + dh > screenH) {
        this.positionXY = {
          x: cX - oX,
          y: cY - dh - oY - 10
        }
        return
      } else if (cX + dw > screenW && cY + dh > screenH) {
        this.positionXY = {
          x: screenW - dw - oX,
          y: cY - dh - oY - 10
        }
        return
      }
      this.positionXY = {
        x: cX - oX,
        y: cY + (eh - oY + 10)
      }
    },
    /**
     * @des 获取最近5个月日期
     */
    lastFiveMonth(num = 5) {
      var monthArr = []
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if (month > num) {
        for (var i = month - 1; i >= month - num; i--) {
          monthArr.push(year + '-' + (i > 9 ? i : '0' + i))
        }
      } else {
        var lastY = year - 1
        var cMonth = month - 1
        var lastM = num - (month - 1)
        for (let i = cMonth; i > 0; i--) {
          monthArr.push(year + '-' + (i > 9 ? i : '0' + i))
        }
        for (let i = 12; i > 12 - lastM; i--) {
          monthArr.push(lastY + '-' + (i > 9 ? i : '0' + i))
        }
      }
      return monthArr
    }
  }
}

export default mixins
