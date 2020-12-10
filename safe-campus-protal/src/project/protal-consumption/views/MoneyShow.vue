<template>
  <div class="line-one pos-box" :id="id"></div>
</template>

<script>
import $tools from '@u/tools'
import Highcharts from 'highcharts/highstock'
export default {
  name: 'MoneyShow',
  props: {
    id: {
      type: String,
      default: 'line-show'
    },
    categories: {
      type: Array,
      default: () => {
        return $tools.getLastDay(30)
      }
    },
    yData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    showTab() {
      setTimeout(() => {
        Highcharts.chart(this.id, this.getBi())
      }, 50)
    },
    getBi() {
      return {
        credits: {
          enabled: false // 禁用版权信息
        },
        title: {
          text: '',
          style: {
            color: '#666'
          }
        },
        yAxis: {
          gridLineColor: '#eee',
          gridLineDashStyle: 'longdash',
          splitLine: {
            show: true
          },
          labels: {
            style: {
              color: '#666'
            }
          },
          title: {
            text: '金额',
            style: {
              color: '#666'
            }
          }
        },
        chart: {
          backgroundColor: null,
          type: 'areaspline'
        },
        plotOptions: {
          areaspline: {
            dataLabels: {
              enabled: true,
              color: '#666',
              allowOverlap: false
            }
          }
        },
        xAxis: {
          labels: {
            style: {
              color: '#666'
            }
          },
          splitLine: {
            show: true
          },
          categories: this.categories,
          crosshair: true
        },
        series: [
          {
            name: '消费金额',
            color: '#8988E2',
            data: this.yData.map(ele => {
              return ele.amountNum
            })
          },
          {
            name: '消费笔数',
            data: this.yData.map(ele => {
              return ele.countNum
            })
          }
        ],
        legend: {
          enabled: false
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: '<small>{point.key}</small><table>',
          pointFormat:
            '<tr><td style="color: {series.color}">{series.name}：</td>' +
            '<td style="text-align: right"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>'
        }
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
