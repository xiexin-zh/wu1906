<template>
  <div class="data-view pos-box qui-fx-ver">
    <div class="pos-box qui-fx-ver" style="padding: 0 30px 30px;">
      <div class="data-top qui-fx">
        <div class="qui-fx-f1">
          <dv-decoration-8 :color="borderColor" style="width:100%;height:60px;" />
        </div>
        <div class="qui-fx-f2">
          <div class="pos-box data-title">{{ schoolName }}</div>
          <dv-decoration-5 :color="borderColor" dur="6" style="width:100%;height:60px; color:#ff"></dv-decoration-5>
        </div>
        <div class="qui-fx-f1">
          <div class="pos-box data-time">{{ dateTime }}</div>
          <dv-decoration-8 :color="borderColor" :reverse="true" style="width:100%;height:60px;" />
        </div>
      </div>
      <div class="qui-fx-f1 qui-fx">
        <div class="data-left qui-fx-f1 qui-fx-ver">
          <div class="data-video qui-fx-f1">
            <dv-border-box-9>
              <div class="pos-box qui-fx-ac qui-fx-jc">
                <div class="contrast-photo">
                  <div class="photo">
                    <dv-border-box-8>
                      <img :src="contrastDetail.snapSrc" alt />
                    </dv-border-box-8>
                  </div>
                  <div class="info">
                    <div>地点：{{ contrastDetail.controllerName }}</div>
                    <div>时间：{{ getDateTime(contrastDetail.recordTime, false) }}</div>
                  </div>
                </div>
                <div class="contrast-result qui-fx-ver qui-fx-ac">
                  <dv-decoration-9 class="result">{{ contrastDetail.precent }}&#8451</dv-decoration-9>
                  <dv-decoration-11 class="number">{{ tipMsg }}</dv-decoration-11>
                </div>
                <div class="contrast-photo">
                  <div class="photo">
                    <dv-border-box-8>
                      <img :src="contrastDetail.photoSrc" alt />
                    </dv-border-box-8>
                  </div>
                  <div class="info">
                    <div>姓名：{{ contrastDetail.userName }}</div>
                    <div>卡号：{{ contrastDetail.studentNo }}</div>
                  </div>
                </div>
              </div>
            </dv-border-box-9>
          </div>
          <div class="data-record">
            <dv-border-box-10 :color="borderColor">
              <div
                class="pos-box"
                style="width: 98%; margin-right: 1%; margin-left: 1%; overflow: hidden; white-space: nowrap"
              >
                <div class="contrast-list" v-for="contrast in contrastList" :key="contrast.id">
                  <div class="pic qui-fx">
                    <img :src="contrast.snapSrc" alt />
                    <img class="pic-two" :src="contrast.photoSrc" alt />
                  </div>
                  <div class="info" style>
                    <div class="qui-fx-jsb">
                      <div>姓名: {{ contrast.userName }}</div>
                      <div>地点：{{ contrast.controllerName }}</div>
                    </div>
                    <div>卡号：{{ contrast.studentNo }}</div>
                    <div>时间：{{ getDateTime(contrast.recordTime, false) }}</div>
                  </div>
                </div>
              </div>
            </dv-border-box-10>
          </div>
        </div>
        <div class="data-face">
          <dv-border-box-10 :color="borderColor">
            <div
              class="pos-box box-scroll qui-fx-ver qui-fx-jsa"
              style="height: 97%; margin-top: 3%;"
            >
              <div
                class="bg-show qui-fx"
                :style="{ color: record.color }"
                v-for="(record, index) in recordList"
                :key="index"
              >
                <div class="bg-wh">
                  <img :src="record.img" alt />
                </div>
                <div class="qui-fx-f1">
                  <div class="title">{{ record.title }}</div>
                  <div class="total qui-fx">
                    <div
                      class="total-number"
                      v-for="(num, ind) in record.total.split('')"
                      :key="ind"
                    >
                      <dv-border-box-10 :color="[record.color, record.color]">
                        <span class="number-font">{{ num }}</span>
                      </dv-border-box-10>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
      </div>
    </div>
    <dv-border-box-11 :titleWidth="300" class="qui-fx-f1 qui-fx-ver" :title="schoolName"></dv-border-box-11>
  </div>
</template>

<script>
import zx from '../../images/bg-zx.png'
import dx from '../../images/bg-dx.png'
import lx from '../../images/bg-lx.png'
import logo from '../../images/logo.png'
import p1 from '../../images/1.jpg'
import p11 from '../../images/11.jpeg'
import p2 from '../../images/2.jpg'
import p22 from '../../images/22.jpeg'
import p3 from '../../images/3.jpg'
import p33 from '../../images/33.jpeg'
import p4 from '../../images/4.jpg'
import p44 from '../../images/44.jpeg'
import p5 from '../../images/5.jpg'
import p55 from '../../images/55.jpg'
import $ajax from '@u/ajax-serve'
const wd = ['36.5', '36.6', '36.5', '36.8', '36.4']
const dataList = [
  {
    snapSrc: p11,
    photoSrc: p1,
    controllerName: '门禁',
    recordTime: '2020-04-28 14:40',
    userName: '张坤',
    studentNo: '100001',
    precent: '88'
  },
  {
    snapSrc: p22,
    photoSrc: p2,
    controllerName: '门禁',
    recordTime: '2020-04-28 14:40',
    userName: '宋祥',
    studentNo: '100003',
    precent: '95'
  },
  {
    snapSrc: p33,
    photoSrc: p3,
    controllerName: '门禁',
    recordTime: '2020-04-28 14:40',
    userName: '高鸿志',
    studentNo: '100004',
    precent: '93'
  },
  {
    snapSrc: p44,
    photoSrc: p4,
    controllerName: '门禁',
    recordTime: '2020-04-28 14:40',
    userName: '王选章',
    studentNo: '100001',
    precent: '89'
  },
  {
    snapSrc: p55,
    photoSrc: p5,
    controllerName: '门禁',
    recordTime: '2020-04-28 14:40',
    userName: '李传亮',
    studentNo: '100002',
    precent: '90'
  }
]
export default {
  name: 'Home',
  components: {},
  computed: {},
  data() {
    return {
      schoolName: '武汉全品文教测温识别系统',
      logo,
      tipMsg: '等待识别',
      dateTime: '',
      contrastDetail: {
        snapSrc: '',
        photoSrc: '',
        controllerName: '',
        recordTime: '',
        userName: '',
        studentNo: '',
        precent: ''
      },
      contrastList: [],
      recordList: [
        {
          img: zx,
          title: '实时在校人数',
          total: '0',
          color: '#c2ae29'
        },
        {
          img: dx,
          title: '今日到校人数',
          total: '0',
          color: '#2ec5c0'
        },
        {
          img: lx,
          title: '今日离校人数',
          total: '0',
          color: '#d02629'
        }
      ],
      borderColor: ['#204486', '#00ffff'],
      faceList: []
    }
  },
  directives: {},
  mounted() {
    try {
      const url = window.location.href
      this.schoolCode = url
        .substr(url.indexOf('?'))
        .split('=')[1]
        .replace('#/', '')
    } catch (err) {}

    const nowD = new Date()
    const month = nowD.getMonth() + 1
    this.todayTime = `${nowD.getFullYear()}-${month < 10 ? '0' + month : month}-${
      nowD.getDate() < 10 ? '0' + nowD.getDate() : nowD.getDate()
    }`
    // this.getTotal()
    setInterval(() => {
      this.dateTime = this.getDateTime(new Date().getTime())
    }, 1000)
    setInterval(() => {
      this.test(Math.floor(Math.random() * 5))
    }, 3000)
    setInterval(() => {
      this.getTotal()
    }, 1000 * 60 * 10)
    if (window.WebSocket) {
      if (process.env.NODE_ENV === 'production') {
        this.ws = new WebSocket(`ws:39.97.246.227:10080/showSocket/${this.schoolCode}`)
      } else {
        this.ws = new WebSocket(`ws:192.168.1.123:10090/dorm/showSocket/${this.schoolCode}`)
      }
      this.ws.onopen = () => {}
      this.ws.onclose = () => {}
      this.ws.onerror = () => {}
      this.ws.onmessage = e => {
        const data = JSON.parse(e.data)
        if (parseInt(data.type) === 2) {
          this.tipMsg = '对比成功'
          this.contrastDetail = {
            ...data.data,
            precent: Math.floor(Math.random() * 25) + 75 + '%'
          }
          const id = Math.floor(Math.random() * 100000)
          const res = {
            ...data.data,
            id
          }
          if (this.contrastList.length > 50) {
            this.contrastList.splice(50)
          }
          this.contrastList.unshift(res)
          if (parseInt(data.data.inOrOut) === 1) {
            this.recordList[1].total = parseInt(this.recordList[1].total) + 1 + ''
            const total = this.recordList[1].total - this.recordList[2].total
            this.recordList[0].total = total < 0 ? '0' : total + ''
          } else {
            const outTotal = parseInt(this.recordList[2].total) + 1
            if (outTotal > this.recordList[1].total) return
            this.recordList[2].total = outTotal + ''
            const total = this.recordList[1].total - outTotal
            this.recordList[0].total = total < 0 ? '0' : total + ''
          }
        }
      }
    }
  },
  methods: {
    test(index) {
      this.tipMsg = '识别成功'
      this.contrastDetail = {
        ...dataList[index],
        precent: wd[index],
        recordTime: new Date().getTime()
      }
      const id = Math.floor(Math.random() * 100000)
      const res = {
        ...dataList[index],
        recordTime: new Date().getTime(),
        id
      }
      if (this.contrastList.length > 50) {
        this.contrastList.splice(50)
      }
      this.contrastList.unshift(res)
      this.recordList[1].total = parseInt(this.recordList[1].total) + 1 + ''
      const total = this.recordList[1].total - this.recordList[2].total
      this.recordList[0].total = total < 0 ? '0' : total + ''
    },
    // 获取数据
    getTotal() {
      $ajax
        .post(
          {
            url: `/dorm/show/result/data?schoolCode=${this.schoolCode}&todayTime=${this.todayTime}`
          },
          false
        )
        .then(res => {
          const data = res.data
          this.schoolName = data.schoolName
          this.recordList[0].total = data.totalNum + ''
          this.recordList[1].total = data.inNum + ''
          this.recordList[2].total = data.outNum + ''
        })
    },
    // 获取时间日期
    getDateTime(t, tag = true) {
      if (!t) {
        return ''
      }
      var today = new Date(t)
      var hou = today.getHours() < 0 ? '0' + today.getHours() : today.getHours()
      var getMinutes = today.getMinutes() < 0 ? '0' + today.getMinutes() : today.getMinutes()
      var getSeconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
      if (
        '' + hou + getMinutes + getSeconds === '080000' ||
        '' + hou + getMinutes + getSeconds === '120000' ||
        '' + hou + getMinutes + getSeconds === '180000' ||
        '' + hou + getMinutes + getSeconds === '220000'
      ) {
        window.location.reload()
      }
      var day
      var d = parseInt(today.getDay())
      if (d === 0) {
        day = '日'
      } else if (d === 1) {
        day = '一'
      } else if (d === 2) {
        day = '二'
      } else if (d === 3) {
        day = '三'
      } else if (d === 4) {
        day = '四'
      } else if (d === 5) {
        day = '五'
      } else if (d === 6) {
        day = '六'
      }
      return (
        today.getFullYear() +
        '年' +
        (today.getMonth() + 1) +
        '月' +
        today.getDate() +
        '日 ' +
        hou +
        ':' +
        getMinutes +
        ':' +
        getSeconds +
        ' ' +
        (tag ? ' 星期' + day : '')
      )
    }
  }
}
</script>

<style lang="less" scoped>
.bar::-webkit-scrollbar {
  /*滚动条整体样式*/
  height: 8px;
  border-radius: 20px;
}
.bar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #041e49;
}
.bar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.data-view {
  background-color: #041e49;
}
.box-scroll {
  overflow: hidden;
}
@keyframes moveLeft {
  0% {
    width: 0px;
  }
  100% {
    width: 320px;
  }
}
.data-title {
  font-family: 'myFont';
  z-index: 99;
  top: -16px;
  width: 100%;
  height: 40px;
  color: #87eff8;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 4px;
  text-align: center;
  img {
    width: 4.2rem;
    margin: 0 auto;
    height: auto;
    display: block;
  }
}
.data-time {
  font-family: 'myFont';
  top: -5px;
  z-index: 99;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: 600;
  color: #87eff8;
  text-align: center;
}
.data-top {
  font-family: 'myFont';
  padding-top: 30px;
  height: 120px;
  letter-spacing: 2px;
  background: #041e49;
}
.data-left {
  font-family: 'myFont';
  .data-video {
    margin: 10px 0 20px 0;
  }
  .data-record {
    height: 30vh;
  }
  .contrast-photo {
    .photo {
      border: 6px #204486 solid;
      border-radius: 4px;
      width: 2.6rem;
      height: 2.8rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .info {
      font-size: 14px;
      padding: 0.1rem 0;
      color: #87eff8;
    }
  }
  .contrast-result {
    margin: 0 0.5rem;
    .result {
      width: 1.8rem;
      height: 1.8rem;
      color: #fff;
      font-weight: 600;
      font-size: 24px;
    }
    .number {
      width: 2.4rem;
      height: 0.7rem;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 2px;
      margin-top: 0.4rem;
    }
  }
  .contrast-list {
    padding: 0.1rem;
    width: 320px;
    height: 26vh;
    display: inline-block;
    position: relative;
    background: #06104d;
    animation: moveLeft ease-out 0.3s;
    margin-right: 0.12rem;
    margin-top: 0.2rem;
    border: 4px #204486 solid;
    border-radius: 2px;
    position: relative;
    img {
      width: 140px;
      display: block;
      height: 1.5rem;
    }
    .pic-two {
      margin-left: 0.1rem;
    }
    .info {
      color: #87eff8;
      padding: 0.05rem 0;
      line-height: 0.2rem;
    }
  }
}
.data-face {
  font-family: 'myFont';
  margin: 10px 0 0px 20px;
  width: 5rem;
  .bg-show {
    margin: 0 auto;
    width: 4.06rem;
    height: 1.72rem;
    background: url('../../images/bg-show.png') no-repeat;
    background-size: 100%;
    .bg-wh {
      width: 0.67rem;
      height: 0.61rem;
      margin: 0.3rem 0 0 0.4rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .title {
      letter-spacing: 2px;
      margin: 0.2rem 0 0 0.6rem;
      font-size: 18px;
      font-weight: bold;
    }
    .total {
      margin: 0.15rem 0 0 0.6rem;
    }
    .total-number {
      width: 0.45rem;
      text-align: center;
      line-height: 0.5rem;
      height: 0.5rem;
      font-size: 30px;
      font-weight: bold;
      margin-right: 0.1rem;
    }
    .number-font {
      font-family: 'Digital';
    }
  }
}
</style>
