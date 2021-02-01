<template>
  <div class="teacher-total page-layout u-fx u-type-white-bg">
    <div class="left-tree">
      <u-org-post :school="schoolCode" @select="select" :key="index"></u-org-post>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form ref="searchForm" :search-label="searchLabel.total" @search="search" @reset="reset">
          <div slot="left">
            <u-space>
              <u-download hasIcon :reqObj="reqObj" title="导出" fileName="教职工考勤统计导出" type="light"></u-download>
              <!-- <u-button icon="export" type="primary" @click="exportClick">导出</u-button> -->
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
        <u-pagination justify="end" v-model="pageList" :total="total" @change="_getTeaTotal"></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/teacher'
import searchLabel from '../../search-columns/teacher'
export default {
  name: 'TeacherTotal',
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
      searchObj: {
        startDay: '',
        endDay: '',
        searchKey: ''
      },
      visible: false,
      title: '',
      roleId: '1',
      roleTag: false,
      index: 0,
      reqObj: {
        url: '/protal_v3_11004/teacher/static/list/export',
        method: 'get'
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
  },
  methods: {
    ...mapActions('home', ['getTeaTotal', 'delTeacher', 'delTeachers']),
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj.orgCode = value.type === '1' ? value.code : ''
      this.searchObj.jobCode = value.type === '2' ? value.code : ''
      this.reqObj.url = `/protal_v3_11004/teacher/static/list/export?schoolCode=${this.schoolCode}&startDay=${this.searchObj.startDay}&endDay=${this.searchObj.endDay}&searchKey=${this.searchObj.searchKey}&orgCode=${this.searchObj.orgCode}&jobCode=${this.searchObj.jobCode}`
      this._getTeaTotal()
    },
    // 获取数据列表
    async _getTeaTotal() {
      this.searchObj.schoolCode = this.schoolCode
      this.searchObj = Object.assign(this.searchObj, this.pageList)
      const res = await this.getTeaTotal(this.searchObj)
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
      this.reqObj.url = `/protal_v3_11004/teacher/static/list/export?schoolCode=${this.schoolCode}&startDay=${this.searchObj.startDay}&endDay=${this.searchObj.endDay}&searchKey=${this.searchObj.searchKey}&orgCode=${this.searchObj.orgCode}&jobCode=${this.searchObj.jobCode}`
      this._getTeaTotal()
    },
    reset() {
      this.index++
    },
    goDetial(record) {
      this.$router.push({
        path: '/teacherTotal/teaDetail',
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
