<template>
  <div class="school-class page-layout u-type-white-bg u-fx">
    <u-class-tree :school="schoolCode" @select="select"></u-class-tree>
    <div class="u-fx-f1 u-fx-ver">
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="columns"
          :table-list="classList"
        >
          <template v-slot:slotOne="slotOne">
            <u-tag type="primary-bd" pointer>{{ slotOne.record.studentCount }}</u-tag>
          </template>
          <template v-slot:slotThree="slotThree">
            <u-tag type="primary-bd" pointer>{{ slotThree.record.studentCount }}</u-tag>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="detail(actions.record)">详情</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination v-model="pageList" :total="total" @change="showList"></u-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import columns from '../../../table-columns/classManage'
export default {
  name: 'SchoolClass',
  components: {
  },
  props: {
    // 学校code
    schoolCode: {
      type: String,
      required: true
    },
    schoolType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      columns,
      classList: [],
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    ...mapActions('home', [
      'getClassList'
      ]),
    // 班级树回调
    select(value) {
      this.schoolYearCode = value.schoolYearCode
      this.gradeCode = value.gradeCode || ''
      this.showList()
    },
    // 获取班级列表
    async showList() {
      const res = await this.getClassList({
        classCode: '',
        gradeCode: this.gradeCode,
        hasClassroom: '',
        hasHeadTeacher: '',
        headTeacherName: '',
        majorCode: '',
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYearCode || '',
        ...this.pageList
      })
      this.classList = res.data.records
      this.total = res.data.total
    },
    // 详情
    detail(record) {
      const { classCode, gradeCode } = record
      this.$router.push({
        path: '/school/classDetail',
        query: {
          schoolCode: this.schoolCode,
          classCode: classCode,
          schoolYearCode: this.schoolYearCode,
          schoolType: this.schoolType,
          gradeCode: gradeCode
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
