<template>
  <div class="class-detail page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基本信息"></u-detail-show>
    </u-space>
    <u-tabs v-model="activeTab" :tab-list="tabList"></u-tabs>
    <div class="u-fx-ver u-fx-f1">
      <div v-if="activeTab === '1'" class="u-fx u-fx-f1">
        <class-student
          v-if="schoolCode"
          :classCode="classCode"
          :schoolType="schoolType"
          :schoolCode="schoolCode"
          :gradeCode="gradeCode"
          :schoolYearCode="schoolYearCode"></class-student>
      </div>
      <div v-if="activeTab === '2'" class="u-fx u-fx-f1">
        <class-ude-teacher :classCode="classCode" :schoolYearCode="schoolYearCode"></class-ude-teacher>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ClassStudent from './ClassStudent'
import ClassUdeTeacher from './ClassUdeTeacher'

export default {
  name: 'ClassDetail',
  components: { ClassStudent, ClassUdeTeacher },
  data() {
    return {
      activeTab: '1',
      tabList: [
        {
          key: '1',
          title: '班级学生'
        },
        {
          key: '2',
          title: '任课老师'
        }
      ],
      schoolCode: '', // 当前学校code
      schoolYearCode: '', // 当前学年
      classCode: '', // 当前班级的code
      gradeCode: '', // 年级编码
      schoolType: '',
      pageList: { page: 1, size: 20 },
      detailInfo: {}
    }
  },
  computed: {
    // ...mapState('home', ['schoolCode'])
  },
  created() {
    this.classCode = this.$route.query.classCode
    this.schoolCode = this.$route.query.schoolCode
    this.schoolYearCode = this.$route.query.schoolYearCode
    this.schoolType = this.$route.query.schoolType
    this.schoolType = this.$route.query.schoolType
    this.gradeCode = this.$route.query.gradeCode
  },
  async mounted() {
    await this.showDetail()
  },
  methods: {
    ...mapActions('home', ['getSchoolByCode', 'getClassDetail']),
    // 获取数据列表
    async showDetail() {
      const req = {
        classCode: this.classCode,
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYearCode,
        schoolType: this.schoolType
      }
      const res = await this.getClassDetail(req)
      this.detailInfo = {
        '学年': res.data.schoolYearName,
        '年级': res.data.gradeName,
        '班级': res.data.className,
        '班主任': res.data.headTeacherList.map(el => el.userName).join('，') || '',
        '教室': res.data.placeName,
        '班级学生': res.data.studentCount,
        '任课老师': '暂无教师',
        '备注': res.data.remark
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
