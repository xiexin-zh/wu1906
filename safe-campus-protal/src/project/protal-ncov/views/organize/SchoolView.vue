<template>
  <div class="overview page-layout qui-fx-ver">
    <no-data v-if="schoolList.length === 0" msg="暂无学校~"></no-data>
    <div v-else class="school qui-fx-jsb">
      <a-select
        v-model="defaultSchool"
        style="width: 200px"
        @change="chooseSchool">
        <a-select-option
          v-for="(item,i) in schoolList"
          :key="i"
          :value="item.schoolName">{{ item.schoolName }}</a-select-option>
      </a-select>
      <!-- <div class="info qui-fx-ac">
        <span>确诊：51</span>
        <span>疑似：103</span>
        <span>隔离：512</span>
      </div> -->
    </div>
    <div v-if="!showTag">
      <div
        class="daily-card qui-fx qui-fx-ac"
        v-for="item in baseList"
        :key="item.id">
        <div class="img-box" :style="`background:${item.color}`">
          <img :src="item.icon" alt />
        </div>
        <div class="qui-fx-f1" style="text-align:center;">
          <div class="num">{{ item.num }}</div>
          <div class="tip">{{ item.tip }}</div>
        </div>
      </div>
    </div>
    <div v-if="!showTag" style="margin-top:10px;">
      <a-row :gutter="10">
        <a-col :span="18">
          <div id="heatId" :style="{ height: chartHeight }"></div>
        </a-col>
        <a-col :span="6">
          <div id="userPieId" :style="{ height: chartHeight }"></div>
        </a-col>
      </a-row>
    </div>
    <div v-if="!showTag" style="margin-top:10px;">
      <a-row :gutter="10">
        <a-col :span="18">
          <div id="unReportId" :style="{ height: chartHeight }"></div>
        </a-col>
        <a-col :span="6">
          <div id="unHealthyId" :style="{ height: chartHeight }"></div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import Highcharts from 'highcharts/highstock'
import reportImg from '../../assets/img/report.gif'
import heatImg from '../../assets/img/heat.png'
import unhealthyImg from '../../assets/img/unhealthy.gif'
import unreportImg from '../../assets/img/unreport.gif'
import moment from 'moment'
export default {
  name: 'Overview',
  data () {
    return {
      moment,
      reportImg,
      showTag: false,
      defaultSchool: '',
      schoolList: [],
      baseList: [],
      heatChart: null,
      unReportChart: null,
      userPieChart: null,
      unHealthyChart: null,
      chartHeight: '',
      dailyData: {},
      symptomList: [],
      schoolCode: '',
      feverData: [],
      unnormalData: [],
      reportData: [],
      xDate: []
    }
  },
  components: {
    NoData
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created () {
    this.chartHeight = ((document.body.clientHeight - 310) * 0.5) + 'px'
  },
  async mounted () {
    await this.getSchool()
    this.showList()
    this.symptomGet()
    this.feverAndHealthGet()
    this.noReportGet()
    for (var i = 0; i < 14; i++) {
      this.xDate.unshift(moment(new Date(new Date().setDate(new Date().getDate() - i))).format('YYYY-MM-DD'))
      this.feverData.unshift(0)
      this.unnormalData.unshift(0)
      this.reportData.unshift(0)
    }
  },
  methods: {
    ...mapActions('home', ['getDailyData', 'getSchoolList', 'getFeverAndHealth', 'getNoReport', 'getSymptomsUser', 'getSymptomList']),
    chooseSchool (value) {
      console.log(value)
      this.schoolCode = this.schoolList.filter(item => {
        return item.schoolName === value
      })[0].id
      this.showList()
      this.symptomGet()
      this.feverAndHealthGet()
      this.noReportGet()
    },
    async getSchool () {
      this.schoolList = []
      const res = await this.getSchoolList({
        phone: this.userInfo.phone
      })
      console.log(res.result)
      if (!res.result) {
        this.showTag = true
        return
      }
      this.showTag = false
      if (this.$route.query.schoolCode) {
        this.schoolCode = this.$route.query.schoolCode
        this.defaultSchool = this.$route.query.schoolName
      } else {
        this.defaultSchool = res.result[0].schoolName
        this.schoolCode = res.result[0].schoolCode
      }
      res.result.forEach(ele => {
        this.schoolList.push({
          id: ele.schoolCode,
          schoolName: ele.schoolName
        })
      })
    },
    getDateTime (date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
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
    },
    async showList () {
      const res = await this.getDailyData({
        schoolCode: this.schoolCode,
        todayTime: this.getDateTime(new Date())
      })
      this.dailyData = res.result
      this.initUserPieChart('userPieId', res.result.healthNum, res.result.noFeverNum)
      this.baseList = [
        {
          id: 1,
          icon: reportImg,
          num: res.result.reportNum,
          tip: '已上报人数',
          color: '#e6fbea'
        },
        {
          id: 2,
          icon: unreportImg,
          num: res.result.noReportNum,
          tip: '未上报人数',
          color: '#e0f3ff'
        },
        {
          id: 3,
          icon: unhealthyImg,
          num: res.result.noHealthNum,
          tip: '健康异常人数',
          color: '#f2efff'
        },
        {
          id: 4,
          icon: heatImg,
          num: res.result.feverNum,
          tip: '发热人数',
          color: '#ffdedf'
        }
      ]
    },
    async symptomGet () {
      const res = await this.getSymptomList()
      const result = await this.getSymptomsUser({
        schoolCode: this.userInfo.orgCode,
        todayTime: this.getDateTime(new Date())
      })
      const res1 = res.result
      let res2 = result.result
      for (var i = 0; i < res2.length; i++) {
        if (res2[i].MARK) {
          for (var j = 0; j < res1.length; j++) {
            if (res2[i].MARK === res1[j].symptomsCode) {
              res2[i].name = res1[j].symptomsName
              res2[i].y = res2[i].count1
              break
            }
          }
        } else {
          res2 = []
        }
      }
      this.initUnHealthyChart('unHealthyId', res2)
    },
    async initUnHealthyChart (id, data) {
      Highcharts.chart(id, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '健康异常上报分布'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        colors: ['#ff8d8c', '#9898ff', '#9ddc93', '#69a7fe', '#d68dff', '#60b5ff'],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: 'Brands',
            colorByPoint: true,
            data: data
          }
        ]
      })
    },
    async feverAndHealthGet () {
      const res = await this.getFeverAndHealth({
        schoolCode: this.schoolCode,
        startTime: this.getDateTime(new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)),
        endTime: this.getDateTime(new Date())
      })
      if (res.result.feverNum !== 0 && res.result.feverNum.length !== 0) {
        let i
        res.result.feverNum.forEach(ele => {
          this.xDate.filter((item, index) => {
            if (item === ele.reportTime) {
              i = index
            }
          })
          this.feverData[i] = ele.num
        })
      }
      if (res.result.healthNum !== 0 && res.result.healthNum.length !== 0) {
        let y
        res.result.healthNum.forEach(ele => {
          this.xDate.filter((item, index) => {
            if (item === ele.reportTime) {
              y = index
            }
          })
          this.unnormalData[y] = ele.num
        })
      }
      this.initHeatChart('heatId', this.feverData, this.unnormalData, this.xDate)

      // const feverData = res.result.feverNum.map(item => {
      //   return item.num
      // })
      // const unnormalData = res.result.healthNum.map(item => {
      //   return item.num
      // })
      // const feverDate = res.result.feverNum.map(item => {
      //   return item.reportTime
      // })
      // this.initHeatChart('heatId', feverData, unnormalData, feverDate)
    },
    initHeatChart (id, feverData, unnormalData, feverDate) {
      Highcharts.chart(id, {
        chart: {
          type: 'area'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '发热及健康异常趋势图'
        },
        legend: {
          verticalAlign: 'top',
          margin: 5,
          align: 'right'
        },
        xAxis: {
          allowDecimals: false,
          categories: feverDate
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          allowDecimals: false,
          labels: {
            formatter: function () {
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
            name: '发热次数',
            color: '#ff0000',
            data: feverData
          },
          {
            name: '异常次数',
            color: '#ffac00',
            data: unnormalData
          }
        ]
      })
    },
    async noReportGet () {
      const res = await this.getNoReport({
        schoolCode: this.schoolCode,
        startTime: this.getDateTime(new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)),
        endTime: this.getDateTime(new Date())
      })
      if (!res.result) {
        this.initUnReportChart('unReportId', this.xDate, this.reportData)
        return
      }
      let i
      res.result.forEach(ele => {
        this.xDate.filter((item, index) => {
          if (item === ele.reportTime) {
            i = index
          }
        })
        this.reportData[i] = ele.num
      })
      // const data = res.result.map(item => {
      //   return item.num
      // })
      // const date = res.result.map(item => {
      //   return item.reportTime
      // })
      this.initUnReportChart('unReportId', this.reportData, this.xDate)
    },
    initUnReportChart (id, data, date) {
      Highcharts.chart(id, {
        chart: {
          type: 'area'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '未上报人员统计趋势'
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
            formatter: function () {
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
            name: '数量',
            color: '#0089ff',
            data: data
          }
        ]
      })
    },
    initUserPieChart (id, healthNum, noFeverNum) {
      Highcharts.chart(id, {
        chart: {
          spacing: [40, 0, 40, 0]
        },
        credits: {
          enabled: false
        },
        title: {
          // floating: true,
          text: '健康异常人员分布'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        colors: ['#ff8d8c', '#69a7fe'],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            innerSize: '80%',
            name: '',
            data: [
              ['发热', healthNum],
              ['未发热', noFeverNum]
            ]
          }
        ]
      })
    }
  }
}
</script>
<style lang="less" scoped>
.overview {
  .school {
    margin: 0 0 10px 0;
    background: #fff;
    padding: 10px;
    .info {
      span {
        margin-left: 20px;
        color: #000;
        font-size: 14px;
      }
    }
  }
}
.daily-card {
  padding: 10px 30px;
  width: 23.5%;
  float: left;
  margin-left: 2%;
  height: 80px;
  border-radius: 5px;
  background-color: #fff;
  &:first-of-type {
    margin: 0;
  }
  .img-box {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
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
