<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="reportColumns" :table-list="dataList"></table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const reportColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '统计日期',
    dataIndex: 'stateDate',
    width: '10%'
  },
  {
    title: '档口',
    dataIndex: 'windowName',
    width: '10%'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '10%'
  },
  {
    title: '消费总金额',
    dataIndex: 'consumeAmount',
    width: '10%'
  },
  {
    title: '消费总次数',
    dataIndex: 'consumeCount',
    width: '10%'
  },
  {
    title: '脱机消费次数',
    dataIndex: 'offlineConsumeCount',
    width: '10%'
  }
]
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '统计日期'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'deviceId',
    type: 'select',
    label: '设备'
  }
]
export default {
  name: 'ViewReport',
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
      dataList: [],
      rangeTime: [],
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getMachineList()
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getStallStatistics', 'exportStallStatistics', 'getMachineList']),
    async exportClick() {
      await this.exportStallStatistics({
        name: '档口营业统计',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        beginTime: this.rangeTime[0] || undefined,
        endTime: this.rangeTime[1] || undefined,
        deviceId: this.deviceId
      }
      this.searchList = req
      const res = await this.getStallStatistics(req)
      this.dataList = res.rows
      this.total = res.total
    },
    searchForm(values) {
      console.log(values)
      this.rangeTime = values.rangeTime
      this.deviceId = values.deviceId
      this.showList()
    },
    async _getMachineList() {
      this.searchLabel[1].list = []
      const res = await this.getMachineList({
        pageNum: 1,
        pageSize: 9999,
        isOpen: '1'
      })
      res.rows.forEach((ele) => {
        this.searchLabel[1].list.push({
          key: ele.id,
          val: ele.deviceName
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
