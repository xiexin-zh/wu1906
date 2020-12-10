<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columnList.subsidyColumns" :table-list="grantList">
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
import columnList from '../../assets/table/consumeColumns'
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    list: [],
    value: 'status',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'GrantRecord',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      total: 0,
      searchLabel,
      columnList,
      pageList: {
        page: 1,
        size: 20
      },
      rangeTime: [],
      searchObj: {},
      grantList: [],
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getDictList()
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getGrantList', 'exportGrantList', 'getDictList']),
    async exportClick() {
      await this.exportGrantList({
        name: '补助发放记录',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    async _getDictList() {
      this.searchLabel[2].list = []
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: 'subsidy_status'
      })
      res.rows.forEach((ele) => {
        this.searchLabel[2].list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      const index = this.columnList.subsidyColumns.findIndex(list => list.dataIndex === 'status')
      this.columnList.subsidyColumns[index].customRender = (text) => {
        return res.rows.filter(ele => ele.dictValue === text).length > 0 ? res.rows.filter(ele => ele.dictValue === text)[0].dictLabel : ''
      }
    },
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        userName: this.searchObj.userName,
        status: this.searchObj.status,
        beginTime: this.rangeTime[0] || '',
        endTime: this.rangeTime[1] || ''
      }
      this.searchList = req
      const res = await this.getGrantList(req)
      this.grantList = res.rows
      this.total = res.total
    },
    searchForm(values) {
      this.searchObj = values
      this.rangeTime = values.rangeTime
      this.showList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
