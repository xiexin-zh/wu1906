<template>
  <div class="school-detail page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基本信息"></u-detail-show>
    </u-space>
    <u-tabs v-model="activeTab" :tab-list="tabList"></u-tabs>
    <div class="u-fx-ver u-fx-f1">
      <div v-if="activeTab === '1'" class="u-fx u-fx-f1">
        <school-admin v-if="code" :schoolCode="code"></school-admin>
      </div>
      <div v-if="activeTab === '2'" class="u-fx u-fx-f1">
        <school-post v-if="code" :schoolCode="code"></school-post>
      </div>
      <div v-if="activeTab === '3'" class="u-fx u-fx-f1">
        <school-class v-if="code&&schoolType" :schoolType="schoolType" :schoolCode="code"></school-class>
      </div>
      <div v-if="activeTab === '4'" class="u-fx u-fx-f1">
        <school-student v-if="code&&schoolType" :schoolType="schoolType" :schoolCode="code"></school-student>
      </div>
      <div v-if="activeTab === '5'" class="u-fx u-fx-f1">
        <school-teacher v-if="code" :schoolCode="code"></school-teacher>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import SchoolAdmin from './SchoolAdmin'
import SchoolPost from './SchoolPost'
import SchoolClass from './SchoolClass'
import SchoolStudent from './SchoolStudent'
import SchoolTeacher from './SchoolTeacher'

export default {
  name: 'SchoolDetail',
  components: { SchoolAdmin, SchoolPost, SchoolClass, SchoolStudent, SchoolTeacher },
  data() {
    return {
      activeTab: '1',
      code: '', // 当前学校的code
      schoolType: '',
      tabList: [
        {
          key: '1',
          title: '管理员'
        },
        {
          key: '2',
          title: '部门信息'
        },
        {
          key: '3',
          title: '班级信息'
        },
        {
          key: '4',
          title: '学生信息'
        },
        {
          key: '5',
          title: '教职工信息'
        }
      ],
      detailInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.code = this.$route.query.schoolCode
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['getSchoolByCode']),
    // 获取数据列表
    async showDetail() {
      const res = await this.getSchoolByCode({ schoolCode: this.code })
      this.schoolType = res.data.schoolType
      this.detailInfo = {
        '学校名称': res.data.schoolName,
        '学校编码': res.data.schoolCode,
        '办学层次': this.getsection(res.data.sectionList.map(el => el.sectionType)),
        '学校类型': getDataState('schoolType', res.data.schoolType),
        '学校地址': res.data.area ? res.data.area.substring(3).replace(/,/g, '/') + ' ' + res.data.detailAddress : '',
        '创建时间': this.$tools.getDate(res.data.createTime),
        '备注': res.data.remark
      }
    },
    getsection(data) {
      const a = data.map(el => {
        return getDataState('sectionType', el)
      })
      const string = a.length === 1 ? a[0] : a.join(',')
      return string
    }
  }
}
</script>
<style lang="less" scoped>
</style>
