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
            巡查任务总数
            <div class="number u-font-3 u-bold">
              {{ generalCount.allTaskCount }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/图2@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            已巡查任务数
            <div class="number u-font-3 u-bold">
              {{ generalCount.doneTaskCount }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/图3@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            已巡查人数
            <div class="number u-font-3 u-bold">
              {{ generalCount.donePersonCount }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-fx-ac">
          <img src="../../assets/img/图4@2x.png" alt="" />
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">
            任务完成率
            <div class="number u-font-3 u-bold">{{ generalCount.doneRate }}%</div>
          </div>
        </div>
      </div>
      <div class="charts u-mar-t10 u-fx">
        <div class="zhexian u-fx-f2 u-bg-fff u-mar-r10 u-fx-ver u-padd-t10">
          <div class="title u-mar-l20 u-padd-l10">
            日常巡查任务总数
            <div class="line"></div>
          </div>
          <!-- :legendData="['巡检任务总数','已巡查人数','已巡查任务数']" -->
          <polyline-echarts
            v-if="lineChartList.length > 0"
            :legendData="[
              { name: '巡检任务总数', value: 'allTaskCount', color: '#F5B111FF', middleColor: '#fcf8eb' },
              { name: '已巡查人数', value: 'donePersonCount', color: '#00A35F', middleColor: '#e6f6ef' },
              { name: '已巡查任务数', value: 'doneTaskCount', color: '#0084FF', middleColor: '#e6f3ff' }
            ]"
            :data="lineChartList"
            id="DailyStatis1"
          ></polyline-echarts>
        </div>
        <div class="bing u-fx-f1 u-bg-fff u-fx-ver u-padd-t10">
          <div class="title u-mar-l20 u-padd-l10">
            巡查任务类型占比
            <div class="line"></div>
          </div>
          <pre-echarts id="DailyStatis2" v-if="rateChart.length > 0" :data="rateChart"></pre-echarts>
        </div>
      </div>
      <div class="schRanking u-bg-fff u-mar-t10 ">
        <div class="title u-padd-l10  ">
          学校人员排名
          <div class="line"></div>
        </div>
        <div class="cont u-mar-t10 u-fx">
          <div class="list u-bd-1px u-fx-jc u-fx-ac u-fx-f1 u-mar-r10 u-border-radius">
            <img src="../../assets/img/trophy1@2x.png" alt="" />
            <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc" v-if="rank.first">
              <div class="number u-font-2 u-bold" style="color:#F39C1AFF">
                {{ rank.first.userName }}
              </div>
              <div class="number">巡检排查数 {{ rank.first.checkCount }}</div>
              <div class="number">次数占比 {{ rank.first.checkRate }}%</div>
            </div>
          </div>
          <div class="list  u-bd-1px u-fx-jc u-fx-ac u-fx-f1 u-mar-r10 u-border-radius">
            <img src="../../assets/img/trophy2@2x.png" alt="" />
            <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc" v-if="rank.second">
              <div class="number u-font-2 u-bold" style="color:#DD721CFF">
                {{ rank.second.userName }}
              </div>
              <div class="number">巡检排查数 {{ rank.second.checkCount }}</div>
              <div class="number">次数占比 {{ rank.second.checkRate }}%</div>
            </div>
          </div>
          <div class="list u-bd-1px u-fx-jc u-fx-ac u-fx-f1 u-border-radius">
            <img src="../../assets/img/trophy3@2x.png" alt="" />
            <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc" v-if="rank.third">
              <div class="number u-font-2 u-bold" style="color:#B28E38FF">
                {{ rank.third.userName }}
              </div>
              <div class="number">巡检排查数 {{ rank.third.checkCount }}</div>
              <div class="number">次数占比 {{ rank.third.checkRate }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import PreEcharts from '../../component/PreEcharts'
//import PolylineEcharts from '../../component/PolylineEcharts'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DailyStatis',
  components: {
    PreEcharts,
    PolylineEcharts
  },
  data() {
    return {
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      generalCount: {}, //	总体数量统计
      lineChartList: [], // 折线图
      rateChart: [], // 饼图
      rank: {} //	排行榜
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.showList()
  },
  async mounted() {},
  methods: {
    ...mapActions('home', ['schDailyStatis']),
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
      const res = await this.schDailyStatis(req)
      const { generalCount, lineChartList, rateChart, rank } = res.data
      this.generalCount = generalCount
      this.lineChartList = lineChartList
      this.rateChart = [
        { name: '卫生检查', value: rateChart.hygieneCount, rate: rateChart.hygieneRate },
        { name: '安全检查', value: rateChart.safeCount, rate: rateChart.safeRate },
        { name: '常规检查', value: rateChart.generalCount, rate: rateChart.generalRate }
      ]
      this.rank = rank
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.daily-statis {
  background-color: #f0f2f5;
  .content {
    height: calc(100% - 10px);
    // overflow-y: scroll;
    // overflow-x: hidden;
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
    .charts {
      height: 100%;
      min-height: 300px;
    }
    .schRanking {
      height: 180px;
      padding: 20px;
      padding-top: 10px;
      .list {
        height: 120px;
        img {
          width: 40px;
        }
      }
    }
  }
}
</style>
