<template>
  <div class="u-fx">
    <!-- 2. 柱状图Dom -->
    <div id="main2" style="width: 50%;height:400px;"></div>
    <div id="main1" style="width: 50%;height:400px;"></div>
  </div>
</template>
<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/toolbox')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 指定饼状图图表的配置项和数据
var option1 = {
  // 图表标题
  title: {
    text: '某站点用户访问来源', // 标题内容
    subtext: '纯属虚构',
    x: 'center' // 居中显示
  },
  // 鼠标触发提示
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)' // 展示格式
  },
  // 图例
  legend: {
    orient: 'horizontal', // 垂直显示
    top: 'auto',
    // x: 'bottom', // 显示位置--左上
    data: ['低风险', '一般风险', '较大风险', '最大风险']
  },
  calculable: true,
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '65%',
      center: ['50%', '50%'],
      data: [
        { value: 335, name: '低风险' },
        { value: 310, name: '一般风险' },
        { value: 234, name: '较大风险' },
        { value: 135, name: '最大风险' }
      ]
    }
  ]
}
// 指定柱状图图表的配置项和数据
var option2 = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 指示器类型，shadow为阴影指示器
      type: 'shadow'
    }
  },
  // legend: {
  //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  // },
  // 工具栏组件
  // toolbox: {
  //   show: true,
  //   orient: 'vertical',
  //   top: 'center',
  //   feature: {
  //     mark: { show: true },
  //     // 启用的动态类型，包括'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
  //     magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
  //     restore: { show: true }, // 是否支持配置项还原
  //     saveAsImage: { show: true } // 保存图片
  //   }
  // },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      data: ['学校A', '学校B', '学校C', '学校D', '学校E']
    }
  ],
  yAxis: [
    {
      type: 'value',
      splitArea: { show: true }
    }
  ],
  grid: {
    x2: 40
  },
  series: [
    {
      name: '最大风险',
      type: 'bar',
      stack: '总量',
      barWidth: 50, // 柱图宽度
      data: [320, 332, 301, 334, 390]
    },
    {
      name: '一般风险',
      type: 'bar',
      stack: '总量',
      data: [220, 182, 191, 234, 290]
    },
    {
      name: '较大风险',
      type: 'bar',
      stack: '总量',
      data: [150, 232, 201, 154, 190]
    },
    {
      name: '低风险',
      type: 'bar',
      stack: '总量',
      data: [120, 132, 101, 134, 90]
    }
  ]
}
export default {
  name: 'PreBarEcharts',
  props: {
    dataList: {
      type: Array,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initPieData(this.dataList)
    this.initColumnarData()
  },
  created() {},
  watch: {
    // dataList(val) {
    //   this.initPieData(val[0])
    //   this.initColumnarData()
    // }
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
    initPieData(data) {
      function getSum(total, num) {
        return total + num
      }
      // 对饼状图dom，初始化echarts实例
      var myChart1 = echarts.init(document.getElementById('main1'), 'shine')
      const preData1 = [
        { value: data.map(v => v.lowCount).reduce(getSum), name: '低风险' },
        { value: data.map(v => v.generalCount).reduce(getSum), name: '一般风险' },
        { value: data.map(v => v.biggerCount).reduce(getSum), name: '较大风险' },
        { value: data.map(v => v.heavyCount).reduce(getSum), name: '重大风险' }
      ]
      myChart1.setOption({
        // 图表标题
        title: {
          text: '某站点用户访问来源', // 标题内容
          subtext: '纯属虚构',
          x: 'center' // 居中显示
        },
        // 鼠标触发提示
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)' // 展示格式
        },
        // 图例
        // legend: {
        //   orient: 'horizontal', // 垂直显示
        //   top: 'auto',
        //   // x: 'bottom', // 显示位置--左上
        //   data: ['低风险', '一般风险', '较大风险', '最大风险']
        // },
        calculable: true,
        series: [
          {
            name: '风险等级',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: preData1,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0
                // shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  // 自定义颜色
                  var colorList = ['#399ffb', '#f9d239', '#fd7d2a', '#f26980']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }) // 按option1展示myChart1图表
      // echarts.connect([myChart2, myChart1])
      // 配置自动适应Windows窗口大小
      // setTimeout(function () {
      //   window.onresize = function () {
      //     myChart1.resize()
      //     myChart2.resize()
      //   }
      // }, 200)
    },
    initColumnarData() {
      // 对柱状图dom，初始化echarts实例
      var myChart2 = echarts.init(document.getElementById('main2'), 'shine')
      myChart2.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 指示器类型，shadow为阴影指示器
            type: 'shadow'
          }
        },
        color: ['#f26980', '#f9d239', '#fd7d2a', '#399ffb'],
        legend: {
          data: ['重大风险', '一般风险', '较大风险', '低风险']
        },
        calculable: true,
        xAxis: [
          {
            splitLine: { show: false }, // 去除网格线
            textStyle: {
              color: '#999' // 这里用参数代替了
            },
            type: 'category',
            data: this.dataList.map(v => v.schoolName)
          }
        ],
        yAxis: [
          {
            splitLine: { show: false }, // 去除网格线
            type: 'value',
            splitArea: { show: true },
            textStyle: {
              color: '#999' // 这里用参数代替了
            }
          }
        ],
        grid: {
          x2: 40
        },
        series: [
          {
            name: '重大风险',
            type: 'bar',
            stack: '总量',
            barWidth: 50, // 柱图宽度
            data: this.dataList.map(v => v.heavyCount),
            itemStyle: {
              normal: {
                color: function(params) {
                  // 自定义颜色
                  var colorList = ['#f26980', '#f26980', '#f26980', '#f26980', '#f26980']
                  return colorList[params.dataIndex]
                }
              }
            }
          },
          {
            name: '一般风险',
            type: 'bar',
            stack: '总量',
            data: this.dataList.map(v => v.generalCount),
            itemStyle: {
              normal: {
                color: function(params) {
                  // 自定义颜色
                  var colorList = ['#f9d239', '#f9d239', '#f9d239', '#f9d239', '#f9d239']
                  return colorList[params.dataIndex]
                }
              }
            }
          },
          {
            name: '较大风险',
            type: 'bar',
            stack: '总量',
            data: this.dataList.map(v => v.biggerCount),
            itemStyle: {
              normal: {
                color: function(params) {
                  // 自定义颜色
                  var colorList = ['#fd7d2a', '#fd7d2a', '#fd7d2a', '#fd7d2a', '#fd7d2a']
                  return colorList[params.dataIndex]
                }
              }
            }
          },
          {
            name: '低风险',
            type: 'bar',
            stack: '总量',
            data: this.dataList.map(v => v.lowCount),
            itemStyle: {
              normal: {
                color: function(params) {
                  // 自定义颜色
                  var colorList = ['#399ffb', '#399ffb', '#399ffb', '#399ffb', '#399ffb']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
      // myChart2.on('click', (params) => {
      //   const setPieData = this.dataList.filter(v => v.schoolName === params.name)
      //   this.initPieData(setPieData[0])
      // })
    }
  }
}
</script>
<style lang="less"></style>
