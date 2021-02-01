<template>
  <div class="visitor-record page-layout u-fx-ver u-type-white-bg">
    <u-drawer :is-confirm="false" title="详情" v-model="visible" :width="350">
      <visitor-detail :record-detail="recordDetail"></visitor-detail>
    </u-drawer>
    <div class="layout-padd">
      <u-search-form :search-label="recordSearch" @search="search">
        <div slot="left">
          <u-download title="导出" :fileType="fileType" :fileName="fileName" :reqObj="reqObj"></u-download>
        </div>
      </u-search-form>
    </div>
    <u-table :page-list="pageList" :columns="recordTable" :table-list="recordList">
      <template v-slot:slotTwo="slotTwo">
        <u-type>{{ getDataState('approvalStatus', slotTwo.record.state) }}</u-type>
      </template>
      <template v-slot:slotThree="slotThree">
        <u-type>{{ getDataState('visitState', slotThree.record.visitState) }}</u-type>
      </template>
      <template v-slot:actions="actions">
        <u-button type="link" @click="goDetail(actions.record)">详情</u-button>
      </template>
    </u-table>
    <u-pagination :total="total" v-model="pageList" @change="change"></u-pagination>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import recordTable from '../table-columns/record'
import recordSearch from '../search-columns/record'
import VisitorDetail from '../component/VisitorDetial'
export default {
  name: 'VisitorRecord',
  components: { VisitorDetail },
  data() {
    return {
      getDataState,
      fileType: 'xls',
      fileName: '访客记录',
      reqObj: {
        url: `/protal_v3_10160/invite/appoint/access/downloadExcel`,
        method: 'post',
        params: {
          schoolCode: 'CANPOINTLIVE',
          name: '访客记录'
        }
      },
      recordTable,
      recordSearch,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      recordList: [],
      visible: false,
      recordDetail: {},
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._visitorRecord()
  },
  methods: {
    ...mapActions('home', ['visitorRecord']),
    /**
     * 访客记录
     */
    async _visitorRecord() {
      const res = await this.visitorRecord({
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: 'CANPOINTLIVE',
        ...this.searchObj
      })
      this.recordList = res.data.list
      this.total = res.data.total
    },
    /**
     * 搜索
     */
    search(values) {
      if (values.rangeTime) {
        values.inStartTime = values.rangeTime[0]
        values.inEndTime = values.rangeTime[1]
      }
      delete values.rangeTime
      this.searchObj = values
      this.reqObj.params = {
        schoolCode: 'CANPOINTLIVE',
        name: '访客记录',
        ...values
      }
      this._visitorRecord(values)
    },
    change() {
      this._visitorRecord()
    },
    /**
     * 查看详情
     * @param { object } record 记录详情
     */
    goDetail(item) {
      this.recordDetail = item
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
