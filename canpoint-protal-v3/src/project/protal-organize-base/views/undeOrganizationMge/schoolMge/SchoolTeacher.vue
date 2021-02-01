<template>
  <div class="school-admin u-fx-f1 u-fx">
    <u-org-post :school="schoolCode" @select="select"></u-org-post>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="searchTeacher" @search="search">
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="tableSchoolTeacher"
          :table-list="classList"
        >
          <template v-slot:slotOne="slotOne">
            <u-tag type="primary-bd" pointer>{{ slotOne.record.studentCount }}</u-tag>
          </template>
          <template v-slot:slotThree="slotThree">
            <u-tag type="primary-bd" pointer>{{ slotThree.record.studentCount }}</u-tag>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="detail(actions.record.classCode)">详情</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination v-model="pageList" :total="total" @change="_getTeacherList"></u-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { searchTeacher } from '../../../search-columns/searchColumns'
import { tableSchoolTeacher } from '../../../table-columns/schoolMge'
export default {
  name: 'SchoolTeacher',
  components: {
    searchTeacher
  },
  props: {
    // 学校code
    schoolCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchTeacher,
      tableSchoolTeacher,
      classList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {}
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    ...mapActions('home', [
      'getTeacherList'
      ]),
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = values
      this._getTeacherList()
    },
    // 班级树回调
    select(value) {
      this.searchObj.orgCode = value.type === '1' ? value.code : ''
      this.searchObj.stationCode = value.type === '2' ? value.code : ''
      this._getTeacherList()
    },
    // 获取学生列表
    async _getTeacherList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getTeacherList(req)
      this.classList = res.data.records
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
</style>
