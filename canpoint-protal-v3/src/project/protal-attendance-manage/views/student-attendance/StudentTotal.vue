<template>
  <div class="student-record page-layout u-fx u-type-white-bg">
    <div class="layout-padd-t left-tree">
      <u-class-tree :school="schoolCode" @select="select" :key="index"></u-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form ref="searchForm" :search-label="searchLabel.total" @search="search" @reset="reset">
          <div slot="left">
            <u-space>
              <u-download hasIcon :reqObj="reqObj" title="导出" type="light" fileName="学生考勤统计导出"></u-download>
            </u-space>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="columns.total"
          :table-list="totalList"
        >
          <template v-slot:actions="action">
            <u-button type="link" @click="goDetial(action)">详情</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination justify="end" v-model="pageList" :total="total" @change="_getStuTotal"></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/student'
import searchLabel from '../../search-columns/student'
export default {
  name: 'StudentTotal',
  components: {
  },
  data() {
    return {
      getDataState,
      columns,
      searchLabel,
      totalList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {},
      visible: false,
      title: '',
      roleId: '1',
      roleTag: false,
      index: 0,
      reqObj: {
        url: '/protal_v3_11004/student/static/list/export',
        method: 'get'
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
  },
  mounted() {
    this.schoolType = this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9'
  },
  methods: {
    ...mapActions('home', ['getStuTotal', 'delTeacher', 'delTeachers']),
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = Object.assign(this.searchObj, value)
      this.reqObj.url =
      `/protal_v3_11004/student/static/list/export?schoolCode=${this.schoolCode}&startDay=${this.searchObj.startDay}&endDay=${this.searchObj.endDay}&searchKey=${this.searchObj.searchKey}&schoolYearCode=${this.schoolType ? this.searchObj.gradeCode : this.searchObj.schoolYearCode}&gradeCode=${this.schoolType ? this.searchObj.majorCode : this.searchObj.gradeCode}&classCode=${this.searchObj.classCode}`
      console.log(this.reqObj.url)
      this._getStuTotal()
    },
    // 获取数据列表
    async _getStuTotal() {
      this.searchObj.schoolCode = this.schoolCode
      this.searchObj = Object.assign(this.searchObj, this.pageList)
      const res = await this.getStuTotal(this.searchObj)
      this.totalList = res.data.list
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      values.startDay = values.rangeTime[0]
      values.endDay = values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.url = `/protal_v3_11004/student/static/list/export?schoolCode=${this.schoolCode}&startDay=${this.searchObj.startDay}&endDay=${this.searchObj.endDay}&searchKey=${this.searchObj.searchKey}&schoolYearCode=${this.schoolType ? this.searchObj.gradeCode : this.searchObj.schoolYearCode}&gradeCode=${this.schoolType ? this.searchObj.majorCode : this.searchObj.gradeCode}&classCode=${this.searchObj.classCode}`
      this._getStuTotal()
    },
    reset() {
      this.index++
    },
    goDetial(record) {
      this.$router.push({
        path: '/studentTotal/stuDetail',
        query: {
          id: record.record.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
