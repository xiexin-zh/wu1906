<template>
  <div class="student page-layout u-fx u-type-white-bg">
    <div class="layout-padd-t left-tree">
      <u-class-tree :school="schoolCode" @select="select" :key="index"></u-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form ref="searchForm" :search-label="searchLabel" @search="search" @reset="reset">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="addRoles(0)" type="primary">添加学生</u-button>
              <u-download hasIcon :reqObj="reqObj" title="导出" fileName="学生" type="light"></u-download>
              <u-button icon="import" @click="batch" type="light">批量导入</u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="schoolType === '8' || schoolType === '9' ? columnsH : columns"
          :table-list="roleList"
        >
          <template v-slot:actions="actions">
            <u-button type="link" @click="goDetail(actions.record)">详情</u-button>
            <u-button type="link" @click="addRoles(1, actions.record)">编辑</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination justify="end" v-model="pageList" :total="total" @change="_getStudentList"></u-pagination>
      </div>
    </div>
    <add-stu
      ref="addStu"
      v-model="visible"
      :title="title"
      :school="schoolCode"
      :schoolYearCode="searchObj.schoolYearCode"
      @update="_getStudentList"
    ></add-stu>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AddStu from '../../component/AddStu.vue'
import columns from '../../table-columns/student'
import columnsH from '../../table-columns/studentH'
import searchLabel from '../../search-columns/student'
import RoleTree from '@/components/common/RoleTree.vue'
export default {
  name: 'Student',
  components: {
    AddStu,
    RoleTree
  },
  data() {
    return {
      columns,
      columnsH,
      searchLabel,
      roleList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {},
      visible: false,
      title: '',
      schoolType: '',
      reqObj: {
        url: '/protal_v3_11101/canpointUserInfo/student/export',
        method: 'post'
      },
      roleId: '1',
      roleTag: false,
      index: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },
  mounted() {
    if (this.$route.query.type === 'fastAction') {
      this.title = '添加'
      this.visible = true
      this.$refs.addStu.schoolYearCode = this.schoolYear.code
    }
    if (this.$route.query.type === 'waitInfo') {
      this.searchObj.schoolYearCode = this.schoolYear.code
      if (this.$route.query.info === 'photo') {
        this.$refs.searchForm.form.setFieldsValue({ hasPhoto: '0' })
        this.searchObj.hasPhoto = false
      } else if (this.$route.query.info === 'parent') {
        this.$refs.searchForm.form.setFieldsValue({ hasBindParent: '0' })
        this.searchObj.hasBindParent = false
      } else if (this.$route.query.info === 'unclass') {
        this.$refs.searchForm.form.setFieldsValue({ hasClass: '0' })
        this.searchObj.hasClass = false
      }
      this._getStudentList()
    }
    this.schoolType = this.loginInfo.schoolType
  },
  methods: {
    ...mapActions('home', ['getStudentList', 'delTeacher', 'delTeachers']),
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = Object.assign(this.searchObj, value)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this._getStudentList()
    },
    // 获取数据列表
    async _getStudentList() {
      this.searchObj.schoolCode = this.schoolCode
      this.searchObj = Object.assign(this.searchObj, this.pageList)
      const res = await this.getStudentList(this.searchObj)
      this.roleList = res.data.records.map(el => {
        return {
          ...el,
          hasDorm: el.hasDorm ? '1' : '0'
        }
      })
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      values.hasDorm = values.hasDorm === '1' ? true : values.hasDorm === '0' ? false : ''
      values.hasPhoto = values.hasPhoto === '1' ? true : values.hasPhoto === '0' ? false : ''
      values.hasClass = values.hasClass === '1' ? true : values.hasClass === '0' ? false : ''
      values.hasBindParent = values.hasBindParent === '1' ? true : values.hasBindParent === '0' ? false : ''
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this._getStudentList()
    },
    // 添加/编辑角色  0-添加 1-编辑
    addRoles(type, record) {
      this.visible = true
      this.$refs.addStu.schoolYearCode = this.searchObj.schoolYearCode
      this.$refs.addStu.gradeCode = this.searchObj.gradeCode
      this.title = type ? '编辑' : '添加'
      this.$refs.addStu.appForm = type ? record : {}
      this.$refs.addStu.imgList = type ? [{ url: record.photoUrl }] : []
      this.$refs.addStu.classCode = type ? record.classCode : ''
      this.$refs.addStu.placeholder = type
        ? record.gradeName
          ? `${record.gradeName}/${record.majorName ? record.majorName + '/' + record.className : record.className}`
          : ''
        : '请选择'
      this.$refs.addStu.disabled = !!type
      this.$refs.addStu.appForm.hasDorm = type ? record.hasDorm : '0'
      this.$refs.addStu.appForm.gender = type ? record.gender : '1'
    },
    // 批量添加
    batch() {
      this.$router.push({
        path: '/batchImport',
        query: {
          type: 'student',
          status: '1',
          schoolYearCode: this.searchObj.schoolYearCode
        }
      })
    },
    // 详情
    goDetail(record) {
      this.$router.push({
        path: '/student/stuDetail',
        query: {
          code: record.userCode,
          schoolCode: record.schoolCode,
          schoolYearCode: this.searchObj.schoolYearCode,
          gradeCode: this.searchObj.gradeCode
        }
      })
    },
    reset() {
      this.index++
    }
  }
}
</script>
<style lang="less" scoped>
</style>
