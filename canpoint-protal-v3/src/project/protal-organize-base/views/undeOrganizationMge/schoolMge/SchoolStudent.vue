<template>
  <div class="school-student page-layout u-fx u-type-white-bg">
    <u-class-tree :school="schoolCode" @select="select"></u-class-tree>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="searchStudent" @search="search">
        </u-search-form>
      </u-space>
      <u-table
        is-zoom
        :page-list="pageList"
        :columns="schoolType === '8' || schoolType === '9' ? tableSchoolStudentH : tableSchoolStudent"
        :table-list="classList"
      >
        <template v-slot:slotOne="slotOne">
          <u-tag type="primary-bd" pointer>{{ slotOne.record.studentCount }}</u-tag>
        </template>
        <template v-slot:slotThree="slotThree">
          <u-tag type="primary-bd" pointer>{{ slotThree.record.studentCount }}</u-tag>
        </template>
      </u-table>
      <u-pagination v-model="pageList" :total="total" @change="_getStudentList"></u-pagination>

    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { searchStudent } from '../../../search-columns/searchColumns'
import { tableSchoolStudent, tableSchoolStudentH } from '../../../table-columns/schoolMge'
export default {
  name: 'SchoolStudent',
  components: {
    searchStudent
  },
  props: {
    // 学校code
    schoolCode: {
      type: String,
      required: true
    },
    // 学校code
    schoolType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchStudent,
      tableSchoolStudent,
      tableSchoolStudentH,
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
      'getStudentList'
      ]),
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = Object.assign(this.searchObj, values)
      this._getStudentList()
    },
    // 班级树回调
    select(values) {
      this.searchObj = Object.assign(this.searchObj, values)
      this._getStudentList()
    },
    // 获取学生列表
    async _getStudentList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getStudentList(req)
      this.classList = res.data.records
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
</style>
