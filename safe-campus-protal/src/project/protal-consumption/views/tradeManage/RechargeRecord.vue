<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columnList.rechargeColumns" :table-list="rechargeList">
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
    label: '充值时间'
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
  name: 'RechargeRecord',
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
      rechargeList: [],
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getDictList('recharge_status', 'status')
    this._getDictList('recharge_type', 'rechargeType')
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getRechargeList', 'exportRechargeList', 'getDictList']),
    async exportClick() {
      await this.exportRechargeList({
        name: '充值记录',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    async _getDictList(type, text) {
      const i = this.searchLabel.findIndex((list) => list.value === text)
      if (i !== -1) this.searchLabel[i].list = []
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: type
      })
      const list = []
      res.rows.forEach((ele) => {
        list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      if (i !== -1) {
        this.searchLabel[i].list = list
      }
      window.localStorage.setItem(type, JSON.stringify(list))
      const index = this.columnList.rechargeColumns.findIndex((list) => list.dataIndex === text)
      if (index !== -1) {
        this.columnList.rechargeColumns[index].customRender = (text) => {
          return res.rows.filter((ele) => ele.dictValue === text).length > 0
            ? res.rows.filter((ele) => ele.dictValue === text)[0].dictLabel
            : ''
        }
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
      const res = await this.getRechargeList(req)
      this.rechargeList = res.rows
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
