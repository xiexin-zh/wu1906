<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList"></table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '统计日期',
    dataIndex: 'statDate',
    width: '17%'
  },
  {
    title: '已缴费账单数',
    dataIndex: 'paidSum',
    width: '17%'
  },
  {
    title: '已缴费金额',
    dataIndex: 'paidMoneySum',
    width: '17%'
  },
  {
    title: '已逾期账单数',
    dataIndex: 'overdueSum',
    width: '17%'
  },
  {
    title: '已逾期金额',
    dataIndex: 'overdueMoneySum',
    width: '17%'
  }
]
const searchLabel = [
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '统计时间'
  }
]
export default {
  name: 'ChargeDay',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        schoolCode: ''
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['downdayBillList', 'getdayBillList']),
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getdayBillList(this.searchList)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.statStartTime = values.rangeTime ? values.rangeTime[0] : ''
      this.endStartTime = values.rangeTime ? values.rangeTime[1] : ''
      const searchObj = {
        statStartTime: this.statStartTime,
        endStartTime: this.endStartTime
      }
      this.showList(searchObj)
    },
    exportClick() {
      const url = `${hostEnv.protal_api_10097}/dayBillStat/getDayBillStatExcel/${this.userInfo.schoolCode}`
      window.open(url)
    }
  }
}
</script>
<style lang="less" scoped></style>
