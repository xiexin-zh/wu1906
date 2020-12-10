<!--
 * @Author: your name
 * @Date: 2020-11-09 10:03:09
 * @LastEditTime: 2020-11-09 14:24:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \safe-campus-protal\src\project\protal-parameter-bureau\component\CircleEcharts.vue
-->
<template>
  <div :id="id" ref="chart" style="width:100%;height:100%;" ></div>
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
  
  name: 'CircleEcharts',
  /**
   * @description: 
   * @param {*}
   * @return {*}
   */
  props: {
    data: {
      type: String,
      default: ''
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
    },
    radius: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.initPieData(this.data, this.legendData, this.radius)
  },
  created() {
  },
  watch: {
  },
  methods: {
    fomartData(val) {
      const fomartData = JSON.parse(JSON.stringify(val).replace(/answer/g, 'name').replace(/count/g, 'value'))
      return fomartData
    },
    
    initPieData(data, legendData, radius) {
      // 对饼状图dom，初始化echarts实例
      var myChart1 = echarts.init(this.$refs.chart, 'shine')
      myChart1.setOption({
        backgroundColor: '#fff',
        angleAxis: {
          max: 100,
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{c}%'
        },
        graphic: { // 图形中间文字
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '完成率 ',
            textAlign: 'center',
            fill: '#666',
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false

          },
          axisTick: {
            show: false
          }
        },
        polar: {
          radius: ['50%', '65%'],
          center: ['50%', '50%']
        },
        series: [{
          type: 'bar',
          roundCap: true,
          barWidth: 40,
          showBackground: true,
          backgroundStyle: {
            color: '#f0f0f0'
          },
          itemStyle: {
            normal: {
              opacity: 1,
              color: '#2d82ff'
            }

          },
          data: [{
            value: 90,
            itemStyle: {
              color: '#2d82ff',
              shadowBlur: 10, // 浅蓝色阴影
              shadowColor: 'rgba(0, 103, 255, 0.2)',
              shadowOffsetX: -5,
              shadowOffsetY: 5
            }

          } ],
          coordinateSystem: 'polar',
          name: 'A',
          label: {
            show: true
          }
        }]
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
