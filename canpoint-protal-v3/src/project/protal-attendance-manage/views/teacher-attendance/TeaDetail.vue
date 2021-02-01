<template>
  <div class="apply-detail page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基础信息"></u-detail-show>
    </u-space>
    <u-tabs :tab-list="tabList" v-model="attendanceState"></u-tabs>
    <div class="u-fx-f1 u-fx-ver">
      <u-table :page-list="pageList" :columns="columns.detail" :table-list="totalList"></u-table>
      <u-pagination justify="end" v-model="pageList" :total="total" @change="_teaTotalDetail"></u-pagination>
    </div>
  </div>
</template>

<script>
import columns from '../../table-columns/student'
import { mapActions } from 'vuex'
const tabList = [
  {
    key: '5',
    title: '正常次数'
  },
  {
    key: '1',
    title: '迟到次数'
  },
  {
    key: '2',
    title: '早退次数'
  },
  {
    key: '3',
    title: '上班缺卡次数'
  },
  {
    key: '6',
    title: '下班缺卡次数'
  },
  {
    key: '7',
    title: '缺勤次数'
  }
]
export default {
  name: 'TeaDetail',
  components: {
  },
  data() {
    return {
      columns,
      tabList,
      detailInfo: {},
      pageList: {
        page: 1,
        size: 20
      },
      totalList: [],
      total: 0,
      attendanceState: '5'
    }
  },
  watch: {
    attendanceState(n, o) {
      if (n !== o) {
        this.pageList.page = 1
        this.pageList.size = 20
        this._teaTotalDetail()
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this._teaTotalDetail()
  },
  methods: {
    ...mapActions('home', ['teaTotalDetail']),
    async _teaTotalDetail() {
      this.pageList.userId = this.id
      this.pageList.attendanceState = this.attendanceState
      const res = await this.teaTotalDetail(this.pageList)
      this.totalList = res.data.pageInfo.list
      this.total = res.data.pageInfo.total
      this.detailInfo = {
        姓名: res.data.userName,
        部门: res.data.gradeName + res.data.className,
        统计日期: this.$tools.getDate(res.data.startDay)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
