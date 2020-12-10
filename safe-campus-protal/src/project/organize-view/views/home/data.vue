<template>
  <div class="home qui-page qui-fx-ver">
    <div class="pos-box qui-fx-ver data-view" style="color: #fff;">
      <div class="top qui-fx-jsa qui-fx-ac" style="padding-top: 50px;">
        <div v-for="(item, index) in topData" :key="index">
          <dv-border-box-12 style="width: 200px; height: 100px;">
            <div class="pos-box top-box qui-fx-ac-jc">
              <h2 class="title">{{ item.title }}</h2>
              <div class="total" style="letter-spacing: 2px; font-wegiht: bold;">{{ item.total }}</div>
            </div>
          </dv-border-box-12>
        </div>
      </div>
      <div class="center qui-fx qui-fx-f1">
        <div class="qui-fx-f1 qui-fx-ver">
          <div style="position: absolute; z-index: 99; width: 100%; height: 40px;">
            <dv-decoration-7
              style="width: 180px; height: 40px; margin: 0 auto; padding: 0 20px;"
            >&nbsp;&nbsp;上报记录&nbsp;&nbsp;</dv-decoration-7>
          </div>
          <dv-border-box-12 style="height: 300px; padding: 40px 15px 10px;">
            <dv-scroll-board :config="tableConfig" style="height: 100%;" />
          </dv-border-box-12>
        </div>
        <div class="qui-fx-ver" style="width: 300px; margin: 0 15px;">
          <div style="position: absolute; z-index: 99; width: 100%; height: 40px;">
            <dv-decoration-7
              style="width: 180px; height: 40px; margin: 0 auto; padding: 0 20px;"
            >&nbsp;&nbsp;上报比率&nbsp;&nbsp;</dv-decoration-7>
          </div>
          <dv-border-box-8 style="height: 300px; width: 300px; margin: 0 auto;">
            <dv-active-ring-chart
              :config="pieConfig"
              style="width: 250px; margin-left: 25px; margin-top: 45px; height: 250px;"
            />
          </dv-border-box-8>
        </div>
        <div class="qui-fx-f1 qui-fx-ver" style="margin: 0 15px;">
          <div style="position: absolute; z-index: 99; width: 100%; height: 40px;">
            <dv-decoration-7
              style="width: 220px; height: 40px; margin: 0 auto; padding: 0 20px;"
            >&nbsp;&nbsp;异常排行 Top5&nbsp;&nbsp;</dv-decoration-7>
          </div>
          <dv-border-box-8 style="height: 300px; padding: 40px 15px 10px;">
            <dv-capsule-chart :config="barConfig" style="height: 100%;" />
          </dv-border-box-8>
        </div>
        <div class="qui-fx-f1 qui-fx-ver">
          <div style="position: absolute; z-index: 99; width: 100%; height: 40px;">
            <dv-decoration-7
              style="width: 180px; height: 40px; margin: 0 auto; padding: 0 20px;"
            >&nbsp;&nbsp;发热排行&nbsp;&nbsp;</dv-decoration-7>
          </div>
          <dv-border-box-12 style="height: 300px; padding: 40px 15px 10px;">
            <dv-scroll-ranking-board :config="sortConfig" />
          </dv-border-box-12>
        </div>
      </div>
      <div class="bottom qui-fx-f1" style="margin: 10px 20px;">
        <div class="pos-box qui-fx">
          <div class="qui-fx-f1" style="padding: 20px;" id="container"></div>
          <dv-decoration-4 style="width: 20px; height: 100%; margin-left: 20px;" />
          <div class="qui-fx-f1" style="padding: 20px;" id="container1"></div>
        </div>
        <dv-border-box-1></dv-border-box-1>
      </div>
      <div class="bottom qui-fx-f1" v-if="false" style="margin: 20px;">
        <div class="pos-box qui-fx-ac qui-fx-jsa">
          <div>
            <dv-water-level-pond :config="config1" style="width: 150px; height: 200px;" />
          </div>
          <div>
            <dv-water-level-pond
              :config="{ ...config1, shape: 'round' }"
              style="width: 150px; height: 200px;"
            />
          </div>
          <div>
            <dv-water-level-pond
              :config="{ ...config1, shape: 'roundRect' }"
              style="width: 150px; height: 200px;"
            />
          </div>
          <div>
            <dv-percent-pond :config="{ value: 60 }" style="width: 200px; height: 100px;" />
          </div>
          <div>
            <dv-decoration-9 style="width: 150px; height: 150px;">66%</dv-decoration-9>
          </div>
        </div>
        <dv-border-box-1></dv-border-box-1>
      </div>
    </div>
    <div class="loading">
      <dv-loading style="color: #fff;" v-if="false">Loading...</dv-loading>
    </div>
    <dv-border-box-11 :titleWidth="400" class="qui-fx-f1 qui-fx-ver" title="武汉全品疫情防控平台"></dv-border-box-11>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
export default {
  name: 'Home',
  components: {},
  computed: {},
  data() {
    return {
      topData: [
        {
          title: '隶属学校',
          total: 10,
          icon: ''
        },
        {
          title: '学生总数',
          total: 20000,
          icon: ''
        },
        {
          title: '教职工总数',
          total: 8000,
          icon: ''
        },
        {
          title: '今日上报',
          total: 18890,
          icon: ''
        },
        {
          title: '今日发热',
          total: 200,
          icon: ''
        },
        {
          title: '今日异常',
          total: 5550,
          icon: ''
        }
      ],
      config1: {
        data: [66, 45]
      },
      pieConfig: {
        data: [
          {
            name: '已报',
            value: 55
          },
          {
            name: '未报',
            value: 55
          },
          {
            name: '发热',
            value: 120
          },
          {
            name: '异常',
            value: 120
          }
        ]
      },
      barConfig: {
        data: [
          {
            name: '宜昌市外国语高中',
            value: 167
          },
          {
            name: '重庆建筑工程职业学院',
            value: 150
          },
          {
            name: '金太阳实验中学',
            value: 140
          },
          {
            name: '长沙理工大学',
            value: 120
          },
          {
            name: '霍林郭勒市第一中学',
            value: 80
          }
        ],
        unit: '人'
      },
      sortConfig: {
        data: [
          {
            name: '宜昌市外国语高中',
            value: 55
          },
          {
            name: '重庆建筑工程职业学院',
            value: 120
          },
          {
            name: '金太阳实验中学',
            value: 78
          },
          {
            name: '长沙理工大学',
            value: 66
          },
          {
            name: '	霍林郭勒市第一中学',
            value: 80
          },
          {
            name: '	荆门市象山中学',
            value: 80
          }
        ],
        unit: '人',
        waitTime: 2500
      },
      tableConfig: {
        header: ['学校', '学生实报 / 应报', '教职工实报 / 应报'],
        data: [
          ['宜昌市外国语高中', '900 / 1000', '400 / 600'],
          ['重庆建筑工程职业学院', '800 / 1200', '320 / 700'],
          ['金太阳实验中学', '1403 / 2000', '454 / 600'],
          ['长沙理工大学', '1600 / 1800', '700 / 800'],
          ['霍林郭勒市第一中学', '1340 / 2000', '600 / 1000'],
          ['荆门市象山中学', '1004 / 1600', '650 / 800'],
          ['武汉市第四十九中学', '1456 / 2000', '980 / 1000'],
          ['武汉全品文教', '650 / 780', '145 / 200']
        ],
        rowNum: 6
      }
    }
  },
  mounted() {
    Highcharts.chart('container1', {
      credits: {
        enabled: false // 禁用版权信息
      },
      title: {
        text: '体温上报趋势',
        style: {
          color: '#fff'
        }
      },
      yAxis: {
        labels: {
          style: {
            color: '#fff'
          }
        },
        title: {
          text: '人数',
          style: {
            color: '#fff'
          }
        }
      },
      chart: {
        backgroundColor: '#000'
      },
      plotOptions: {},
      xAxis: {
        labels: {
          style: {
            color: '#fff'
          }
        },
        splitLine: {
          show: true
        },
        categories: ['0305', '0306', '0307', '0308', '0309', '0310', '0311', '0312'],
        crosshair: true
      },
      series: [
        {
          name: '已上报',
          color: 'rgb(0, 186, 255)',
          data: [1000, 1400, 1500, 1800, 1200, 1000, 900, 1200]
        },
        {
          name: '未上报',
          color: '#fff',
          data: [1000, 600, 300, 200, 800, 100, 1100, 800]
        }
      ],
      legend: {
        borderColor: '#fff',
        itemStyle: {
          color: '#fff'
        }
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }
        ]
      }
    })
    Highcharts.chart('container', {
      credits: {
        enabled: false // 禁用版权信息
      },
      chart: {
        showAxes: true,
        borderColor: '#fff',
        plotBorderColor: '#fff',
        backgroundColor: '#000',
        type: 'column'
      },
      title: {
        text: '体温异常态势',
        style: {
          color: '#fff'
        }
      },
      legend: {
        borderColor: '#fff',
        itemStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        labels: {
          style: {
            color: '#fff'
          }
        },
        splitLine: {
          show: true
        },
        gridLineColor: 'red',
        categories: ['0301', '0302', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0311', '0312'],
        crosshair: true
      },
      yAxis: {
        splitLine: {
          show: true
        },
        min: 0,
        labels: {
          style: {
            color: '#fff'
          }
        },
        title: {
          text: '数量 (人)',
          style: {
            color: '#fff'
          }
        }
      },
      tooltip: {
        // head + 每个 point + footer 拼接成完整的 table
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} 人</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          borderWidth: 2
        }
      },
      series: [
        {
          name: '学生',
          color: 'rgb(0, 186, 255)',
          data: [49, 271, 206, 129, 244, 176, 135, 148, 216, 194, 305]
        },
        {
          name: '教职工',
          color: '#fff',
          data: [83, 178, 98, 193, 106, 184, 105, 104, 191, 183, 106]
        }
      ]
    })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.home {
  .bg1 {
    background-color: steelblue;
  }
  .bg2 {
    background-color: tan;
  }
  .bg3 {
    background-color: thistle;
  }
  background-color: #000;
  color: #fff;
  .data-view {
    .top {
      height: 25vh;
    }
    .top-box {
      .title {
        font-size: 30px;
      }
      .total {
        margin-top: 20px;
        font-size: 50px;
      }
    }
    .center {
      margin: 0 50px;
    }
  }
  .loading {
    position: absolute;
    width: 200px;
    height: 200px;
    margin: -100px 0 0 -100px;
    top: 50%;
    left: 50%;
    z-index: 99;
  }
}
</style>
