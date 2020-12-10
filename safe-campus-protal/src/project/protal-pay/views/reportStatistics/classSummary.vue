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
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学年',
    dataIndex: 'schoolYearName',
    width: '15%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '15%'
  },
  {
    title: '账单总金额',
    dataIndex: 'billMoneySum',
    width: '15%'
  },
  {
    title: '应收总金额',
    dataIndex: 'recMoneySum',
    width: '15%'
  },
  {
    title: '已缴费总金额',
    dataIndex: 'paidMoneySum',
    width: '15%'
  },
  {
    title: '未缴费总金额',
    dataIndex: 'unpaidMoneySum',
    width: '15%'
  }
]
const searchLabel = [
  {
    initValue: [],
    list: [],
    value: 'schoolYearName',
    type: 'select',
    label: '学年'
  }
]
export default {
  name: 'ClassSummary',
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
    this.getSchoolYearId()
  },
  methods: {
    ...mapActions('home', ['downdayBillList', 'getclassCollectList', 'getSchoolYear']),
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getclassCollectList(this.searchList)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    async getSchoolYearId() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (!res.data.list) {
        return
      }
      res.data.list.forEach(ele => {
        this.searchLabel[0].list.push({
          key: ele.id,
          val: ele.schoolYear
        })
      })
    },
    searchForm(values) {
      this.pageList.page = 1
      this.schoolYearName = values.schoolYearName
      const searchObj = {
        schoolYearName: this.schoolYearName
      }
      this.showList(searchObj)
    },
    exportClick() {
      const url = `${hostEnv.protal_api_10097}/classCollectStat/getClassStatExcel/${this.userInfo.schoolCode}`
      window.open(url)
    }
  }
}
</script>
<style lang="less" scoped></style>
