<template>
  <!-- 2. 柱状图Dom -->
  <div :id="id" ref="chart" style="width: 50%;height:400px;"></div>
</template>
<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
export default {
  name: 'BarEcharts',
  props: {
    multipleData: {
      type: Array,
      default: function () {
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
    return {
    }
  },
  mounted() {
    this.initColumnarData(this.multipleData)
  },
  created() {
  },
  watch: {
  },
  methods: {
    initColumnarData(data) {
      // 对柱状图dom，初始化echarts实例
      var myChart2 = echarts.init(this.$refs.chart, 'shine')
      myChart2.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 指示器类型，shadow为阴影指示器
            type: 'shadow'
          }
          // formatter: '{a} <br/>{b} : {c}人 ({d}%)' // 展示格式
        },
        color: ['#f26980', '#f9d239', '#fd7d2a', '#399ffb'],
        legend: {
          data: ['答题人数', '占比']
        },
        calculable: true,
        xAxis: [
          {
            splitLine: { show: false }, // 去除网格线
            // type: 'category',
            textStyle: {
              color: '#999' // 这里用参数代替了
            },
            type: 'value'
          }

        ],
        yAxis: [
          {
            splitLine: { show: false }, // 去除网格线
            type: 'category',
            splitArea: { show: true },
            textStyle: {
              color: '#999' // 这里用参数代替了
            },
            axisLabel: {
              interval: 0,
              axisLabel: {
                interval: 0,
                // rotate:30,
                // formatter: function(val) {
                //   var strs = val.split('') // 字符串数组
                //   var str = ''
                //   for (var i = 0, s; s = strs[i++];) { // 遍历字符串数组
                //     str += s
                //     if (!(i % 8)) str += '\n' // 按需要求余
                //   }
                //   return str
                // }
              }
            },
            data: data.map(v => v.answer)
          }
        ],
        grid: {
          x2: 10
        },
        series: [
          {
            name: '答题人数',
            type: 'bar',
            barWidth: 40, // 柱图宽度
            stack: '总量',
            data: data.map(v => v.count)
          },
          {
            name: '占比',
            barWidth: 40, // 柱图宽度
            type: 'bar',
            stack: '总量',
            data: data.map(v => v.rate)
            // itemStyle: {
            //   normal: {
            //     color: function(params) {
            //       // 自定义颜色
            //       var colorList = [
            //         '#399ffb', '#399ffb', '#399ffb', '#399ffb', '#399ffb'
            //       ]
            //       return colorList[params.dataIndex]
            //     }
            //   }
            // }
          }
        ]
      })
      // myChart2.on('click', (params) => {
      //   const setPieData = data.filter(v => v.schoolName === params.name)
      //   this.initPieData(setPieData[0])
      // })
    }
  }
}
</script>
<style lang="less"></style>
