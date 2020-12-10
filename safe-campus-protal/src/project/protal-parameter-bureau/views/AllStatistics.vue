<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="content pos-box u-fx-ver">
      <div class="search-form  u-padd-b10 u-tips-color u-fx-jsb">
        <div class="left">
          <a-month-picker
            v-model="startValue"
            placeholder="请选择月份"
            :disabled-date="disabledStartMonth"
          />&nbsp;&nbsp;-&nbsp;
          <a-month-picker v-model="endValue" placeholder="请选择月份" :disabled-date="disabledEndMonth" />
          <a-button class="u-mar-l10" type="primary" @click="search()">搜索</a-button>
        </div>
      </div>
      <div class="table-all u-fx">
        <div class="table-box u-fx-f1 u-mar-r10">
          <div class="title u-fx-jsb u-mar-b10 u-bold">
            日常巡查总数排名
            <div class="btn">
              <a-input
                allowClear
                v-model="dailySchoolName"
                style="width: 120px;margin-right: 20px"
                placeholder="请输入学校"
              />
              <a-button @click="dailyList(0)" type="primary">搜索</a-button>
            </div>
          </div>
          <table-list :page-list="dailyPageList" :columns="patrolAllColumns" :table-list="daily.records">
            <template v-slot:actions="action" class="u-fx">
              <a-tooltip placement="topLeft" title="查看">
                <a-button
                  size="small"
                  class="detail-action-btn"
                  icon="ellipsis"
                  @click="goDetail('daily', action.record)"
                ></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <page-num v-if="daily.total" v-model="dailyPageList" :total="daily.total" @change-page="dailyList"></page-num>
        </div>
        <div class="table-box u-fx-f1 u-mar-r10">
          <div class="title u-fx-jsb u-mar-b10 u-bold">
            隐患整改率排名
            <div class="btn">
              <a-input
                allowClear
                v-model="dangerSchoolName"
                style="width: 120px;margin-right: 20px"
                placeholder="请输入学校"
              />
              <a-button @click="dangerList(0)" type="primary">搜索</a-button>
            </div>
          </div>
          <table-list :page-list="dangerPageList" :columns="dangerColumns" :table-list="danger.records">
            <template v-slot:actions="action" class="u-fx">
              <a-tooltip placement="topLeft" title="查看">
                <a-button
                  size="small"
                  class="detail-action-btn"
                  icon="ellipsis"
                  @click="goDetail('danger', action.record)"
                ></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <page-num
            v-if="danger.total"
            v-model="dangerPageList"
            :total="danger.total"
            @change-page="dangerList"
          ></page-num>
        </div>
        <div class="table-box u-fx-f1">
          <div class="title u-fx-jsb u-mar-b10 u-bold">
            专项检查完成率排名
            <div class="btn">
              <a-input
                allowClear
                v-model="specialSchoolName"
                style="width: 120px;margin-right: 20px"
                placeholder="请输入学校"
              />
              <a-button @click="specialList(0)" type="primary">搜索</a-button>
            </div>
          </div>
          <table-list :page-list="specialPageList" :columns="specialColumns" :table-list="special.records">
            <template v-slot:actions="action" class="u-fx">
              <a-tooltip placement="topLeft" title="查看">
                <a-button
                  size="small"
                  class="detail-action-btn"
                  icon="ellipsis"
                  @click="goDetail('special', action.record)"
                ></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <page-num
            v-if="special.total"
            v-model="specialPageList"
            :total="special.total"
            @change-page="specialList"
          ></page-num>
        </div>
      </div>
    </div>
    <statistics-detail ref="statisticsDetail" v-model="formStatus"></statistics-detail>
  </div>
</template>
<script>
import moment from 'moment'
import { patrolAllColumns, dangerColumns, specialColumns } from '../assets/js/tableColumns.js'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import StatisticsDetail from './StatisticsDetail'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SafetyReport',
  components: {
    PageNum,
    StatisticsDetail,
    TableList
  },
  data() {
    return {
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      undSchoolList: [],
      dailySchoolName: '',
      patrolAllColumns,
      daily: {},
      dailyPageList: {
        page: 1,
        size: 2
      },
      dangerSchoolName: '',
      dangerColumns,
      danger: {},
      dangerPageList: {
        page: 1,
        size: 2
      },
      specialSchoolName: '',
      specialColumns,
      special: {},
      specialPageList: {
        page: 1,
        size: 2
      },
      formStatus: false
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
    ...mapActions('home', ['eduDailyPage', 'eduDangerPage', 'eduSpecialPage', 'getEduCode', 'underSchoolList']),
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
      this.undSchoolList = res.data.list.map(v => {
        return {
          schoolCode: v.schoolCode,
          schoolName: v.schoolName
        }
      })
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
      this.dailyList()
      this.dangerList()
      this.specialList()
    },
    // 查询巡检分页
    async dailyList() {
      const req = {
        ...this.dailyPageList,
        schoolList: this.undSchoolList,
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.dailySchoolName
      }
      const res = await this.eduDailyPage(req)
      this.daily = JSON.parse(JSON.stringify(res.data).replace(/schoolCode/g, 'id'))
    },
    // 查询隐患分页
    async dangerList() {
      const req = {
        schoolList: this.undSchoolList,
        ...this.dangerPageList,
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.dangerSchoolName
      }
      const res = await this.eduDangerPage(req)
      this.danger = JSON.parse(JSON.stringify(res.data).replace(/schoolCode/g, 'id'))
    },
    // 专项检查分页
    async specialList() {
      const req = {
        schoolList: this.undSchoolList,
        ...this.specialPageList,
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.specialSchoolName
      }
      const res = await this.eduSpecialPage(req)
      this.special = JSON.parse(JSON.stringify(res.data).replace(/schoolCode/g, 'id'))
    },
    // 预览
    goDetail(type, record) {
      this.formStatus = true
      const timeObj = {
        startYear: this.startValue.format('YYYY'),
        startMonth: this.startValue.format('M'),
        endYear: this.endValue.format('YYYY'),
        endMonth: this.endValue.format('M')
      }
      this.$refs.statisticsDetail.setData(type, record.id, timeObj, record.schoolName)
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
      padding-left: 15px;
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
    .table-all {
      width: 100%;
      height: 100%;
      .table-box {
        height: 100%;
        padding: 10px;
        background-color: #fff;
      }
    }
  }
}
</style>
