<template>
  <!-- 2. 柱状图Dom -->
  <div :id="id" ref="chart" style="width: 90%; height: 100%"></div>
</template>
<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/toolbox')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
export default {
  name: 'PolylineEcharts',
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    legendData: {
      type: Array,
      default: function() {
        return []
      }
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initPieData(this.data, this.legendData)
  },
  created() {},
  watch: {
    data(val) {
      this.initPieData(this.data, this.legendData)
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
    initPieData(data, legendData) {
      // data = [
      //   {
      //     allTaskCount: 2,
      //     donePersonCount: 3,
      //     doneTaskCount: 2,
      //     yearMonth: '2020-03'
      //   },
      // ]
      // 对饼状图dom，初始化echarts实例
      var myChart1 = echarts.init(this.$refs.chart, 'shine')
      let colorList = ['rgb(245,177,17)','rgb(0,163,95)', 'rgb(0,132,255)', 'rgb(186,186,186)']
      const option = {
        color: colorList,
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          textStyle: {
            color: '#999999FF'
          },
          backgroundColor: 'fff',
          extraCssText: 'box-shadow: 0px 1px 5px 0px rgba(44, 44, 44, 0.16);',
          trigger: 'axis'
        },
        legend: {
          right: '20',
          data: legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          axisTick: { show: false },
          axisLine: {
            show: false
          },
          type: 'category',
          boundaryGap: false,
          data: data.map(v => v.yearMonth)
        },
        yAxis: {
          axisTick: { show: false },
          axisLine: {
            show: false,
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#BABABAFF']
            }
          },
          splitLine: {
            show: true, // 去除网格线
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#ddd']
            }
          },
          type: 'value'
        },
        series: []
      }
      option.series = legendData.map((el, index) => {
        return {
          name: el.name,
          type: 'line',
          symbolSize: 8, // 拐点圆的大小
          smooth: true,
          data: data.map(v => v[el.value]),
          itemStyle: {
            normal: {
              color: el.color, // 转折点
              // 以及在折线图每个日期点顶端显示数字
              // label: {
              //   show: true,
              //   position: 'top',
              //   textStyle: {
              //     color: '#ccc'
              //   }
              // }
            }
          },
          areaStyle: {
            color: colorList[index],
            width: 3,
            type: 'default',
            // 渐变色实现
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1, // 变化度
              // 三种由深及浅的颜色
              [
                {
                  offset: 0,
                  color: el.color
                },
                {
                  offset: 0.5,
                  color: el.middleColor
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ]
            )
          }
        }
      })
      myChart1.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped></style>
