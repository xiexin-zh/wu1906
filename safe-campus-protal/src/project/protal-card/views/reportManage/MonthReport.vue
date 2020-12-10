<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form @search-form="searchForm" :search-label="searchLabel">
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
import hostEnv from '@config/host-env'
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
    this.reportColumns[1].customRender = (text) => {
      return this.$tools.getDate(text, 3)
    }
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getCountList']),
    exportClick() {
      var url = `${hostEnv.hpb_card}/business/count/exportStatisticMouthList`
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          var content = this.response
          var aTag = document.createElement('a')
          var blob = new Blob([content])
          var headerName = xhr.getResponseHeader('Content-disposition')
          var fileName = decodeURIComponent(headerName).substring(20)
          aTag.download = fileName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(blob)
        }
      }
      xhr.send(JSON.stringify(this.searchList))
    },
    async showList() {
      const req = {
        ...this.pageList,
        createTime: this.rangeTime[0] || undefined,
        endTime: this.rangeTime[1] || undefined,
        countType: '2'
      }
      this.searchList = req
      const res = await this.getCountList(req)
      this.monthList = res.data.list
      this.total = res.data.total
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
