<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="content pos-box u-fx-ver">
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
      <div class="charts  u-fx">
        <div class="zhexian u-fx-f1 u-bg-fff u-fx-ver u-padd-t10">
          <div class="title u-mar-l20 u-padd-l10">
            安全评分项占比
            <div class="line"></div>
          </div>
          <pre-echarts id="DangerStatis1" :radius="false" v-if="ratioChart.length > 0" :data="ratioChart"></pre-echarts>
        </div>
      </div>
      <div class="barCharts u-bg-fff u-mar-t10 ">
        <div class="title u-padd-l10  u-fx-jsb">
          <div class="left">用户评分排行</div>
          <div class="line"></div>
          <div class="right u-type-primary" @click="rule">
            评分规则>>
          </div>
        </div>
        <top5-table class="u-mar-t10" :checkTableIndex="checkTableIndex" :columns="columns" :data="rankList">
        </top5-table>
        <div class="page">
          <page-num class="u-bg-fff" v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import PreEcharts from '../component/PreEcharts'
import PageNum from '@c/PageNum'
import Top5Table from '../component/Top5Table'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '排名',
    align: 'center',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '用户名称',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '安全巡检',
    align: 'center',
    dataIndex: 'patrolCount'
  },
  {
    title: '隐患管理',
    align: 'center',
    dataIndex: 'dangerCount'
  },
  {
    title: '专项检查',
    align: 'center',
    dataIndex: 'specialCount'
  },
  {
    title: '安全事故',
    align: 'center',
    dataIndex: 'accidentCount'
  },
  {
    title: '安全任务',
    align: 'center',
    dataIndex: 'safeCount'
  },
  {
    title: '总分',
    align: 'center',
    dataIndex: 'total'
  }
]
export default {
  name: 'SafetyRating',
  components: {
    PreEcharts,
    Top5Table,
    PageNum
  },
  data() {
    return {
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      columns,
      pageList: {
        page: 1,
        size: 10
      },
      total: 0,
      checkTableIndex: -1,
      ratioChart: [], // 占比率
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
    ...mapActions('home', ['schRankPage', 'schRatePic']),
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
      const res1 = await this.schRatePic(req)
      const { accidentCount, dangerCount, patrolCount, safeCount, specialCount } = res1.data
      this.ratioChart = [
        { name: '安全事故', value: accidentCount },
        { name: '隐患管理', value: dangerCount },
        { name: '安全巡检', value: patrolCount },
        { name: '安全任务', value: safeCount },
        { name: '专项检查', value: specialCount }
      ]
      const res2 = await this.schRankPage(req)
      this.rankList = res2.data.records
      this.total = res2.data.total
    },
    // 规则
    rule() {
      this.$router.push('/safetyRating/integrationrule')
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
    .charts {
      height: 315px;
    }
    .barCharts {
      padding: 20px;
      padding-top: 10px;
      position: relative;
      height: 100%;
      .top5 {
        .table-box {
          height: 100%;
          @{deep} .ant-table-thead > tr > th {
            background: #c9ceeeff !important;
          }
        }
      }
      .page {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
