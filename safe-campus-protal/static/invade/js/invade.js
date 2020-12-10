new Vue({
  el: '#invade',
  data: {
    height: 800,
    dataList: [],
    floorList: [],
    buildingCode: '',
    floorCode: '',
    schoolCode: '',
    maskShow: false,
    isPush: true,
    srcUrl: '',
    currentImg: '',
    level: '',
    people: '',
    site: '',
    date: '',
    userType: '',
    socket: null,
    switch: true,
    timer: null
  },
  filters: {
    getTime: (val, type = 0) => {
      if (val === undefined || val === '' || val === null) return ''
      const d = new Date(val)
      const time =
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
      if (type === 1) {
        return time.substring(0, 10)
      } else if (type === 2) {
        return time.substring(5, 10)
      } else if (type === 3) {
        return time.substring(0, 20)
      } else if (type === 4) {
        return time.substring(10, 20)
      } else {
        return time
      }
    },
    getStatus: val => {
      // 审批状态 0-待审批 1-已同意 2-已拒绝
      if (val === '0' || '') {
        return '陌生人'
      } else if (val === '1') {
        return '黑名单'
      } else if (val === '2') {
        return '学生'
      } else if (val === '3') {
        return '教职工'
      }
    }
  },
  methods: {
    initSocket () {
      // 192.169.2.252
      // 39.97.246.227 慧通云
      // 39.96.168.11 全品
      this.socket = new WebSocket(
        `ws://39.97.246.227:10080/resultSocket/${window.sessionStorage.getItem('schoolScheme')}`
      )
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持WebSocket')
      } else {
        this.socket.onopen = () => {
          console.log('Socket 已打开')
          const req = {
            buildingCode: this.buildingCode,
            floorCode: this.floorCode == '' ? null : this.floorCode
          }
          console.log(req)
          this.socket.send(JSON.stringify(req))
        }
        this.socket.onmessage = msg => {
          clearInterval(this.timer)
          var msgData = msg.data
          var obj = JSON.parse(msgData)
          console.log(obj)
          if (obj.snapSrc) {
            this.dataList.unshift({
              date: obj.invasionTime,
              level: obj.level,
              userType: obj.userType,
              site: this.buildingName,
              snapSrc: obj.snapSrc,
              name: obj.userName
            })
            if (this.dataList.length > 12) {
              this.dataList.length = 12
            }
            this.maskShow = true
            this.currentImg = obj.snapSrc
            this.people = obj.userName
            this.date = obj.invasionTime
            this.site = this.buildingName
            this.userType = obj.userType
            this.getImg(obj.level)
            this.level = obj.level
            this.timer = setTimeout(() => {
              this.maskShow = false
            }, 3000)
          }
        }
        this.socket.onclose = function (ev) {
          console.error('Socket已关闭3')
        }
        this.socket.onerror = function (ev) {
          console.error('Socket发生了错误2')
        }
      }
    },
    // 截取URL信息
    getQueryVariable (variable) {
      const query = window.location.href.split('?')[1]
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return false
    },
    getFloor () {
      $.ajax({
        type: 'post',
        url: `/ljj_dorm/dorm/building/hierarchy/child/node?pCode=${this.buildingCode}&schoolCode=${this.schoolCode}`,
        data: {},
        success: res => {
          // console.log(res.data)
          this.floorList = res.data
        }
      })
    },
    // 楼层选择
    chooseFloor () {
      this.dataList = []
      this.socket.close()
      this.initSocket()
    },
    getImg (status) {
      const badlyImg = 'img/ic_badly_big.png'
      const seriousImg = 'img/ic_serious_big.png'
      const generalImg = 'img/ic_general_big.png'
      // 入侵等级 1-重大 2-严重 3-一般
      if (status === '1') {
        this.srcUrl = badlyImg
      } else if (status === '2') {
        this.srcUrl = seriousImg
      } else if (status === '3') {
        this.srcUrl = generalImg
      }
    },
    setMaskShow () {
      this.maskShow = !this.maskShow
    },
    push () {
      this.isPush = !this.isPush
    }
  },
  created () {
    this.height = window.innerHeight
    window.onresize = function temp () {
      this.height = window.screen.height
      window.location.reload()
    }
    this.initSocket()
    this.buildingCode = this.getQueryVariable('buildingCode')
    this.schoolCode = this.getQueryVariable('schoolCode')
    this.getFloor()
  }
})
