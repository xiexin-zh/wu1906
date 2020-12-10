<template>
  <div class="line-one" :id="id"></div>
</template>

<script>
import $tools from '@u/tools'
import Highcharts from 'highcharts/highstock'
export default {
  name: 'LineOne',
  props: {
    id: {
      type: String,
      default: 'line-one-1'
    },
    categories: {
      type: Array,
      default: () => {
        return $tools.getLastDay(15)
      }
    },
    series: {
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
    getBi() {
      return {
        credits: {
          enabled: false // 禁用版权信息
        },
        title: {
          text: '',
          style: {
            color: '#6882da'
          }
        },
        yAxis: {
          gridLineColor: '#0b2a62',
          gridLineDashStyle: 'longdash',
          splitLine: {
            show: true
          },
          labels: {
            style: {
              color: '#6882da'
            }
          },
          title: {
            text: '今日出入校人次',
            style: {
              color: '#6882da'
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
              color: '#6882da',
              allowOverlap: false
            }
          }
        },
        xAxis: {
          labels: {
            style: {
              color: '#6882da'
            }
          },
          splitLine: {
            show: true
          },
          categories: this.categories,
          crosshair: true
        },
        series: this.series,
        legend: {
          align: 'right',
          verticalAlign: 'top',
          borderColor: '#6882da',
          y: 0,
          itemStyle: {
            color: '#6882da'
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
      }
    }
  },
  mounted() {
    setTimeout(() => {
      Highcharts.chart(this.id, this.getBi())
    }, 50)
  }
}
</script>
<style lang="less" scoped></style>
