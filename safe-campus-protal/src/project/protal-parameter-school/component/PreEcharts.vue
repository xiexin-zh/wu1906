<template>
  <!-- 2. 柱状图Dom -->
  <div :id="id" ref="chart" style="width:100%;height:100%;"></div>
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
  name: 'PreEcharts',
  props: {
    data: {
      type: Array,
      default: function() {
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
      default: function() {
        // ['巡检任务总数','已巡查人数','已巡查任务数']
        return []
      }
    },
    id: {
      type: String,
      required: true
    },
    radius: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initPieData(this.data, this.legendData, this.radius)
  },
  created() {},
  watch: {
    data(val) {
      this.initPieData(this.data, this.legendData, this.radius)
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
      // 对饼状图dom，初始化echarts实例
      var myChart1 = echarts.init(this.$refs.chart, 'shine')
      myChart1.setOption({
        color: ['rgb(113,166,238)','rgb(255,225,143)', 'rgb(191,177,254)', 'rgb(113,203,166)', 'rgb(255,149,147)'],
        // 图表标题
        title: {
          text: '某站点用户访问来源', // 标题内容
          subtext: '纯属虚构',
          x: 'center' // 居中显示
        },
        // 鼠标触发提示
        tooltip: {
          trigger: 'item',
          formatter: '{b}({d}%)' // 展示格式
        },
        // 图例
        legend: {
          bottom: 0,
          itemHeight: 8,
          itemWidth: 8,
          data: data.map(v => v.name)
        },
        // calculable: true,
        series: [
          {
            name: '选项',
            type: 'pie',
            radius: radius ? ['40%', '60%'] : ['0%', '60%'],
            center: ['50%', '50%'],
            avoidLabelverlap: true,
            data: data,
            animation: true, // 是否开启动画
            label: {
              // position: radius ? 'center' : 'outer',
              position: 'outer',
              alignTo: 'edge',
              margin: 30,
              normal: {
                formatter: '{b}({d}%)',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 15
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0
              },
              normal: {}
            }
          }
        ]
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
