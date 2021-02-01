<template>
  <div class="door-record page-layout u-fx-ver u-type-white-bg">
    <u-search-form class="u-padd-10" :search-label="doorRecordSearchLabel" @search="search" @reset="reset">
      <div slot="left">
        <u-download
          :reqObj="reqObj"
          title="导出"
          type="light"
          fileName="出入记录"
          fileType="xls"
        ></u-download>
      </div>
    </u-search-form>
    <div class="u-fx u-fx-f1">
      <u-table isZoom :page-list="pageList" :columns="doorRecordColumns" :table-list="recordList">
        <template v-slot:slotOne="slotOne">
          <u-type>{{ getDataState('accessType', slotOne.record.accessType) }}</u-type>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="_getRecordList"></u-pagination>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import { doorRecordSearchLabel, doorRecordColumns } from '../table-columns/doorRecord'
export default {
  name: 'DoorRecord',
  components: {
  },
  data() {
    return {
      getDataState,
      doorRecordSearchLabel,
      doorRecordColumns,
      reqObj: {
        url: '/protal_v3_10162/record/access/record/list/export',
        method: 'post',
        params: {}
      },
      recordList: [],
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear'])
  },
  mounted() {
    this._getRecordList()
  },
  methods: {
    ...mapActions('home', ['getRecordList']),
    // 列表查询
    async _getRecordList() {
      const res = await this.getRecordList({
        ...this.searchObj,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.schoolCode
      })
      this.recordList = res.data.list
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.searchObj = {
        ...values,
        startTime: values.rangeTime[0],
        endTime: values.rangeTime[1]
      }
      this.reqObj.params = this.searchObj
      this._getRecordList(this.searchObj)
    },
    // 重置搜索
    reset() {
      this.reqObj.params = {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>
