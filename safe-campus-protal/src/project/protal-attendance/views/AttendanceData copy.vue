<template>
  <div class="page-layout qui-fx-ver attend-data">
    <a-tabs v-model="autoKey">
      <a-tab-pane tab="教职工上下班考勤" key="1" forceRender>
        <div id="container" style="height: 340px; margin-top: 20px" v-show="tearcherType !== '1'"></div>
        <div v-show="tearcherType === '1'">
          <div class="attend-card qui-fx-ver" v-for="(teacher, index) in teacherData" :key="index">
            <ul>
              <li class="tip">{{ teacher.title }}</li>
              <li class="total">{{ teacher.total }}</li>
              <li>{{ teacher.tip }}</li>
            </ul>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="学生上下学考勤" key="2" forceRender>
        <div id="container1" style="height: 340px; margin-top: 20px" v-show="studentType !== '1'"></div>
        <div v-show="studentType === '1'">
          <div class="attend-card qui-fx-ver" v-for="(student, index) in studentData" :key="index">
            <ul>
              <li class="tip">{{ student.title }}</li>
              <li class="total">{{ student.total }}</li>
              <li>{{ student.tip }}</li>
            </ul>
          </div>
        </div>
      </a-tab-pane>
      <div slot="tabBarExtraContent">
        <a-radio-group v-show="autoKey === '1'" v-model="tearcherType" buttonStyle="solid">
          <a-radio-button value="1">昨天</a-radio-button>
          <a-radio-button value="7">近7天</a-radio-button>
          <a-radio-button value="30">一个月</a-radio-button>
          <a-radio-button value="0">自定义</a-radio-button>
        </a-radio-group>
        <a-radio-group v-show="autoKey === '2'" v-model="studentType" buttonStyle="solid">
          <a-radio-button value="1">昨天</a-radio-button>
          <a-radio-button value="7">近7天</a-radio-button>
          <a-radio-button value="30">一个月</a-radio-button>
          <a-radio-button value="0">自定义</a-radio-button>
        </a-radio-group>
        <a-range-picker style="margin-left:10px" :disabledDate="disabledEndDate" @change="onChange" v-if="tearcherType === '0' || studentType === '0'"/>
      </div>
    </a-tabs>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'AttendanceData',
  components: {},
  data() {
    return {
      moment,
      autoKey: '1',
      studentType: '1',
      tearcherType: '1',
      pageList: {
        page: 1,
        size: 20
      },
      startDay: this.getDate(new Date().getTime(), '1'),
      endDay: this.getDate(new Date().getTime(), '1'),
      teacherData: [
        {
          title: '正常',
          total: '0',
          tip: ''
        },
        {
          title: '迟到',
          total: '0',
          tip: ''
        },
        {
          title: '上班缺卡',
          total: '0',
          tip: ''
        },
        {
          title: '早退',
          total: '0',
          tip: ''
        },
        {
          title: '下班缺卡',
          total: '0',
          tip: ''
        },
        {
          title: '缺勤',
          total: '0',
          tip: ''
        },
        {
          title: '请假',
          total: '0',
          tip: ''
        }
      ],
      studentData: [
        {
          title: '正常',
          total: '0',
          tip: ''
        },
        {
          title: '迟到',
          total: '0',
          tip: ''
        },
        {
          title: '缺卡',
          total: '0',
          tip: ''
        },
        {
          title: '早退',
          total: '0',
          tip: ''
        },
        {
          title: '缺卡',
          total: '0',
          tip: ''
        },
        {
          title: '缺勤',
          total: '0',
          tip: ''
        },
        {
          title: '请假',
          total: '0',
          tip: ''
        }
      ],
      xDate: [],
      teaDate: [[], [], [], [], [], [], []],
      stuDate: [[], [], [], [], [], [], []],
      normalList: [],
      lateList: [],
      onNoRecordList: [],
      earlyList: [],
      offNoRecordList: [],
      noRecordList: [],
      leaveList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    autoKey: {
      handler (newVal, oldVal) {
        if (this.tearcherType === '1' || this.studentType === '1') {
          this.startDay = this.getDate(new Date().getTime(), '1')
          this.endDay = this.getDate(new Date().getTime(), '1')
        } else if (this.tearcherType === '7' || this.studentType === '7') {
          this.startDay = this.getDate(new Date().getTime(), '2')
          this.endDay = this.getDate(new Date().getTime(), '1')
        } else if (this.tearcherType === '30' || this.studentType === '30') {
          this.startDay = this.getDate(new Date().getTime(), '3')
          this.endDay = this.getDate(new Date().getTime(), '1')
        }
        if (newVal === '1') {
          this.showTeaData()
        } else if (newVal === '2') {
          this.showStuData()
        }
      },
      deep: true
    },
    tearcherType: {
      handler (newVal, oldVal) {
        if (newVal === '7') {
          this.startDay = this.getDate(new Date().getTime(), '2')
          this.endDay = this.getDate(new Date().getTime(), '1')
          this.xDate = []
          this.teaDate = [[], [], [], [], [], [], []]
          this.stuDate = [[], [], [], [], [], [], []]
          for (var i = 0; i < 7; i++) {
            this.xDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i - 1))).format('MM-DD'))
            this.teaDate.forEach(ele => {
              ele.unshift(0)
            })
            this.stuDate.forEach(ele => {
              ele.unshift(0)
            })
          }
        } else if (newVal === '30') {
          this.startDay = this.getDate(new Date().getTime(), '3')
          this.endDay = this.getDate(new Date().getTime(), '1')
          this.xDate = []
          this.teaDate = [[], [], [], [], [], [], []]
          this.stuDate = [[], [], [], [], [], [], []]
          for (var j = 0; j < 30; j++) {
            this.xDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - j - 1))).format('MM-DD'))
            this.teaDate.forEach(ele => {
              ele.unshift(0)
            })
            this.stuDate.forEach(ele => {
              ele.unshift(0)
            })
          }
        } else if (newVal === '1') {
          this.startDay = this.getDate(new Date().getTime(), '1')
          this.endDay = this.getDate(new Date().getTime(), '1')
        }
        if (this.autoKey === '1' && this.tearcherType !== '0' && this.studentType !== '0') {
          this.showTeaData()
          setTimeout(() => {
            this.showBI('container', this.xDate, this.teaDate)
          }, 500)
        } else if (this.autoKey === '2' && this.tearcherType !== '0' && this.studentType !== '0') {
          this.showStuData()
          setTimeout(() => {
            this.showBI('container1', this.xDate, this.stuDate)
          }, 500)
        }
      },
      deep: true
    },
    studentType: {
      handler (newVal, oldVal) {
        if (newVal === '7') {
          this.startDay = this.getDate(new Date().getTime(), '2')
          this.endDay = this.getDate(new Date().getTime(), '1')
          this.xDate = []
          this.teaDate = [[], [], [], [], [], [], []]
          this.stuDate = [[], [], [], [], [], [], []]
          for (var i = 0; i < 7; i++) {
            this.xDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i - 1))).format('MM-DD'))
            this.teaDate.forEach(ele => {
              ele.unshift(0)
            })
            this.stuDate.forEach(ele => {
              ele.unshift(0)
            })
          }
        } else if (newVal === '30') {
          this.startDay = this.getDate(new Date().getTime(), '3')
          this.endDay = this.getDate(new Date().getTime(), '1')
          this.xDate = []
          this.teaDate = [[], [], [], [], [], [], []]
          this.stuDate = [[], [], [], [], [], [], []]
          for (var j = 0; j < 30; j++) {
            this.xDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - j - 1))).format('MM-DD'))
            this.teaDate.forEach(ele => {
              ele.unshift(0)
            })
            this.stuDate.forEach(ele => {
              ele.unshift(0)
            })
          }
        } else if (newVal === '1') {
          this.startDay = this.getDate(new Date().getTime(), '1')
          this.endDay = this.getDate(new Date().getTime(), '1')
        }
        if (this.autoKey === '1' && this.tearcherType !== '0' && this.studentType !== '0') {
          this.showTeaData()
          setTimeout(() => {
            this.showBI('container', this.xDate, this.teaDate)
          }, 500)
        } else if (this.autoKey === '2' && this.tearcherType !== '0' && this.studentType !== '0') {
          this.showStuData()
          setTimeout(() => {
            this.showBI('container1', this.xDate, this.stuDate)
          }, 500)
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.showTeaData()
  },
  methods: {
    ...mapActions('home', [
      'getTeaRecordStatic', 'getStuRecordStatic'
    ]),
    async showTeaData() {
      const req = {
        endDay: this.endDay,
        startDay: this.startDay,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getTeaRecordStatic(req)
      if (res.data.length === 0) {
        return
      }
      if (this.tearcherType === '1') {
        this.teacherData[0].total = res.data[0].normalCount || 0
        this.teacherData[1].total = res.data[0].lateCount || 0
        this.teacherData[2].total = res.data[0].onNoRecordCount || 0
        this.teacherData[3].total = res.data[0].earlyCount || 0
        this.teacherData[4].total = res.data[0].offNoRecordCount || 0
        this.teacherData[5].total = res.data[0].noRecord || 0
        this.teacherData[6].total = res.data[0].leaveCount || 0
      } else {
        res.data.forEach(ele => {
          const day = (new Date(ele.day).getMonth() + 1 > 9 ? new Date(ele.day).getMonth() + 1 : '0' + (new Date(ele.day).getMonth() + 1)) +
      '-' + (new Date(ele.day).getDate() > 9 ? new Date(ele.day).getDate() : '0' + new Date(ele.day).getDate())
          this.xDate.forEach((item, i) => {
            if (item === day) {
              this.teaDate[0][i] = ele.normalCount
              this.teaDate[1][i] = ele.lateCount
              this.teaDate[2][i] = ele.onNoRecordCount
              this.teaDate[3][i] = ele.earlyCount
              this.teaDate[4][i] = ele.offNoRecordCount
              this.teaDate[5][i] = ele.noRecord
              this.teaDate[6][i] = ele.leaveCount
            }
          })
        })
      }
    },
    async showStuData() {
      const req = {
        endDay: this.endDay,
        startDay: this.startDay,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getStuRecordStatic(req)
      if (res.data.length === 0) {
        return
      }
      if (this.studentType === '1') {
        this.studentData[0].total = res.data[0].normalCount || 0
        this.studentData[1].total = res.data[0].lateCount || 0
        this.studentData[2].total = res.data[0].onNoRecordCount || 0
        this.studentData[3].total = res.data[0].earlyCount || 0
        this.studentData[4].total = res.data[0].offNoRecordCount || 0
        this.studentData[5].total = res.data[0].noRecord || 0
        this.studentData[6].total = res.data[0].leaveCount || 0
      } else {
        res.data.forEach(ele => {
          const day = (new Date(ele.day).getMonth() + 1 > 9 ? new Date(ele.day).getMonth() + 1 : '0' + (new Date(ele.day).getMonth() + 1)) +
      '-' + (new Date(ele.day).getDate() > 9 ? new Date(ele.day).getDate() : '0' + new Date(ele.day).getDate())
          this.xDate.forEach((item, i) => {
            if (item === day) {
              this.stuDate[0][i] = ele.normalCount
              this.stuDate[1][i] = ele.lateCount
              this.stuDate[2][i] = ele.onNoRecordCount
              this.stuDate[3][i] = ele.earlyCount
              this.stuDate[4][i] = ele.offNoRecordCount
              this.stuDate[5][i] = ele.noRecord
              this.stuDate[6][i] = ele.leaveCount
            }
          })
        })
      }
    },
    disabledEndDate (current) {
      return current && current > moment().endOf('day')
    },
    /* disabledEndDate (time) {
      const lastMonthTime = new Date().setMonth(new Date().getMonth() - 1)
      return time > Date.now() || time < lastMonthTime
    }, */
    // 时间转换
    getDate(date, type) {
      const day = type === '1' ? 1 : type === '2' ? 7 : 30
      return moment(date - day * 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
    },
    // 获取两个日期之间的每一天
    formatEveryDay(start, end) {
      const dateList = []
      var startTime = this.getNewDate(start)
      var endTime = this.getNewDate(end)
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1
        var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        dateList.push(month + '-' + day)
        startTime.setDate(startTime.getDate() + 1)
      }
      return dateList
    },
    getNewDate(datestr) {
      var temp = datestr.split('-')
      var date = new Date(temp[0], temp[1] - 1, temp[2])
      return date
    },
    onChange(date, dateString) {
      console.log(date, dateString)
      const length = parseInt((moment(date[1]).valueOf() - moment(date[0]).valueOf()) / (1000 * 60 * 60 * 24))
      console.log(length)
      if (length > 31) {
        this.$message.warning('日期区间不能大于1一个月')
        return
      }
      this.xDate = []
      this.teaDate = [[], [], [], [], [], [], []]
      this.stuDate = [[], [], [], [], [], [], []]
      this.startDay = dateString[0]
      this.endDay = dateString[1]
      this.xDate = this.formatEveryDay(dateString[0], dateString[1])
      for (var i = 0; i < (length + 1); i++) {
        this.teaDate.forEach(ele => {
          ele.unshift(0)
        })
        this.stuDate.forEach(ele => {
          ele.unshift(0)
        })
      }
      console.log(this.teaDate)
      if (this.autoKey === '1') {
        this.showTeaData()
        setTimeout(() => {
          this.showBI('container', this.xDate, this.teaDate)
        }, 500)
      } else if (this.autoKey === '2') {
        this.showStuData()
        setTimeout(() => {
          this.showBI('container1', this.xDate, this.stuDate)
        }, 500)
      }
    },
    showBI(id, xDate, yDate) {
      Highcharts.chart(id, {
        title: {
          text: ''
        },
        xAxis: {
          categories: xDate
        },
        yAxis: {
          title: {
            text: '人数'
          },
          labels: {
            formatter: function() {
              return this.value
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1
            }
          }
        },
        credits: {
          enabled: false // 不显示LOGO
        },
        series: [
          {
            name: '正常',
            marker: {
              symbol: 'square'
            },
            data: yDate[0]
          },
          {
            name: '迟到',
            marker: {
              symbol: 'diamond'
            },
            data: yDate[1]
          },
          {
            name: this.autoKey === '1' ? '上班缺卡' : '上学缺卡',
            marker: {
              symbol: 'diamond'
            },
            data: yDate[2]
          },
          {
            name: '早退',
            marker: {
              symbol: 'diamond'
            },
            data: yDate[3]
          },
          {
            name: this.autoKey === '1' ? '下班缺卡' : '放学缺卡',
            marker: {
              symbol: 'diamond'
            },
            data: yDate[4]
          },
          {
            name: '缺勤',
            marker: {
              symbol: 'diamond'
            },
            data: yDate[5]
          },
          {
            name: '请假',
            marker: {
              symbol: 'leave'
            },
            data: yDate[6]
          }
        ]
      })
    }
  }
}
</script>
<style lang="less" scoped>
.attend-data {
  background-color: #fff;
  .title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .attend-card {
    padding: 10px 20px;
    margin-top: 20px;
    width: 22.5%;
    float: left;
    margin-left: 2%;
    height: 120px;
    .tip {
      font-size: 16px;
    }
    .total {
      padding: 10px 0;
      font-size: 24px;
      font-weight: bold;
    }
    &:nth-child(1) {
      background: url('../assets/img/zc.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(2) {
      background: url('../assets/img/cd.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(3) {
      background: url('../assets/img/qk.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(4) {
      background: url('../assets/img/zt.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(5) {
      background: url('../assets/img/qk.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(6) {
      background: url('../assets/img/qk.png') no-repeat center;
      background-size: 100% 100%;
    }
    &:nth-child(7) {
      background: url('../assets/img/qj.png') no-repeat center;
      background-size: 100% 100%;
    }
  }
}
</style>
