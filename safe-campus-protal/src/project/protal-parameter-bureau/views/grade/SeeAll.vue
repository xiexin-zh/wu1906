<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="search-form u-padd-t10 u-padd-b10 u-tips-color">
      <a-month-picker
        v-model="startValue"
        placeholder="请选择月份"
        :disabled-date="disabledStartMonth"
      />
      <a-button class="u-mar-l10" type="primary" @click="search()">搜索</a-button>
    </div>
    <table-list
      class="u-bg-fff"
      :page-list="pageList"
      :columns="schRankingColumns"
      :table-list="tableList"
    >
      <template v-slot:actions="action" class="u-fx">
        <div @click="undoneTaskCount(action.record)" class="text u-type-primary">查看</div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import moment from 'moment'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import { schRankingColumns } from '../../assets/js/tableColumns.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SeeAll',
  components: {
    TableList,
    PageNum
  },
  data() {
    return {
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      schoolList: [],
      schRankingColumns,
      tableList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getSchools()
    await this.showList()
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', [
      'gradeStatisPage',
      'underSchoolList'
    ]),
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
      this.schoolList = res.data.list.map(v => {
        return {
          schoolName: v.schoolName,
          schoolCode: v.schoolCode
        }
      })
    },
    // 月日期选择器
    disabledStartMonth(startValue) {
      if (startValue.valueOf() > new Date()) return true
    },
    search() {
      this.showList()
    },
    async showList() {
      const req = {
        ...this.pageList,
        eduCode: this.userInfo.schoolCode,
        year: this.startValue.format('YYYY'),
        month: this.startValue.format('M'),
        schoolList: this.schoolList
      }
      const res = await this.gradeStatisPage(req)
      this.tableList = res.data.records.map(el => {
        return {
          ...el,
          id: el.schoolCode
        }
      })
      this.total = res.data.total
    },
    // 查看考核详情
    undoneTaskCount(record, index) {
      this.$router.push({
        path: '/assessStatis/assessDetail',
        query: {
          schoolCode: record.schoolCode,
          month: this.startValue.format('M'),
          year: this.startValue.format('YYYY'),
          schoolName: record.schoolName,
          ultimateGrade: record.ultimateGrade,
          rank: record.rank
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.daily-statis{
  background-color: #f0f2f5;
  .content{
    height: calc(100% - 10px);
    // overflow-y: scroll;
    // overflow-x: hidden;
    .title{
      position: relative;
      .line{
        position: absolute;
        left:2px;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 4px;
        height: 13px;
        background: #9698D6;
      }
    }
    .schRanking{
      height: 100%;
      padding: 20px;
      padding-top: 10px;
      .list{
        height: 120px;
        img{
          width: 40px;
        }
      }
    }
  }
}
</style>
