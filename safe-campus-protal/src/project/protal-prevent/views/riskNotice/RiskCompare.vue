<template>
  <div class="post-compare page-layout qui-fx-ver">
    <div class="fill-top">
      <div class="u-mar-l40"> 风险等级比较图 </div>
    </div>
    <div class="qui-fx-f1 u-padd">
      <div id="container" ref="container" style="width:100%;height:100%"></div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import Exporting from 'highcharts/modules/exporting'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'RiskCompare',
  data() {
    return {
      categories: [],
      lowList: [],
      generalList: [],
      biggerList: [],
      heavyList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    Exporting(Highcharts)
    this.categories = ['组织领导', '安全教育与培训', '安防基础建设', '消防安全及电气火灾防控管理', '校园安全', '校舍安全', ' 重点部位安全管理', '实验室管理及建设', ' 食堂食品', '学校卫生安全', ' 教育教学活动安全', ' 学生管理', ' 教职员工管理', '交通安全管理', ' 特种设备', '周边环境', '应急处置']
    for (var i = 0; i < 17; i++) {
      this.lowList.unshift(0)
      this.generalList.unshift(0)
      this.biggerList.unshift(0)
      this.heavyList.unshift(0)
    }
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['riskChart']),
    async showDetail() {
      const res = await this.riskChart(this.userInfo.schoolCode)
      let i
      res.data.forEach(ele => {
        this.categories.filter((item, index) => {
          if (item === ele.categoryName) {
            i = index
          }
        })
        this.lowList[i] = ele.low
        this.generalList[i] = ele.general
        this.biggerList[i] = ele.bigger
        this.heavyList[i] = ele.heavy
        console.log(this.lowList)
      })
      Highcharts.setOptions({
        lang: {
          contextButtonTitle: '图表导出菜单',
          downloadJPEG: '下载JPEG图片',
          downloadPDF: '下载PDF文件',
          downloadPNG: '下载PNG文件',
          downloadSVG: '下载SVG文件',
          printChart: '打印图表'
        }
      })
      var chart = Highcharts.chart('container', {
        credits: {
          enabled: false
        },
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: this.categories
        },
        yAxis: {
          min: 0,
          allowDecimals: false,
          title: {
            text: ''
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>' + '<br/>',
          shared: true
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: [{
          name: '低风险',
          color: '#0084ff',
          data: this.lowList
        }, {
          name: '一般风险',
          color: '#f5b111',
          data: this.generalList
        }, {
          name: '较大风险',
          color: '#f5772d',
          data: this.biggerList
        }, {
          name: '重大风险',
          color: '#ff5454',
          data: this.heavyList
        }]
      })
    }
  }
}
</script>
<style lang="less" scoped>
.post-compare {
  .fill-top {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 3px;
      background-color: #4d4cac;
      left: 25px;
      bottom: 15px;
    }
  }
}
</style>
