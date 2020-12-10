<template>
  <div class="home page-layout qui-fx-ver">
    <div class="search-form mar-t10" v-if="tempList.length !== 0">
      <span class="mar-r10 mar-l10">测温计划:</span>
      <a-radio-group @change="typeChange" button-style="solid" :value="timeType">
        <a-radio-button v-for="list in tempList" :key="list.planCode" :value="`${list.startTime}+${list.endTime}`">
          {{ list.planName }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <div>
      <div class="daily-card qui-fx-ac qui-fx-jc" v-for="item in baseList" :key="item.id">
        <div class="img-box" :style="`background:${item.color}`">
          <img :src="item.icon" alt />
        </div>
        <div style="text-align:center;">
          <div class="num">{{ item.num }}</div>
          <div class="tip">{{ item.tip }}</div>
        </div>
      </div>
    </div>
    <div>
      <div id="heatId" :style="{ height: chartHeight }"></div>
    </div>
    <div>
      <div id="unReportId" :style="{ height: chartHeight }"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Highcharts from 'highcharts/highstock'
import reportImg from '../assets/img/report.gif'
import heatImg from '../assets/img/heat.png'
import unreportImg from '../assets/img/unreport.gif'
import moment from 'moment'
export default {
  name: 'Home',
  data() {
    return {
      form: this.$form.createForm(this),
      moment,
      reportImg,
      baseList: [],
      chartHeight: '',
      dailyData: {},
      feverData: [],
      unnormalData: [],
      reportData: [],
      xDate: [],
      xReportDate: [],
      tempList: [],
      timeType: '1',
      thermometryDate: this.$tools.getDate(new Date(), 1),
      searchList: {
        date: moment(moment(new Date())).format('YYYY-MM-DD'),
        schoolCode: ''
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.chartHeight = document.body.clientHeight * 0.38 + 'px'
  },
  mounted() {
    this.searchList.schoolCode = this.userInfo.schoolCode
    this.feverAndHealthGet()
    this.noReportGet()
    for (var i = 0; i < 14; i++) {
      this.xDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i))).format('YYYY-MM-DD'))
      this.xReportDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i))).format('YYYY-MM-DD'))
      this.feverData.unshift(0)
      this.unnormalData.unshift(0)
      this.reportData.unshift(0)
    }
    this.planListGet()
  },
  methods: {
    ...mapActions('home', [
      'getDailyData',
      'getFeverAndHealth',
      'getNoReport',
      'getSymptomsUser',
      'getSymptomList',
      'getqueryList'
    ]),
    async planListGet() {
      const res = await this.getqueryList({
        schoolCode: this.userInfo.schoolCode,
        thermometryDate: this.thermometryDate
      })
      this.tempList = res.data
      this.timeType = `${res.data[0].startTime}+${res.data[0].endTime}`
      this.searchList.startTime = this.$tools.getDate(res.data[0].startTime, 2)
      this.searchList.endTime = this.$tools.getDate(res.data[0].endTime, 2)
      this.showList()
    },
    async showList() {
      this.searchList = Object.assign(this.searchList)
      const res = await this.getDailyData(this.searchList)
      this.dailyData = res.data
      this.baseList = [
        {
          id: 1,
          icon: reportImg,
          num: res.data.upRecordCount,
          tip: '已上报人数',
          color: '#e6fbea'
        },
        {
          id: 2,
          icon: unreportImg,
          num: res.data.noRecordCount,
          tip: '未上报人数',
          color: '#e0f3ff'
        },
        {
          id: 3,
          icon: heatImg,
          num: res.data.feverCount,
          tip: '发热人数',
          color: '#ffdedf'
        }
      ]
    },
    typeChange(e) {
      this.timeType = e.target.value
      const time = e.target.value.split('+')
      this.searchList.startTime = this.$tools.getDate(Number(time[0]), 2)
      this.searchList.endTime = this.$tools.getDate(Number(time[1]), 2)
      this.showList()
    },
    async feverAndHealthGet() {
      const res = await this.getFeverAndHealth({
        schoolCode: this.userInfo.schoolCode,
        startDate: this.getDateTime(new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)),
        endDate: this.getDateTime(new Date())
      })
      if (res.data) {
        let i
        res.data.forEach(ele => {
          this.xDate.filter((item, index) => {
            if (item === moment(ele.date).format('YYYY-MM-DD')) {
              i = index
            }
          })
          this.feverData[i] = ele.count
        })
      }
      this.initHeatChart('heatId', this.feverData, this.xDate)
    },
    initHeatChart(id, feverData, xDate) {
      Highcharts.chart(id, {
        chart: {
          type: 'area'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '发热人员态势图'
        },
        legend: {
          verticalAlign: 'top',
          margin: 5,
          align: 'right'
        },
        xAxis: {
          allowDecimals: false,
          categories: xDate
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          allowDecimals: false,
          labels: {
            formatter: function() {
              return this.value
            }
          }
        },
        tooltip: {
          pointFormat: '{series.name} <b>{point.y:,.0f}</b>人'
        },
        plotOptions: {
          area: {
            pointStart: 0,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true
                }
              }
            }
          }
        },
        series: [
          {
            name: '发热人数',
            color: '#ff0000',
            data: feverData
          }
        ]
      })
    },
    async noReportGet() {
      const res = await this.getNoReport({
        schoolCode: this.userInfo.schoolCode,
        startDate: this.getDateTime(new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)),
        endDate: this.getDateTime(new Date())
      })
      if (!res.data) {
        this.initUnReportChart('unReportId', this.xReportDate, this.reportData)
        return
      }
      if (res.data) {
        let i
        res.data.forEach(ele => {
          this.xReportDate.filter((item, index) => {
            if (item === moment(ele.date).format('YYYY-MM-DD')) {
              i = index
            }
          })
          this.reportData[i] = ele.count
        })
      }
      this.initUnReportChart('unReportId', this.xReportDate, this.reportData)
    },
    initUnReportChart(id, date, data) {
      Highcharts.chart(id, {
        chart: {
          type: 'area'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '未上报人员态势图'
        },
        legend: {
          verticalAlign: 'top',
          margin: 5,
          align: 'right'
        },
        xAxis: {
          allowDecimals: false,
          categories: date
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          allowDecimals: false,
          labels: {
            formatter: function() {
              return this.value
            }
          }
        },
        tooltip: {
          pointFormat: '{series.name} <b>{point.y:,.0f}</b>人'
        },
        plotOptions: {
          area: {
            pointStart: 0,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true
                }
              }
            }
          }
        },
        series: [
          {
            name: '未上报人数',
            color: '#0089ff',
            data: data
          }
        ]
      })
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
      )
    }
  }
}
</script>
<style lang="less" scoped>
.daily-card {
  padding: 10px 30px;
  width: 30.9%;
  float: left;
  margin-left: 2%;
  height: 100px;
  border-radius: 5px;
  background-color: @bor-color;
  margin-top: 10px;
  .img-box {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    margin-right: 50px;
  }
  .num {
    font-size: 24px;
    font-weight: bold;
  }
  .tip {
    font-size: 16px;
  }
}
</style>
