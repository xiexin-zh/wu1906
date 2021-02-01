<template>
  <div
    ref="chart"
    style="width: 100%; height: 100%"
    :id="id"
  ></div>
</template>
<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
export default {
  name: 'LineSafeOne',
  props: {
    id: {
      type: String,
      default: `${Math.random() * 1000}-bar`
    },
    data: {
      type: Array,
      default: function () {
        return [
          // {
          //   name: '',
          //   value: ''
          // }
        ]
      }
    },
    legendData: {
      type: Array,
      default: function () {
        // ['巡检任务总数','已巡查人数','已巡查任务数']
        return []
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {}
  },
  chartStyle() {
    return {
      height: this.height,
      width: this.width
    }
  },
  mounted() {
    this.Chart = echarts.init(this.$refs.chart)
    this.$nextTick(function () {
      this.initPieData(this.data, this.legendData)
    })
  },
  created() {},
  watch: {
    data: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.chart.setOption(newVal)
          } else {
            this.chart.setOption(oldVal)
          }
        } else {
          this.initPieData(this.data, this.legendData)
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  methods: {
    fomartData(val) {
      const fomartData = JSON.parse(
        JSON.stringify(val)
          .replace(/answer/g, 'name')
          .replace(/count/g, 'value')
      )
      return fomartData
    },
    initPieData(data, legendData, radius) {
      var colorList = [
        'rgba(0, 132, 255, 1)',
        'rgba(245, 177, 17, 1)',
        'rgba(0, 255, 0, 1)',
        '#F5772DFF',
        '#FF5454FF',
        '#FFFFFFFF'
      ]
      var colorList1 = [
        'rgba(0, 132, 255, 0.3)',
        'rgba(245, 177, 17, 0.3)',
        'rgba(0, 255, 0, 0.3)'
      ]
      const option = {
        color: colorList,
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#999'
          },
          left: '6%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: legendData.map((v) => v.name),
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#333'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#666'
            },
            axisLine: {
              lineStyle: {
                 type: 'dashed',
                color: '#666'
              },
              width: 5
            },
            data: data.map((v) => v.yearMonth)
          }
        ],
        yAxis: {
          axisTick: { show: false },
          type: 'value',
          axisLabel: {
            color: '#333'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333'
            },
            width: 5
          },
          splitLine: {
            lineStyle: {
               type: 'dashed',
              color: 'rgba(150, 164, 244, 0.3)'
            }
          }
        },
        series: []
      }
      option.series = legendData.map((el, index) => {
        return {
          name: el.name,
          type: 'line',
          smooth: true,
          lineStyle: {
            normal: {
              color: colorList[index],
              width: 3
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  { offset: 0, color: colorList1[index] },
                  { offset: 0.8, color: 'rgba(137, 189, 27, 0)' }
                ],
                false
              )
            }
          },
          data: data.map((v) => v[el.value])
        }
      })
      // 对饼状图dom，初始化echarts实例
      this.Chart.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize) // 图表自适应
    },
    handleWindowResize() {
      if (!this.chart) return
      this.chart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  }
}
</script>
<style lang="less" scoped>
</style>
