<template>
  <div class="school-student u-fx-f1 u-fx">
    <div class="u-fx-f1 u-fx-ver">
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="studentTable"
          :table-list="studentList"
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
        <u-pagination v-model="pageList" :total="total" @change="showList"></u-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { studentTable } from '../../../table-columns/schoolMge'

export default {
  name: 'SchoolClass',
  components: {
  },
  props: {
    schoolCode: {
      type: String,
      required: true
    },
    classCode: {
      type: String,
      required: true
    },
    schoolYearCode: {
      type: String,
      required: true
    },
    schoolType: {
      type: String,
      required: true
    },
    gradeCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      studentList: [],
      studentTable,
      pageList: { page: 1, size: 20 },
      total: 0,
      title: ''
    }
  },
  created() {
  },
  async mounted() {
    this.showList()
  },
  computed: {
  },
  methods: {
    ...mapActions('home', ['getStudentList']),
    // 获取班级列表
    async showList() {
      const req = {
        classCode: this.classCode,
        gradeCode: this.gradeCode,
        hasClassroom: '',
        hasHeadTeacher: '',
        headTeacherName: '',
        majorCode: '',
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYearCode,
        ...this.pageList
      }
      const res = await this.getStudentList(req)
      this.studentList = res.data.records
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
</style>
