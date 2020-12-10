<template>
  <div class="home page-layout qui-fx-ver">
    <div>
      <div class="daily-card qui-fx qui-fx-ac"
           v-for="item in baseList"
           :key="item.id">
        <div class="img-box"
             :style="`background:${item.color}`">
          <img :src="item.icon"
               alt />
        </div>
        <div class="qui-fx-f1"
             style="text-align:center;">
          <div class="num">{{ item.num }}</div>
          <div class="tip">{{ item.tip }}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:10px;">
      <a-row :gutter="10">
        <a-col :span="16">
          <chart-component :style="{ height: chartHeight }"
                           :id="heatId"
                           :option="heatOption"></chart-component>
        </a-col>
        <a-col :span="8">
          <a-row>
            <a-col :span="12">
              <chart-component :style="{ height: chartHeight }"
                               :id="highUserPieId"
                               :option="highUserPieOption"></chart-component>
            </a-col>
            <a-col :span="12">
              <chart-component :style="{ height: chartHeight }"
                               :id="middleUserPieId"
                               :option="middleUserPieOption"></chart-component>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div style="margin-top:10px;">
      <a-row :gutter="10">
        <a-col :span="16">
          <chart-component :style="{ height: chartHeight }"
                           :id="unReportId"
                           :option="unReportOption"></chart-component>
        </a-col>
        <a-col :span="8">
          <chart-component :style="{ height: chartHeight }"
                           :id="unHealthyId"
                           :option="unHealthyOption"></chart-component>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Highcharts from 'highcharts/highstock'
import ChartComponent from './component/ChartComponent'
import reportImg from '@a/img/report.gif'
import heatImg from '@a/img/heat.png'
import unhealthyImg from '@a/img/unhealthy.gif'
import unreportImg from '@a/img/unreport.gif'
export default {
  name: 'Home',
  components: {
    ChartComponent
  },
  data () {
    return {
      reportImg,
      baseList: [],
      heatId: 'heatId',
      unReportId: 'unReportId',
      highUserPieId: 'highUserPieId',
      middleUserPieId: 'middleUserPieId',
      unHealthyId: 'unHealthyId',
      heatOption: {},
      unReportOption: {},
      highUserPieOption: {},
      middleUserPieOption: {},
      unHealthyOption: {},
      heatChart: null,
      unReportChart: null,
      highUserPieChart: null,
      middleUserPieChart: null,
      unHealthyChart: null,
      chartHeight: '',
      dailyData: {},
      symptomList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created () {
    this.chartHeight = document.body.clientHeight * 0.35 + 'px'
  },
  mounted () {
    this.showList()
    this.symptomGet()
    this.initHeatChart()
    this.initUnReportChart()
  },
  methods: {
    ...mapActions('home', ['getDailyData', 'getFeverAndHealth', 'getNoReport', 'getSymptomsUser', 'getSymptomList']),
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
      const req = `schoolCode=${this.userInfo.orgCode}&todayTime=${this.getDateTime(new Date())}`
      const res = await this.getDailyData(req)
      this.dailyData = res.result
      this.initHighUserPieChart()
      this.initMiddleUserPieChart()
      this.baseList = [{
        id: 1,
        icon: reportImg,
        num: res.result.reportNum,
        tip: '已上报人数',
        color: '#e6fbea'
      }, {
        id: 2,
        icon: unreportImg,
        num: res.result.noReportNum,
        tip: '未上报人数',
        color: '#e0f3ff'
      }, {
        id: 3,
        icon: unhealthyImg,
        num: res.result.noHealthNum,
        tip: '健康异常人数',
        color: '#f2efff'
      }, {
        id: 4,
        icon: heatImg,
        num: res.result.feverNum,
        tip: '发热人数',
        color: '#ffdedf'
      }]
    },
    async symptomGet () {
      const res = await this.getSymptomList()
      const req = `schoolCode=${this.userInfo.orgCode}&todayTime=${this.getDateTime(new Date())}`
      const result = await this.getSymptomsUser(req)
      const res1 = res.result
      this.symptomList = result.result
      for (var i = 0; i < this.symptomList.length; i++) {
        for (var j = 0; j < res1.length; j++) {
          if (this.symptomList[i].MARK === res1[j].symptomsCode) {
            this.symptomList[i].name = res1[j].symptomsName
            this.symptomList[i].y = this.symptomList[i].count1
            break
          }
        }
      }
      console.log('this.symptomList', this.symptomList)
      this.initUnHealthyChart()
    },
    async initUnHealthyChart () {
      this.unHealthyOption = {
        chart: {
          type: 'column'
        },
        title: {
          text: '返校时间分布'
        },
        xAxis: {
          categories: [
            '03-23', '03-24', '03-25', '03-26', '03-27', '03-28', '03-29', '03-30', '03-31', '04-01'
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          },
          allowDecimals: false
        },
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:1f} 人</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            borderWidth: 0
          }
        },
        series: [{
          name: '人数',
          data: [49, 71, 106, 129, 144, 176, 148, 194, 95, 54]
        }]
      }
      this.unHealthyChart = new Highcharts.Chart(this.unHealthyId, this.unHealthyOption)
    },
    /*
    async initUnHealthyChart() {
      this.unHealthyOption = {
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
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: this.symptomList
          // [{
          //   name: '发热',
          //   y: 61.41,
          //   sliced: true,
          //   selected: true
          // }, {
          //   name: '咳嗽',
          //   y: 11.84
          // }, {
          //   name: '腹泻',
          //   y: 10.85
          // }, {
          //   name: '咽痛',
          //   y: 4.67
          // }, {
          //   name: '乏力',
          //   y: 4.18
          // }, {
          //   name: '鼻塞流涕',
          //   y: 7.05
          // }]
        }]
      }
      this.unHealthyChart = new Highcharts.Chart(this.unHealthyId, this.unHealthyOption)
    },
    */
    async initHeatChart () {
      const req = `schoolCode=${this.userInfo.orgCode}&startTime=${this.getDateTime(
        new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)
      )}&endTime=${this.getDateTime(new Date())}`
      const res = await this.getFeverAndHealth(req)
      const feverData = res.result.feverNum.map(item => {
        return item.num
      })
      const unnormalData = res.result.healthNum.map(item => {
        return item.num
      })
      const feverDate = res.result.feverNum.map(item => {
        return item.reportTime
      })
      this.heatOption = {
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
      }
      this.heatChart = new Highcharts.Chart(this.heatId, this.heatOption)
    },
    async initUnReportChart () {
      const req = `schoolCode=${this.userInfo.orgCode}&startTime=${this.getDateTime(
        new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)
      )}&endTime=${this.getDateTime(new Date())}`
      const res = await this.getNoReport(req)
      console.log('+++++getNoReport', res)
      const data = res.result.map(item => {
        return item.num
      })
      const date = res.result.map(item => {
        return item.reportTime
      })
      this.unReportOption = {
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
      }
      this.unReportChart = new Highcharts.Chart(this.unReportId, this.unReportOption)
    },
    async initHighUserPieChart () {
      this.highUserPieOption = {
        chart: {
          spacing: [40, 0, 40, 0]
        },
        credits: {
          enabled: false
        },
        title: {
          floating: true,
          text: ''
          // text: '健康异常人员分布',
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
        series: [{
          type: 'pie',
          innerSize: '80%',
          name: '市场份额',
          data: [
            ['发热', this.dailyData.healthNum],
            ['未发热', this.dailyData.noFeverNum]
          ]
        }]
      }
      this.highUserPieChart = new Highcharts.Chart(this.highUserPieId, this.highUserPieOption)
    },
    async initMiddleUserPieChart () {
      this.middleUserPieOption = {
        chart: {
          spacing: [40, 0, 40, 0]
        },
        credits: {
          enabled: false
        },
        title: {
          floating: true,
          text: ''
          // text: '健康异常人员分布'
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
        series: [{
          type: 'pie',
          innerSize: '80%',
          name: '市场份额',
          data: [
            ['发热', this.dailyData.healthNum],
            ['未发热', this.dailyData.noFeverNum]
          ]
        }]
      }
      this.middleUserPieChart = new Highcharts.Chart(this.middleUserPieId, this.middleUserPieOption)
    }
  }
}
</script>
<style lang="less" scoped>
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
