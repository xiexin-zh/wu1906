<template>
  <div class="pos-box" :id="id"></div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsVariablepie from 'highcharts/modules/variable-pie'
HighchartsVariablepie(Highcharts)
export default {
  name: 'UPieCom',
  props: {
    /**
     * 图表id
     */
    id: {
      type: String,
      default: `${Math.random() * 1000}-pie`
    },
    /**
     * 图表类型
     */
    type: {
      type: String,
      default: 'pie'
    },
    /**
     * 图例配置
     * isLegend { boolean } 是否显示图例，默认true
     * legendJustify { string } 图例水平对齐方式，默认right（left，center）
     * legendAlign { string } 图例垂直对齐方式，默认top （bottom，center）
     * legendColor { string } 图例文本颜色，默认#fff
     */
    isLegend: {
      type: Boolean,
      default: true
    },
    legendJustify: {
      type: String,
      default: 'center'
    },
    legendAlign: {
      type: String,
      default: 'bottom'
    },
    legendColor: {
      type: String,
      default: '#fff'
    },
    /**
     * 数据项配置
     * series { array } 数据项
     * innerSize { string } 饼图内圈百分比大小默认10%
     * plotBorderColor { string } 饼图边框颜色 默认#fff
     * plotBorderWidth { string } 饼图边框宽度 默认2px
     * plotColor { string } 数据列对应文本颜色
     */
    series: {
      type: Array,
      default: () => {
        return []
      }
    },
    innerSize: {
      type: [String, Number],
      default: '10'
    },
    plotBorderColor: {
      type: String,
      default: '#fff'
    },
    plotBorderWidth: {
      type: [String, Number],
      default: '2'
    },
    plotColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {}
  },
  methods: {
    getBi() {
      return {
        /**
         * 版权信息
         */
        credits: {
          enabled: this.isCredits
        },
        chart: {
          backgroundColor: null,
          plotShadow: false,
          type: 'pie'
        },
        /**
         * 标题
         */
        title: {
          text: ''
        },
        /**
         * 图例配置
         */
        legend: {
          enabled: this.isLegend, // 是否显示图例
          align: this.legendJustify, // 图例水平对齐位置
          verticalAlign: this.legendAlign, // 图例垂直对齐位置
          itemStyle: {
            color: this.legendColor // 图例文本颜色
          }
        },
        /**
         * 提示框配置
         */
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        /**
         * 数据列配置
         * plotBorderWidth { string, nubmer } 数据项图表边框宽度
         * plotColor { string } 数据项对应文字颜色
         */
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderColor: this.plotBorderColor,
            borderWidth: this.plotBorderWidth,
            dataLabels: {
              enabled: true,
              format:
                '<b>{point.name} {point.y}</b> ( {point.percentage:.1f}% )',
              style: {
                color: this.plotColor
              }
            },
            showInLegend: this.isLegend
          }
        },
        series: [
          {
            colorByPoint: true,
            name: '占比',
            innerSize: `${this.innerSize}%`,
            data: this.series.length > 0 ? this.series : []
          }
        ]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      Highcharts.chart(this.id, this.getBi())
    })
  }
}
</script>
<style lang="less" scoped>
</style>
