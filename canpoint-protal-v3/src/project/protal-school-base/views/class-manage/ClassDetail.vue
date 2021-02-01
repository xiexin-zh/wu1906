<template>
  <div class="class-detail page-layout u-fx-ver u-type-white-bg">
    <add-stu
      ref="addStu"
      v-model="visible"
      title="添加学生"
      :school="schoolCode"
      :schoolYearCode="schoolYearCode"
      @update="update"
    ></add-stu>
    <u-choose-student
      is-check
      hasAddTag
      ref="chooseStudentRef"
      v-if="showTag"
      v-model="showTag"
      :schoolCode="schoolCode"
      :bindList="bindList"
      @submit="submit"
      @toAddStudent="toAddStudent"
    ></u-choose-student>
    <u-submit-form
      ref="form"
      :width="600"
      @submit="submitClass"
      title="转班"
      v-model="formStatus"
      :form-data="studentForm"
    >
      <div slot="slotOne">
        <choose-high-grade v-if="schoolType" :school="schoolCode" @choose="selectOrg"></choose-high-grade>
        <choose-grade
          v-else
          :school="schoolCode"
          :schoolYearCode="schoolYearCode"
          @choose="selectOrg"
        ></choose-grade>
      </div>
    </u-submit-form>
    <div class="layout-padd">
      <u-detail-show :detail-info="detailInfo" :title="title"></u-detail-show>
    </div>
    <u-tabs v-model="currentkey" :tab-list="tabList">
      <u-search-form :search-label="studentSearch" @search="search">
        <div slot="right" class="layout-padd-r">
          <u-space>
            <u-button icon="import" type="light" class="u-mar-l" @click="batch">批量导入</u-button>
            <u-button icon="plus" type="primary" @click="chooseStudent">添加学生</u-button>
          </u-space>
        </div>
      </u-search-form>
    </u-tabs>
    <u-space class="u-fx-ac u-choose-item u-mar-b">
      已选择 {{ chooseList.length }} 项数据
      <u-button type="primary" @click="change('3', 0)">批量转班</u-button>
      <u-button
        @click="change('2', 0)"
        :disabled="chooseList.length === 0"
        type="danger"
        delete
      >批量移除</u-button>
    </u-space>
    <u-table
      is-check
      is-zoom
      :page-list="pageList"
      v-model="chooseList"
      :columns="studentTable"
      :table-list="userList"
    >
      <template v-slot:actions="actions">
        <u-button type="link" @click="goDetail(actions.record)">详情</u-button>
        <u-button type="link" @click="change('3', 1, actions.record)">转班</u-button>
        <u-button type="link" delete @click="change('2', 1, actions.record)">移除班级</u-button>
      </template>
    </u-table>
    <u-pagination :total="total" v-model="pageList" @change="_getStudentList"></u-pagination>
  </div>
</template>

<script>
import AddStu from '../../component/AddStu.vue'
import ChooseGrade from '../../component/ChooseGrade'
import ChooseHighGrade from '../../component/ChooseHighGrade'
import studentSearch from '../../search-columns/class'
import studentTable from '../../table-columns/class'
import studentForm from '../../submit-columns/class'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ClassDetail',
  components: {
    AddStu,
    ChooseGrade,
    ChooseHighGrade
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear', 'loginInfo'])
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      chooseList: [],
      userList: [],
      studentTable,
      studentSearch,
      title: '班级信息',
      detailInfo: {},
      currentkey: '1',
      tabList: [
        {
          key: '1',
          title: '班级学生'
        }
      ],
      searchObj: {},
      formStatus: false,
      studentForm,
      oldStuInfo: {},
      newStuInfo: [],
      schoolType: false,
      showTag: false,
      bindList: [],
      visible: false,
      schoolYearCode: ''
    }
  },
  created() {
    this.schoolType = this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9'
    this.gradeCode = this.$route.query.gradeCode
    this.classCode = this.$route.query.classCode
    this.schoolYearCode = this.$route.query.schoolYearCode
    this._getStudentList()
    this._getClassInfo()
  },
  methods: {
    ...mapActions('home', ['getStudentList', 'getClassInfo', 'stuChange']),
    /**
     * 查询班级详情
     */
    async _getClassInfo() {
      const res = await this.getClassInfo({
        classCode: this.classCode,
        schoolYearCode: this.schoolYearCode,
        schoolCode: this.schoolCode
      })
      const data = res.data
      this.classInfo = res.data
      if (this.schoolType) {
        this.detailInfo = {
          年级: data.gradeName,
          专业: data.majorName,
          班级: data.className,
          辅导员: data.headTeacherList.reduce((prev, curr) => {
            return prev + curr.userName + ','
          }, ''),
          教室: data.placeName,
          班级学生: data.studentCount,
          备注: data.remark
        }
      } else {
        this.detailInfo = {
          年级: data.gradeName,
          班级: data.majorName + data.className,
          班主任: data.headTeacherList.reduce((prev, curr) => {
            return prev + curr.userName + ','
          }, ''),
          教室: data.placeName,
          班级学生: data.studentCount,
          // 任课老师: data.studentCount,
          备注: data.remark
        }
      }
    },
    /**
     * 获取学信息
     */
    async _getStudentList(searchObj = {}) {
      const res = await this.getStudentList({
        ...searchObj,
        ...this.pageList,
        classCode: this.classCode,
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYearCode,
        gradeCode: this.gradeCode
      })
      this.userList = res.data.records.map(el => {
        return {
          ...el,
          id: el.userCode
        }
      })
      this.total = res.data.total
      this.oldStuInfo = res.data.records[0]
    },
    // 查询
    search(values) {
      values.hasDorm = values.hasDorm === '1' ? true : values.hasDorm === '0' ? false : ''
      values.hasPhoto = values.hasPhoto === '1' ? true : values.hasPhoto === '0' ? false : ''
      values.hasBindParent = values.hasBindParent === '1' ? true : values.hasBindParent === '0' ? false : ''
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = Object.assign(this.searchObj, values)
      this._getStudentList(this.searchObj)
    },
    // 转班弹框
    change(string, type, record) {
      if (!type && this.chooseList.length === 0) {
        this.$message.warning('请选择学生')
        return
      }
      this.optType = string
      if (type) {
        this.oldStuInfo = record
      }
      this.chooseList = type ? [this.oldStuInfo.userCode] : this.chooseList
      string === '2' ? this.submitClass() : (this.formStatus = true)
    },
    // 选择班级
    selectOrg(value, info) {
      this.newStuInfo = info
    },
    // 转班提交
    async submitClass() {
      try {
        const req = {
          optType: this.optType, // 操作类型 1:加入班级 2：移出班级 3：转班
          userCodes: this.chooseList,
          schoolCode: this.schoolCode,
          oldClassCode: this.oldStuInfo.classCode,
          oldClassName: this.oldStuInfo.className,
          oldGradeCode: this.oldStuInfo.gradeCode,
          oldGradeName: this.oldStuInfo.gradeName,
          oldMajorCode: this.oldStuInfo.majorCode,
          oldMajorName: this.oldStuInfo.majorName,
          newGradeCode:
            this.optType === '1' ? this.newStuInfo[0].gradeCode : this.optType === '3' ? this.newStuInfo[0].value : '',
          newGradeName:
            this.optType === '1' ? this.newStuInfo[0].gradeName : this.optType === '3' ? this.newStuInfo[0].label : '',
          newMajorCode:
            this.optType === '1'
              ? this.newStuInfo[0].majorCode
              : this.optType === '3' && this.schoolType
              ? this.newStuInfo[1].value
              : '',
          newMajorName:
            this.optType === '1'
              ? this.newStuInfo[0].majorName
              : this.optType === '3' && this.schoolType
              ? this.newStuInfo[1].label
              : '',
          newClassCode:
            this.optType === '1'
              ? this.newStuInfo[0].classCode
              : this.optType === '3' && this.schoolType
              ? this.newStuInfo[2].value
              : this.optType === '3' && !this.schoolType
              ? this.newStuInfo[1].value
              : '',
          newClassName:
            this.optType === '1'
              ? this.newStuInfo[0].className
              : this.optType === '3' && this.schoolType
              ? this.newStuInfo[2].value
              : this.optType === '3' && !this.schoolType
              ? this.newStuInfo[1].label
              : ''
        }
        await this.stuChange(req)
        this.$refs.form.reset()
        this.$tools.message('success', `${this.optType === '1' ? '加入' : this.optType === '2' ? '移除' : '转班'}成功`)
        this.chooseList = []
        this.$tools.goNext(() => {
          this._getClassInfo()
          this._getStudentList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 批量导入
    batch() {
      this.$router.push({
        path: '/batchImport',
        query: {
          type: 'student',
          status: '0', // 不展示选择班级年级
          classCode: this.classCode,
          schoolYearCode: this.schoolYearCode
        }
      })
    },
    // 详情
    goDetail(record) {
      this.$router.push({
        path: '/classManage/classDetail/stuDetail',
        query: {
          code: record.userCode,
          gradeCode: this.gradeCode,
          schoolCode: record.schoolCode,
          schoolYearCode: this.schoolYearCode
        }
      })
    },
    // 选取学生弹框
    chooseStudent() {
      this.optType = '1'
      this.oldStuInfo = {}
      this.bindList = this.userList
      this.showTag = true
    },
    // 学生添加提交
    submit(value) {
      this.chooseList = value.map(el => el.userCode)
      this.newStuInfo = [this.classInfo]
      this.submitClass()
      this.$refs.chooseStudentRef.reset()
    },
    // 添加学生弹框
    toAddStudent() {
      this.$refs.chooseStudentRef.reset()
      this.visible = true
      this.$refs.addStu.disabled = true
      this.$refs.addStu.placeholder = `${this.classInfo.gradeName}/${
        this.classInfo.majorName ? this.classInfo.majorName + '/' + this.classInfo.className : this.classInfo.className
      }`
    },
    update() {
      this._getClassInfo()
      this._getStudentList()
    }
  }
}
</script>
<style lang="less" scoped></style>
