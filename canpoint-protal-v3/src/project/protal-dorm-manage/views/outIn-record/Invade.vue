<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff">
        <u-alert message description="说明：学生、教职工出入非本人住宿的楼栋，以及陌生人出入宿舍时，记为入侵。"></u-alert>
        <u-search-form :search-label="invadesearchLabel" @search="search">
          <div slot="right" class="u-mar-l10">
            <u-download :reqObj="reqObj" title="导出" fileName="教职工" type="light"></u-download>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          :width="40"
          :height="40"
          is-zoom
          :page-list="pageList"
          :columns="invadeColumns"
          :table-list="userList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type >{{ getDataState('recordType',slotOne.record.recordType) }}</u-type>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import { invadeColumns } from '../../table-columns/outInRecord'
import { invadesearchLabel } from '../../search-columns/outInRecord'
export default {
  name: 'OutIn',
  components: {},
  data() {
    return {
      getDataState,
      invadesearchLabel,
      searchObj: {},
      reqObj: {
        url: '/protal_v3_11102/canpointDormAccess/intrusion/export',
        method: 'post'
      },
      lineChart: [], // 统计图
      userList: [],
      invadeColumns,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },
  created() {
    this.searchObj.schoolCode = this.schoolCode
    this.reqObj.params = Object.assign(this.searchObj, this.pageList)
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['invade']),
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList
      }
      const res = await this.invade(req)
      this.userList = res.data.records
      this.total = res.data.total
    },
    search(values) {
      this.searchObj.startTime = values.rangeTime && values.rangeTime[0]
      this.searchObj.endTime = values.rangeTime && values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList, values)
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
