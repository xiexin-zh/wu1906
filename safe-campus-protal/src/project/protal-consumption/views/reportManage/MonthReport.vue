<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="reportColumns" :table-list="monthList">
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import reportColumns from '../../assets/table/reportColumns'
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '统计月份'
  }
]
export default {
  name: 'MonthRecord',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      total: 0,
      reportColumns,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      monthList: [],
      rangeTime: [],
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getMonthStatistics', 'exportMonthStatistics']),
    async exportClick() {
      await this.exportMonthStatistics({
        name: '营业月统计',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        beginTime: this.rangeTime[0] || undefined,
        endTime: this.rangeTime[1] || undefined
      }
      this.searchList = req
      const res = await this.getMonthStatistics(req)
      this.monthList = res.rows
      this.total = res.total
    },
    searchForm(values) {
      console.log(values)
      this.rangeTime = values.rangeTime
      this.showList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
