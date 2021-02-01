<template>
  <div class="u-pos-box" :id="id"></div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
export default {
  name: 'UChartsCom',
  props: {
    id: {
      type: String,
      default: `${Math.random() * 1000}-bar`
    },
    /**
     * 版权信息
     * isCredits { boolean } 是否显示版权 false
     */
    isCredits: {
      type: Boolean,
      defautl: false
    },
    /**
     * 图表区域背景颜色
     * backgroundColor { string } 背景颜色 默认null
     */
    backgroundColor: {
      type: String,
      default: null
    },
    /**
     * 图标类型配置
     * type { string } 图标类型 默认column
     */
    type: {
      type: String,
      default: 'column'
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
      default: 'right'
    },
    legendAlign: {
      type: String,
      default: 'top'
    },
    legendColor: {
      type: String,
      default: '#fff'
    },
    /**
     * x轴配置
     * xColor x轴文本颜色
     * xLineColor { string } x轴线条颜色
     * xLineWidth { number } x轴线条宽度 默认为1px
     * xGridColor { string } x轴网格线颜色 默认为null
     * xGridStyle { string } x轴网格线样式 默认longdash
     * xGridWidth { number } x轴网格线宽度 默认为1
     */
    xColor: {
      type: String,
      default: '#fff'
    },
    xLineColor: {
      type: String,
      default: '#fff'
    },
    xLineWidth: {
      type: [String, Number],
      default: 1
    },
    xGridColor: {
      type: String,
      default: null
    },
    xGridStyle: {
      type: String,
      default: 'longdash'
    },
    xGridWidth: {
      type: [String, Number],
      default: 1
    },
    /**
     * y轴配置
     * yTitle { string } y轴标题
     * yTitleColor { string } y轴标题颜色
     * yColor { string} y轴文本颜色
     * yLineColor { string } y轴线条颜色
     * yLineWidth { number } y轴线条宽度 默认为1px
     * yGridColor { string } y轴网格线颜色 默认为null
     * yGridStyle { string } y轴网格线样式 默认longdash
     * yGridWidth { number } y轴网格线宽度 默认为1
     */
    yTitle: {
      type: String,
      default: ''
    },
    yTitleColor: {
      type: String,
      default: '#fff'
    },
    yColor: {
      type: String,
      default: '#fff'
    },
    yLineColor: {
      type: String,
      default: null
    },
    yLineWidth: {
      type: [String, Number],
      default: 1
    },
    yGridColor: {
      type: String,
      default: null
    },
    yGridStyle: {
      type: String,
      default: 'longdash'
    },
    yGridWidth: {
      type: [String, Number],
      default: 1
    },
    /**
     * x轴数据配置
     * categories { array } x轴数据项
     */
    categories: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * 数据列配置
     * plotBorderWidth { string, nubmer } 数据项图表边框宽度
     * plotColor { string } 数据项对应文字颜色
     */
    plotBorderWidth: {
      type: [String, Number],
      default: 0
    },
    plotColor: {
      type: String,
      default: '#fff'
    },
    /**
     * 动态数据
     * categories { array } y轴数据项
     */
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
        /**
         * 版权信息
         */
        credits: {
          enabled: this.isCredits
        },
        /**
         * 图表区域
         */
        chart: {
          borderColor: null, // 图表边框颜色
          borderWidth: 0, // 图表边框宽度
          plotBorderWidth: 0, // 绘图区域边框宽度
          plotBorderColor: null, // 绘图区域边框颜色
          spacing: [10, 10, 15, 10], // 图表内间距
          backgroundColor: this.backgroundColor, // 图表区域背景颜色
          type: this.type // 图表类型
        },
        // 标题
        title: {
          text: ''
        },
        // 图例
        legend: {
          enabled: this.isLegend, // 是否显示图例
          align: this.legendJustify, // 图例水平对齐位置
          verticalAlign: this.legendAlign, // 图例垂直对齐位置
          itemStyle: {
            color: this.legendColor // 图例文本颜色
          }
        },
        // x轴配置
        xAxis: {
          lineColor: this.xLineColor, // x轴线条颜色
          lineWidth: this.xLineWidth, // x轴线条宽度
          gridLineColor: this.xGridColor, // x轴网格颜色
          gridLineDashStyle: this.xGridStyle, // x轴网格样式
          gridLineWidth: this.xGridWidth, // x轴网格线条宽度
          labels: {
            style: {
              color: this.xColor // x轴坐标文本颜色
            }
          },
          categories: this.categories // x轴数据
        },
        yAxis: {
          lineColor: this.yLineColor, // y轴线条颜色
          lineWidth: this.yLineWidth, // y轴线条宽度
          gridLineColor: this.yGridColor, // y轴网格线颜色
          gridLineDashStyle: this.yGridStyle, // y轴网格线样式
          gridLineWidth: this.yGridWidth, // y轴网格线条宽度
          min: 0, // y轴最小值
          labels: {
            style: {
              color: this.yColor // y轴坐标文本颜色
            }
          },
          title: {
            text: this.yTitle, // y轴标题文本
            style: {
              color: this.yTitleColor // y轴标题颜色
            }
          }
        },
        // 数据提示框
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:#000;padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} 人</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        // 数据列配置
        plotOptions: {
          [this.type]: {
            dataLabels: {
              enabled: true,
              color: this.plotColor
            },
            borderWidth: this.plotBorderWidth
          }
        },
        // 数据列配置
        series: this.series
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      Highcharts.chart(this.id, this.getBi())
    })
  }
}
</script>
<style lang="less" scoped></style>
