<template>
  <div v-loading="loading"
       class="main-container">
    <filtrate-handle-view class="filtrate-bar"
                          moduleType="business"
                          :showBusinessSelect="true"
                          @load="loading=true"
                          @change="getDataList">
    </filtrate-handle-view>
    <div class="content">
      <div class="axis-content">
        <div id="axismain"></div>
      </div>
      <div class="table-content">
        <el-table :data="list"
                  height="400"
                  stripe
                  border
                  highlight-current-row>
          <el-table-column v-for="(item, index) in fieldList"
                           :key="index"
                           align="center"
                           header-align="center"
                           show-overflow-tooltip
                           :prop="item.field"
                           :label="item.name">
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import base from '../mixins/base'
import echarts from 'echarts'
import { biBusinessFunnel } from '@/api/businessIntelligence/business'

export default {
  /** 销售漏斗 */
  name: 'funnel-statistics',
  components: {},
  data() {
    return {
      loading: false,

      list: [],
      fieldList: [
        { field: 'status_name', name: '階段' },
        { field: 'money', name: '金額' },
        { field: 'count', name: '商機數' }
      ],

      funnelChart: null, // 漏斗图
      funnelOption: null
    }
  },
  mixins: [base],
  computed: {},
  mounted() {
    this.initAxis()
  },
  methods: {
    /**
     * 图表数据
     */
    getDataList(params) {
      this.loading = true
      biBusinessFunnel(params)
        .then(res => {
          this.loading = false
          this.list = res.data.list
          var data = []
          for (let index = 0; index < res.data.list.length; index++) {
            const element = res.data.list[index]
            data.push({
              name: element.status_name + '(' + element.count + ')',
              value: element.money
            })
          }

          this.funnelOption.series[0].data = data
          this.funnelOption.series[0].max =
            res.data.sum_money < 1 ? 1 : res.data.sum_money
          this.funnelChart.setOption(this.funnelOption, true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 销售漏斗 */
    initAxis() {
      var funnelChart = echarts.init(document.getElementById('axismain'))
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/> 預測金額: {c}元'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        calculable: true,
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        },
        color: this.chartColors,
        series: [
          {
            name: '漏斗圖',
            type: 'funnel',
            left: '20%',
            width: '56%',
            /** 数据排序 */
            sort: 'none',
            /** 数据图形间距。 */
            gap: 2,

            label: {
              normal: {
                show: true,
                position: 'right'
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            labelLine: {
              normal: {
                length: 20,
                lineStyle: {
                  width: 1,
                  type: 'solid'
                }
              }
            },
            data: []
          }
        ]
      }

      funnelChart.setOption(option, true)
      this.funnelOption = option
      this.funnelChart = funnelChart
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../styles/detail.scss';
</style>
