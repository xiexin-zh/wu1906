<template>
  <div class="class-detail page-layout qui-fx-ver">
    <choose-student
      ref="chooseUser"
      is-check
      no-bind
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      @toAdd="toAdd"
      hasAdd
      title="添加学生"
    ></choose-student>
    <choose-subteacher
      is-radio
      ref="chooseSubteacher"
      v-if="teacherTag"
      chooseType="subject"
      v-model="teacherTag"
      @submit="chooseTeacher"
      title="添加教师"
      :teacherList="studentsList"
    ></choose-subteacher>
    <new-student
      title="添加学生"
      ref="newStudent"
      :classData="classInfo"
      @closeModel="closeModel"
      :schoolYearId="parseInt(schoolYearId)"
    ></new-student>
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></sub-form>
    <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    <a-tabs v-model="autoKey" @change="tabChange">
      <a-tab-pane tab="班级学生" key="1"></a-tab-pane>
      <a-tab-pane tab="任课教师" key="2"></a-tab-pane>
      <div slot="tabBarExtraContent" class="qui-fx-ac mar-r10">
        <search-form
          v-if="autoKey === '1'"
          isReset
          @search-form="searchForm"
          :search-label="searchLabel"
          style="padding: 0"
        >
          <div slot="right" v-if="isNewYear">
            <a-button icon="plus" class="add-btn mar-l10" @click="addStudent">添加学生</a-button>
            <a-button icon="export" class="export-all-btn" @click.stop="goAdd">批量导入</a-button>
          </div>
        </search-form>
        <search-form
          v-else
          isReset
          @search-form="teasearchForm"
          :search-label="teasearchLabel"
          style="padding: 0"
        >
          <div slot="right" v-if="isNewYear">
            <a-button icon="plus" class="add-btn mar-l10" @click="addTeacher">添加教师</a-button>
          </div>
        </search-form>
      </div>
    </a-tabs>
    <div class="content qui-fx-ver qui-fx-f1">
      <div class="table qui-fx-ver qui-fx-f1">
        <table-list
          is-zoom
          :columns="autoKey === '1' ? columns : teacolumns"
          :table-list="studentsList"
        >
          <template v-slot:actions="action" v-if="isNewYear">
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="goLead('/basedata/stusentsDetail', action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="转班">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="moveClass(action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
            >
              <template slot="title">您确定移除吗?</template>
              <a-tooltip placement="topLeft" title="移除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <template v-slot:other1="other1" v-if="isNewYear">
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteTeacher(other1.record)"
            >
              <template slot="title">您确定移除吗?</template>
              <a-tooltip placement="topLeft" title="移除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="changePage"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import DetailShow from '@c/DetailShow'
import NewStudent from '../components/NewStudent'
import moveClassImg from '../../assets/img/database/role/moveClass.png'
import editImg from '../../assets/img/database/role/edit.png'
import deleteImg from '../../assets/img/database/role/delete.png'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import SubForm from '../components/SubForm'
import PageNum from '@c/PageNum'
import ChooseStudent from '@c/ChooseStudent'
import ChooseSubteacher from '../components/ChooseSubteacher'
import Tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学生姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: text => {
      return Tools.getSex(text)
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '入学年份',
    dataIndex: 'admissionTime',
    width: '15%',
    customRender: text => {
      return new Date(text || new Date().getTime()).getFullYear()
    }
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '加入班级时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text, 1)
    }
  }
]
const teacolumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教师姓名',
    dataIndex: 'teacherName',
    width: '10%'
  },
  {
    title: '教授学科',
    dataIndex: 'subjectName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '10%',
    customRender: text => {
      return Tools.getSex(text)
    }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    width: '10%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoSrc',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
const searchLabel = [
  {
    value: 'keywords',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 1,
        val: '学生姓名'
      },
      {
        key: 2,
        val: '学号'
      }
    ],
    placeholder: '请输入'
  }
]
const teasearchLabel = [
  {
    value: 'subjectCode',
    initValue: '',
    type: 'select',
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    label: '学科'
  }
]
const formData = [
  {
    value: 'grade',
    initValue: [],
    type: 'linkSelect',
    required: false,
    label: '转至班级',
    placeholder1: '年级',
    placeholder2: '班级',
    firstList: [],
    secondList: []
  }
]
export default {
  name: 'StudentDetail',
  components: {
    TableList,
    SearchForm,
    SubForm,
    PageNum,
    ChooseStudent,
    DetailShow,
    NewStudent,
    ChooseSubteacher
  },
  data() {
    return {
      moveClassImg,
      editImg,
      deleteImg,
      title: '转班',
      formStatus: false,
      formData,
      searchLabel,
      teasearchLabel,
      studentsList: [],
      columns,
      teacolumns,
      confirmLoading: false,
      dialogTag: false,
      keywords: '',
      userTag: false,
      teacherTag: false,
      total: 100,
      pageList: {
        page: 1,
        size: 20
      },
      gradeList: [],
      classList: [],
      gradeId: '',
      classId: '',
      classInfo: {},
      schoolYear: '',
      schoolYearId: '',
      record: null,
      detailInfo: [
        {
          key: '学年',
          val: ''
        },
        {
          key: '年级',
          val: ''
        },
        {
          key: '班级名称',
          val: ''
        },
        {
          key: '班级教室',
          val: ''
        },
        {
          key: '班级学生人数',
          val: ''
        },
        {
          key: '班主任',
          val: ''
        },
        {
          key: '备注',
          val: ''
        }
      ],
      infoTitle: '基础信息',
      isNewYear: true,
      autoKey: '1',
      subjectCode: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.autoKey = this.$route.query.type
    this.formData[0].firstChange = this.firstChange
    this.formData[0].secondChange = this.secondChange
    this.schoolYear = this.$route.query.schoolYear
    this.schoolYearId = this.$route.query.schoolYearId
    this.isNewYear = this.$route.query.isNewYear === '1'
    this.columns[7] = this.isNewYear
      ? {
          title: '操作',
          width: '20%',
          scopedSlots: {
            customRender: 'action'
          }
        }
      : {}
    this.teacolumns[7] = this.isNewYear
      ? {
          title: '操作',
          width: '20%',
          scopedSlots: {
            customRender: 'other1'
          }
        }
      : {}
  },
  mounted() {
    if (this.autoKey === '1') {
      this.showList(this.keywords)
    } else {
      this.getSubjectList()
      this.showTeaList(this.subjectCode)
    }
    this.showClassDetail()
    this.getGrade()
  },
  methods: {
    ...mapActions('home', [
      'detailClass',
      'getClassList',
      'getGradeList',
      'changeClass',
      'getClassStudentList',
      'addClassStudent',
      'detailClassStudent',
      'changeClass',
      'deleteClassStudent',
      'addClassTeacher',
      'getClassTeacherList',
      'deleteClassTeacher',
      'getSubList'
    ]),
    changePage() {
      if (this.autoKey === '1') {
        this.showList(this.keywords)
      } else {
        this.showTeaList(this.subjectCode)
      }
    },
    async getSubjectList() {
      this.teasearchLabel[0].list = [
        {
          key: '',
          val: '全部'
        }
      ]
      const req = {
        ...this.userInfo
      }
      const res = await this.getSubList(req)
      res.data.forEach(ele => {
        this.teasearchLabel[0].list.push({
          key: ele.subjectCode,
          val: ele.subjectName
        })
      })
      this.subjectList = res.data
    },
    tabChange() {
      if (this.autoKey === '1') {
        this.showList(this.keywords)
      } else {
        this.showTeaList(this.subjectCode)
      }
    },
    toAdd(val) {
      this.$refs.newStudent.formStatus = val
    },
    closeModel() {
      this.showList(this.keywords)
      this.showClassDetail()
      this.$refs.chooseUser.reset()
    },
    // 获取年级
    async getGrade() {
      this.formData[0].firstList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      if (res.data.list.length > 0) {
        res.data.list.forEach(ele => {
          this.formData[0].firstList.push({ key: ele.code, val: ele.name })
          this.gradeList.push({ key: ele.code, val: ele.name })
        })
      }
    },
    async showClassDetail() {
      const res = await this.detailClass(this.$route.query.id)
      this.detailInfo[0].val = this.schoolYear
      this.detailInfo[1].val = res.data.gradeName
      this.detailInfo[2].val = res.data.className
      this.detailInfo[3].val = res.data.placeName
      this.detailInfo[4].val = res.data.count || 0
      this.detailInfo[5].val = res.data.teacherName
      this.detailInfo[6].val = res.data.remark
      this.$refs.newStudent.classInfo = res.data
    },
    async showList(keyword = '') {
      const req = {
        classCode: this.$route.query.classCode,
        gradeCode: this.$route.query.gradeCode,
        schoolYearId: this.$route.query.schoolYearId,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        keyword: keyword
      }
      const res = await this.getClassStudentList(req)
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    async showTeaList(subjectCode = '') {
      const req = {
        classId: this.$route.query.id,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.userInfo.schoolCode,
        subjectCode
      }
      const res = await this.getClassTeacherList(req)
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    addStudent() {
      this.userTag = true
    },
    addTeacher() {
      this.teacherTag = true
    },
    chooseTeacher(value) {
      console.log(value)
      const req = []
      value.forEach(ele => {
        req.push({
          classId: this.$route.query.id,
          schoolCode: this.userInfo.schoolCode,
          subjectCode: ele.subjectCode,
          teacherCode: ele.teacherCode
        })
      })
      this.addClassTeacher(req)
        .then(res => {
          this.$message.success('添加成功')
          this.$tools.goNext(() => {
            this.showTeaList(this.subjectCode)
            this.$refs.chooseSubteacher.reset()
          })
        })
        .catch(() => {
          this.$refs.chooseSubteacher.error()
        })
    },
    chooseUser(value) {
      if (value.length > 0) {
        const req = {
          classId: this.$route.query.id,
          schoolCode: this.userInfo.schoolCode,
          userIds: value.map(ele => {
            return ele.id
          })
        }
        this.addClassStudent(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.showList(this.keywords)
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
    submit() {
      this.confirmLoading = true
      setTimeout(() => {
        this.dialogTag = false
        this.confirmLoading = false
      }, 1000)
    },
    moveClass(record) {
      this.formStatus = true
      this.record = record
    },
    searchForm(value) {
      this.keywords = value.keywords
      this.showList(value.keywords)
    },
    teasearchForm(value) {
      console.log(value)
      this.subjectCode = value.subjectCode
      this.showTeaList(value.subjectCode)
    },
    async deleteList(record) {
      await this.deleteClassStudent(record.id)
      this.$message.success('移除成功')
      this.$tools.goNext(() => {
        this.showList()
        this.showClassDetail()
      })
    },
    async deleteTeacher(record) {
      await this.deleteClassTeacher(record.id)
      this.$message.success('移除成功')
      this.$tools.goNext(() => {
        this.showTeaList(this.subjectCode)
      })
    },
    goLead(path, record) {
      this.$router.push({
        path,
        query: {
          userCode: record.userCode,
          year: this.schoolYear,
          yearId: this.$route.query.schoolYearId
        }
      })
    },
    async firstChange(value) {
      this.classList = []
      this.formData[0].secondList = []
      if (value === undefined) {
        return
      }
      this.gradeId = this.gradeList[value].key
      const req = {
        schoolCode: this.userInfo.schoolCode,
        gradeCode: this.gradeList[value].key,
        schoolYearId: this.schoolYearId
      }
      const res = await this.getClassList(req)
      if (res.data.list.length > 0) {
        res.data.list.forEach(ele => {
          this.formData[0].secondList.push({ key: ele.id, val: ele.className })
          this.classList.push({ key: ele.id, val: ele.className })
        })
        this.classId = this.classList[0].key
      }
    },
    secondChange(value) {
      this.classId = this.classList[value].key
    },
    submitForm(values) {
      if (!this.classId) {
        return
      }
      const req = {
        classId: this.classId,
        schoolCode: this.userInfo.schoolCode,
        id: this.record.id,
        userId: this.record.userId
      }
      this.changeClass(req)
        .then(res => {
          this.$message.success('转班成功')
          this.$tools.goNext(() => {
            this.showList()
            this.showClassDetail()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    goAdd() {
      this.$router.push({
        path: '/basedata/bulkImport',
        query: { id: this.$route.query.id, type: 'students' }
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
  .action {
    div {
      cursor: pointer;
      margin: 4px 30px 0 0;
      img {
        width: 20px;
        height: 20px;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
</style>
