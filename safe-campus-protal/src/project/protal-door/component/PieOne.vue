<template>
  <div class="pie-one" :id="id"></div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import HighchartsVariablepie from 'highcharts/modules/variable-pie'
HighchartsVariablepie(Highcharts)
export default {
  name: 'PieOne',
  props: {
    borderWidth: {
      type: Number,
      default: 4
    },
    innerSize: {
      type: Number,
      default: 40
    },
    id: {
      type: String,
      default: 'pie-one'
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'variablepie'
    },
    isLegend: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    getBi() {
      return {
        credits: {
          enabled: false // 禁用版权信息
        },
        chart: {
          backgroundColor: null,
          plotShadow: false
        },
        title: {
          text: '实时在校',
          style: {
            color: '#6882da',
            fontSize: 18
          }
        },
        legend: {
          itemStyle: {
            color: '#6882da'
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          [this.type]: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderColor: '#6882da',
            borderWidth: this.borderWidth,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name} {point.y}</b> ( {point.percentage:.1f}% )',
              style: {
                color: '#6882da'
              }
            },
            showInLegend: this.isLegend
          }
        },
        series: [
          {
            type: this.type,
            name: '占比',
            innerSize: `${this.innerSize}%`,
            data: this.dataList
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
<style lang="less" scoped></style>
