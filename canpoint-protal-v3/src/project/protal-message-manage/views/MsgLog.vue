<template>
  <div class="Note page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="msgLogSearchLabel" @search="search">
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        :page-list="pageList"
        is-check
        v-model="chooseList"
        :columns="msgLog"
        :table-list="recordList"
      >
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { msgLog } from '../table-columns/tableColumns'
import { msgLogSearchLabel } from '../search-columns/searchColumns'
export default {
  name: 'MsgLog',
  components: {},
  data() {
    return {
      title: '添加',
      formStatus: false,
      msgLogSearchLabel,
      msgLog,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      searchObj: {},
      recordList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getList()
  },
  methods: {
    ...mapActions('home', ['pageMsgLog']),
    async getList() {
      const req = {
        ...this.pageList,
        ...this.searchObj
      }
      const res = await this.pageMsgLog(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    search(values) {
      this.searchObj = values
      this.searchObj.startDate = values.date[0] || ''
      this.searchObj.endDate = values.date[1] || ''
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
