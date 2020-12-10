<template>
  <!-- 2. 柱状图Dom -->
  <div :id="id" ref="chart" style="width:90%;height:100%;"></div>
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
    this.initData(this.data, this.legendData)
  },
  created() {},
  watch: {
    data(val) {
      this.initData(this.data, this.legendData)
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
    initData(data, legendData) {
      // data = [
      //   {
      //     all: 50,
      //     done: 22,
      //     yearMonth: '2020-10'
      //   },
      // ]
      // 对饼状图dom，初始化echarts实例
      const option = {
        color: ['#71A6EEFF', '#40C68EFF', '#BFB1FEFF', '#71CBA6FF'],
        tooltip: {
          trigger: 'axis',
          show: true,
          transitionDuration: 0 // echart防止tooltip的抖动
        },
        legend: {
          right: '20',
          data: this.legendData
        },
        // calculable: true,
        xAxis: [
          {
            axisTick: { show: false },
            axisLine: {
              show: false
            },
            splitLine: { show: false }, // 去除网格线
            textStyle: {
              color: '#999' // 这里用参数代替了
            },
            type: 'category',
            data: data.map(v => v.yearMonth)
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            axisLine: {
              show: false,
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#333333FF']
              }
            },
            splitLine: {
              show: true, // 去除网格线
              lineStyle: {
                type: 'dashed',
                // 使用深浅的间隔色
                color: ['#CCCCCCFF', '#ddd']
              }
            },
            splitArea: { show: false }, // 去除网格背景
            textStyle: {
              color: '#999' // 这里用参数代替了
            }
          }
        ],
        grid: {
          x2: 40
        },
        series: [
          // {
          //   name: '任务完成数',
          //   type: 'bar',
          //   stack: '总量1',
          //   data: data.map(v => v.done),
          //   itemStyle: {
          //   }
          // }
        ]
      }
      option.series = legendData.map((el, index) => {
        return {
          name: el.name,
          type: 'bar',
          barWidth: 50 - legendData.length * 8, // 柱图宽度
          data: data.map(v => v[el.value]),
          itemStyle: {
            normal: {}
          }
        }
      })
      var myChart1 = echarts.init(this.$refs.chart, 'shine')
      myChart1.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped></style>
