<template>
  <div class="class-detail page-layout qui-fx-ver">
    <choose-high
      ref="chooseUser"
      is-check
      no-bind
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      @toAdd="toAdd"
      hasAdd
      title="添加学生"
    ></choose-high>
    <new-student
      title="添加学生"
      ref="newStudent"
      :classData="classInfo"
      @closeModel="closeModel"
    ></new-student>
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="highDetail.formData"
    ></sub-form>
    <detail-show :col="8" :detail-info="detailInfo" :title="infoTitle"></detail-show>
    <div class="u-bd-b qui-fx-ac qui-fx-jsb u-padd-r20">
      <div class="title">班级学生</div>
      <search-form isReset @search-form="searchForm" :search-label="highDetail.searchLabel" style="padding: 0">
        <div slot="right">
          <a-button icon="plus" class="add-btn mar-l10" @click="addStudent">添加学生</a-button>
          <a-button icon="export" class="export-all-btn" @click.stop="goAdd">批量导入</a-button>
          <a-button icon="export" class="export-btn" @click.stop="moveClass(0)">批量转班</a-button>
          <a-button icon="delete" class="power-action-btn" @click.stop="dels">批量移出</a-button>
        </div>
      </search-form>
    </div>
    <!-- <a-tabs>
      <a-tab-pane tab="班级学生" key="1"> </a-tab-pane>
      <div slot="tabBarExtraContent" class="qui-fx-ac mar-r10">
        <search-form isReset @search-form="searchForm" :search-label="highDetail.searchLabel" style="padding: 0">
          <div slot="right">
            <a-button icon="plus" class="add-btn mar-l10" @click="addStudent">添加学生</a-button>
            <a-button icon="export" class="export-all-btn" @click.stop="goAdd">批量导入</a-button>
            <a-button icon="export" class="export-btn" @click.stop="moveClass(0)">批量转班</a-button>
            <a-button icon="delete" class="power-action-btn" @click.stop="dels">批量移出</a-button>
          </div>
        </search-form>
      </div>
    </a-tabs> -->
    <div class="content qui-fx-ver qui-fx-f1">
      <div class="table qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          is-zoom
          :page-list="pageList"
          v-model="chooseList"
          :columns="highDetail.columns"
          :table-list="studentsList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="goLead('/basedata/HighStuDetail', action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="转班">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="moveClass(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="del(action.record)"
            >
              <template slot="title">您确定移除吗?</template>
              <a-tooltip placement="topLeft" title="移除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="_getHighStu"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DetailShow from '@c/DetailShow'
import NewStudent from '../components/NewStudent'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import SubForm from '../components/SubForm'
import PageNum from '@c/PageNum'
import ChooseHigh from '../components/ChooseHigh'
import highDetail from '../../assets/js/table/highDetail.js'

export default {
  name: 'HighDetail',
  components: {
    TableList,
    SearchForm,
    SubForm,
    PageNum,
    ChooseHigh,
    DetailShow,
    NewStudent
  },
  data() {
    return {
      highDetail,
      title: '转班',
      formStatus: false,
      studentsList: [],
      confirmLoading: false,
      dialogTag: false,
      keywords: '',
      userTag: false,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classInfo: {},
      record: null,
      detailInfo: [
        {
          key: '年级',
          val: ''
        },
        {
          key: '专业',
          val: ''
        },
        {
          key: '班级',
          val: ''
        },
        {
          key: '辅导员',
          val: ''
        },
        {
          key: '教室',
          val: ''
        },
        {
          key: '班级学生',
          val: ''
        },
        {
          key: '备注',
          val: ''
        }
      ],
      infoTitle: '基础信息',
      chooseList: [],
      searchList: {},
      highSubList: [],
      highSubTerm: [],
      highClass: [],
      classDetail: {},
      type: 0,
      gradeName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.highDetail.formData[0].firstChange = this.firstChange
    this.highDetail.formData[0].secondChange = this.secondChange
    this.searchList.subjectCode = this.$route.query.subjectCode
    this.searchList.gradeCode = this.$route.query.gradeCode
    this.searchList.classCode = this.$route.query.classCode
  },
  mounted() {
    this._getHighStu()
    this.showClassDetail()
    this.getGrade()
  },
  methods: {
    ...mapActions('home', [
      'highClassDetail', 'getHighStu', 'getHighClass', 'getHighGradeSub', 'getHighTerm', 'highStuRemove',
      'highStusRemove', 'highStusChange', 'highStuChange', 'highStuJoin', 'getClassTeacherList', 'getHighGrade'
    ]),
    // 获取年级
    async getGrade() {
      this.highDetail.formData[0].firstList = []
      const res = await this.getHighGrade({ schoolCode: this.userInfo.schoolCode })
      this.highSubTerm = res.data
      if (res.data.length === 0) {
        this.highDetail.formData[0].initValue1 = []
        this.highDetail.formData[0].initValue2 = []
        this.highDetail.formData[0].initValue3 = []
        return
      }
      res.data.forEach(ele => {
        this.highDetail.formData[0].firstList.push({ key: ele.gradeCode, val: `${ele.gradeName}级` })
      })
      this.gradeName = res.data[0].gradeName
      this._getSubjectList()
    },
    firstChange(value) {
      if (value || value === 0) {
        this.gradeName = this.highSubTerm[value].gradeName
        this._getSubjectList()
      }
    },
    // 获取专业
    async _getSubjectList() {
      this.highDetail.formData[0].secondList = []
      const req = {
        gradeName: this.gradeName,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighGradeSub(req)
      this.highSubList = res.data
      if (res.data.length === 0) {
        this.highDetail.formData[0].initValue2 = []
        this.highDetail.formData[0].initValue3 = []
        return
      }
      res.data.forEach(ele => {
        this.highDetail.formData[0].secondList.push({ key: ele.subjectCode, val: ele.subjectName })
      })
      this.highDetail.formData[0].initValue2 = [0]
      this._getHighClass(this.highSubList[0].subjectCode)
    },
    // 点击专业获取班级
    secondChange(value) {
      if (value || value === 0) {
        this._getHighClass(this.highSubList[value].subjectCode)
      }
    },
    // 查询班级列表
    async _getHighClass(subjectCode) {
      this.highDetail.formData[0].threeList = []
      const req = {
        schoolCode: this.userInfo.schoolCode,
        page: 1,
        size: 99999,
        subjectCode: subjectCode,
        gradeName: this.gradeName
      }
      const res = await this.getHighClass(req)
      this.highClass = res.data.records
      if (res.data.records.length === 0) {
        this.highDetail.formData[0].initValue3 = []
        return
      }
      res.data.records.forEach(ele => {
        this.highDetail.formData[0].threeList.push({ key: ele.id, val: ele.className })
      })
      this.highDetail.formData[0].initValue3 = [0]
    },
    toAdd(val) {
      this.$refs.newStudent.formStatus = val
    },
    closeModel() {
      this._getHighStu()
      this.showClassDetail()
      this.$refs.chooseUser.reset()
    },
    // 获取详情
    async showClassDetail() {
      const res = await this.highClassDetail({ id: this.$route.query.id })
      this.classDetail = res.data
      this.detailInfo[0].val = `${res.data.gradeName}级`
      this.detailInfo[1].val = res.data.subjectName
      this.detailInfo[2].val = res.data.className
      this.detailInfo[3].val = res.data.teacherName
      this.detailInfo[4].val = res.data.placeName
      this.detailInfo[5].val = res.data.count || 0
      this.detailInfo[6].val = res.data.remark
      this.$refs.newStudent.classInfo = res.data
    },
    async _getHighStu() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getHighStu(this.searchList)
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    addStudent() {
      this.userTag = true
    },
    // 添加学生
    chooseUser(value) {
      if (value.length > 0) {
        const req = {
          classCode: this.classDetail.classCode,
          className: this.classDetail.className,
          grade: this.classDetail.gradeName,
          subjectCode: this.classDetail.subjectCode,
          subjectName: this.classDetail.subjectName,
          ids: value.map(ele => {
            return ele.id
          })
        }
        this.highStuJoin(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this._getHighStu()
              this.showClassDetail()
              this.$refs.chooseUser.reset()
            })
          })
          .catch(() => {
            this.$refs.chooseUser.error()
          })
      } else {
        this.$message.warning('请选择学生')
        this.$refs.chooseUser.reset()
      }
    },
    // 转班
    moveClass(type, record) {
      this.type = type
      if (type) {
        this.record = record
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择学生')
          return
        }
      }
      this.formStatus = true
    },
    // 查询
    searchForm(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, value)
      this._getHighStu()
    },
    // 单个移除
    async del(record) {
      await this.highStuRemove({ id: record.id })
      this.$message.success('移除成功')
      this.$tools.goNext(() => {
        this._getHighStu()
        this.showClassDetail()
      })
    },
    // 批量移除
    dels(type) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择学生')
        return
      }
      this.$tools.delTip('确定移除选中的学生吗？', () => {
        this.highStusRemove({ ids: this.chooseList }).then(res => {
          this.$message.success('操作成功')
          this.chooseList = []
          this.$tools.goNext(() => {
            this._getHighStu()
            this.showClassDetail()
          })
        })
      })
    },
    goLead(path, record) {
      this.$router.push({
        path,
        query: { userCode: record.userCode, id: record.id }
      })
    },
    // 提交转班
    submitForm(values) {
      const req = {}
      req.grade = this.highSubTerm[values.gradeCode].gradeName
      req.className = this.highClass[values.class].className
      req.classCode = this.highClass[values.class].classCode
      req.subjectName = this.highSubList[values.subject].subjectName
      req.subjectCode = this.highSubList[values.subject].subjectCode
      if (this.type === 0) {
        req.ids = this.chooseList
        this.highStusChange(req)
          .then(res => {
            this.$message.success('转班成功')
            this.chooseList = []
            this.$tools.goNext(() => {
              this._getHighStu()
              this.showClassDetail()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else {
        req.id = this.record.id
        this.highStuChange(req)
          .then(res => {
            this.$message.success('转班成功')
            this.$tools.goNext(() => {
              this._getHighStu()
              this.showClassDetail()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      }
    },
    goAdd() {
      this.$router.push({
        path: '/basedata/bulkImport',
        query: {
          id: this.$route.query.id,
          type: 'students',
          grade: this.classDetail.gradeName,
          subjectCode: this.classDetail.subjectCode,
          classCode: this.classDetail.classCode,
          subjectName: this.classDetail.subjectName,
          className: this.classDetail.className,
          state: 0
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.class-detail {
  height: 100%;
  .tit {
    margin: 10px 0 0 0;
    p {
      border-left: 3px solid @main-color;
      padding-left: 10px;
      font-weight: bold;
      margin: 0 0 0 10px;
      line-height: 16px;
      height: 16px;
      font-size: 16px;
    }
  }
  .top {
    background: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    margin-top: 10px;
    font-weight: bold;
    .info {
      margin-bottom: 20px;
      span {
        margin-right: 50px;
      }
    }
    .phone {
      margin-bottom: 20px;
      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 4px;
      }
    }
  }
  .content {
    background: #fff;
    padding: 20px 20px 0 20px;
    .add {
      margin: 10px 0;
    }
  }
}
.title {
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #2979ff;
}
</style>
