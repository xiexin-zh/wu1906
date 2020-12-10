<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="content pos-box  u-fx-ver">
      <div class="search-form u-padd-t10 u-padd-b10 u-tips-color">
        <a-month-picker
          :allowClear="false"
          v-model="startValue"
          placeholder="请选择月份"
          :disabled-date="disabledStartMonth"
        />&nbsp;&nbsp;-&nbsp;
        <a-month-picker
          :allowClear="false"
          v-model="endValue"
          placeholder="请选择月份"
          :disabled-date="disabledEndMonth"
        />
        <a-button class="u-mar-l10" type="primary" @click="search()">搜索</a-button>
      </div>
      <div class="numbers u-mar-t10 u-fx wh">
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/图1@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            隐患任务总数
            <div class="number u-font-3 u-bold">
              {{ count.all }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/图2@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            已整改
            <div class="number u-font-3 u-bold">
              {{ count.done }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/图3@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            整改中
            <div class="number u-font-3 u-bold">
              {{ count.doing }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/图4@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            逾期未整改
            <div class="number u-font-3 u-bold">
              {{ count.delay }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-fx-ac">
          <img src="../../assets/img/图4@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            整改率
            <div class="number u-font-3 u-bold">{{ count.rate }}%</div>
          </div>
        </div>
      </div>
      <div class="three-row u-bg-fff u-mar-b10  u-mar-t10 ">
        <div class="title u-padd-l10  ">
          安全隐患统计图
          <div class="line"></div>
        </div>
        <columnar-echarts
          id="DangerStatis1"
          v-if="barChart.length > 0"
          :data="barChart"
          :legendData="[
            { name: '隐患总数', value: 'all' },
            { name: '逾期未整改', value: 'delay' },
            { name: '整改中', value: 'doing' },
            { name: '已整改', value: 'done' }
          ]"
        ></columnar-echarts>
      </div>
      <div class="four-row  u-fx">
        <div class="pie-box  u-fx-f2 u-bg-fff u-mar-r10 u-fx-ver u-padd-t10 u-mar-b10">
          <div class="title u-mar-l20 u-padd-l10">
            隐患类型占比
            <div class="line"></div>
          </div>
          <pre-echarts id="DangerStatis1" :radius="false" v-if="ratioChart.length > 0" :data="ratioChart"></pre-echarts>
        </div>
        <div class="top5 u-fx-f3 u-bg-fff u-fx-ver u-padd-t10">
          <div class="title u-mar-l20 u-padd-l10">
            隐患上报排行
            <div class="line"></div>
          </div>
          <div class="table-box u-padd-20 u-fx-ac-jc">
            <top5-table :checkTableIndex="checkTableIndex" :columns="columns" :data="rankList"></top5-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import PreEcharts from '../../component/PreEcharts'
import ColumnarEcharts from '../../component/ColumnarEcharts'
import Top5Table from '../../component/Top5Table'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: 'ranking'
  },
  {
    title: '老师姓名',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '上报数量',
    align: 'center',
    dataIndex: 'number'
  },
  {
    title: '占比',
    align: 'center',
    dataIndex: 'rate'
    // customRender: (text) => {
    //   return `${text}%`
    // }
  }
]
export default {
  name: 'DangerStatis',
  components: {
    PreEcharts,
    Top5Table,
    ColumnarEcharts
  },
  data() {
    return {
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      columns,
      checkTableIndex: -1,
      count: {}, // 总体数量统计
      barChart: [], //	条形图统计
      ratioChart: [], // 饼图
      rankList: [] //	排行榜
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.showList()
  },
  async mounted() {},
  methods: {
    ...mapActions('home', ['schDangerStatis', 'treeView', 'statistics', 'pageStatistics']),
    // 月日期选择器
    disabledStartMonth(startValue) {
      if (startValue.valueOf() > new Date()) return true
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndMonth(endValue) {
      if (endValue.valueOf() > new Date()) return true
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    search() {
      this.showList()
    },
    async showList() {
      const req = {
        startYear: this.startValue.format('YYYY'),
        startMonth: this.startValue.format('M'),
        endYear: this.endValue.format('YYYY'),
        endMonth: this.endValue.format('M'),
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.schDangerStatis(req)
      const { barChart, rankList, count, ratioChart } = res.data
      this.count = count
      this.ratioChart = ratioChart.map(el => {
        return {
          name: el.type,
          value: el.count
        }
      })
      this.barChart = barChart
      // const index = rankList.findIndex(el => el.schoolCode === this.userInfo.schoolCode)
      // if (index === -1) {
      //   this.rankList = this.rankList.push(myRank)
      // } else {
      //   this.checkTableIndex = count
      // }
      this.rankList = rankList
    },
    searchForm(values) {
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.daily-statis {
  background-color: #f0f2f5;
  .content {
    height: calc(100% - 10px);
    .title {
      position: relative;
      .line {
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 13px;
        background: #9698d6;
      }
    }
    .numbers {
      height: 100px;
      .list {
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.06);
        opacity: 0.8;
        border-radius: 5px;
        width: 25%;
        img {
          width: 48px;
        }
      }
    }
    .three-row {
      height: 100%;
      padding: 20px;
      padding-top: 10px;
    }
    .four-row {
      height: 320px;
      .pie-box {
      }
      .top5 {
        .table-box {
          height: 100%;
          @{deep} .ant-table-thead > tr > th {
            background: #c9ceeeff !important;
          }
        }
      }
    }
  }
}
</style>
