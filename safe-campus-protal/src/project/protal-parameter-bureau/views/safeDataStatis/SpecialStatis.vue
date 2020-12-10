<template>
  <div class="page-layout SpecialStatis  qui-fx-ver">
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
      <div class="charts u-mar-t10 u-fx">
        <div class="zhexian u-fx-f1 u-bg-fff u-mar-r10 u-fx-ver u-padd-t10">
          <div class="title u-mar-l20 u-padd-l10">
            专项检查任务总览
            <div class="line"></div>
          </div>
          <pre-echarts id="SpecialStatis1" v-if="countDTO.length > 0" :data="countDTO"></pre-echarts>
        </div>
        <div class="top5 u-fx-f2 u-bg-fff u-fx-ver u-padd-t10">
          <div class="title u-mar-l20 u-padd-l10">
            专项检查任务排行TOP5(本区域排行)
            <div class="line"></div>
          </div>
          <div class="table-box u-padd-20 u-fx-ac-jc">
            <top5-table :checkTableIndex="checkTableIndex" :columns="columns" :data="rankList"></top5-table>
          </div>
        </div>
      </div>
      <div class="second-row u-bg-fff u-mar-t10 ">
        <div class="title u-padd-l10  ">
          专项检查统计图
          <div class="line"></div>
        </div>
        <columnar-echarts
          id="SpecialStatis1"
          v-if="chartList.length > 0"
          :data="chartList"
          :legendData="[
            { name: '任务总数', value: 'all' },
            { name: '任务完成数', value: 'done' }
          ]"
        ></columnar-echarts>
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
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '学校名称',
    align: 'center',
    dataIndex: 'schoolName'
  },
  {
    title: '任务完成数',
    align: 'center',
    dataIndex: 'finishTaskCount'
  },
  {
    title: '任务完成率',
    align: 'center',
    dataIndex: 'finishRate',
    customRender: text => {
      return `${text}%`
    }
  }
]
export default {
  name: 'SpecialStatis',
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
      eduSchoolCodes: [],
      checkTableIndex: -1,
      chartList: [], //	条形图统计
      countDTO: [], // 总体数量统计
      myRank: [], // 本校名次
      rankList: [] //	排行榜
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getSchools()
    await this.showList()
  },
  async mounted() {},
  methods: {
    ...mapActions('home', ['eduSpecialStatis', 'getEduCode', 'underSchoolList']),
    // 获取教育下面的schoolCode集合
    async getSchools() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 30
      }
      const res = await this.underSchoolList(req)
      this.eduSchoolCodes = res.data.list.map(v => v.schoolCode)
    },
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
        schoolCodeList: this.eduSchoolCodes,
        startYear: this.startValue.format('YYYY'),
        startMonth: this.startValue.format('M'),
        endYear: this.endValue.format('YYYY'),
        endMonth: this.endValue.format('M'),
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.eduSpecialStatis(req)
      const { chartList, countDTO, myRank, rankList } = res.data
      this.chartList = chartList
      this.countDTO = [
        { name: '未完成', value: countDTO.notFinishCount },
        { name: '已完成', value: countDTO.finishCount }
      ]
      this.myRank = myRank
      const count = rankList.findIndex(el => el.schoolCode === this.userInfo.schoolCode)
      if (count === -1) {
        this.rankList = this.rankList.push(myRank)
      } else {
        this.checkTableIndex = count
      }
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
.SpecialStatis {
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
      height: 390px;
      .top5 {
        .table-box {
          height: 100%;
          @{deep} .ant-table-thead > tr > th {
            background: #c9ceeeff !important;
          }
        }
      }
    }
    .second-row {
      padding: 20px;
      padding-top: 10px;
      height: 100%;
    }
  }
}
</style>
