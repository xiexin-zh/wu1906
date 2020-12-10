<template>
  <div class="students page-layout qui-fx">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      @selectPanel="showSelectPanel"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <template slot="selectPanel">
        <a-input
          placeholder="请选择"
          :disabled="disableSelect"
          :read-only="true"
          @focus="showSelectPanel"
          v-model="studentInfo.userName"
        >
          <a-icon slot="suffix" type="right" />
        </a-input>
      </template>
      <template slot="selectPanel_1">
        <a-input placeholder="" :disabled="true" v-model="studentInfo.workNo"> </a-input>
      </template>
      <template slot="selectPanel_2">
        <div style="display: flex; justify-content: space-between">
          <a-input
            style="width: 48%"
            placeholder=""
            :disabled="true"
            v-model="studentInfo.gradeName"
          >
          </a-input>
          <a-input
            style="width: 48%"
            placeholder=""
            :disabled="true"
            v-model="studentInfo.className"
          >
          </a-input>
        </div>
      </template>
    </sub-form>
    <student-panel
      title="选择学生"
      studentStatus="4"
      v-if="panelStatus"
      v-model="panelStatus"
      @submit="confirmSelect"
      :isHighSchool="isHighSchool"
    ></student-panel>
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addAward(0)">办理</a-button>
          </div>
        </search-form>
        <table-list
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="userList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addAward(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
            >
              <template slot="title"> 您确定删除吗? </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubForm from '../../component/SubForm'
import StudentPanel from '../../component/StudentPanel'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '复学年级',
    dataIndex: 'newSchoolYearName',
    width: '10%'
  },
  {
    title: '复学专业',
    dataIndex: 'newGradeName',
    width: '10%'
  },
  {
    title: '复学班级',
    dataIndex: 'newClassName',
    width: '10%'
  },
  {
    title: '复学日期',
    dataIndex: 'startTime',
    width: '15%',
    customRender: (text) => {
      return text ? Tools.getDate(text, 1) : ''
    }
  },
  {
    title: '复学原因',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '经办人',
    dataIndex: 'agentPerson',
    width: '10%'
  },
  {
    title: '办理日期',
    dataIndex: 'agentDate',
    width: '10%',
    customRender: (text) => {
      return text ? Tools.getDate(text, 1) : ''
    }
  },
  {
    title: '添加人',
    dataIndex: 'optName',
    width: '8%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return text ? Tools.getDate(text, 5) : ''
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'time',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'keyword',
    type: 'input',
    label: '姓名/学号'
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'selectPanel',
    label: '学生姓名',
    readonly: true,
    placeholder: '请选择'
  },
  {
    value: 'workNo',
    initValue: '',
    type: 'selectPanel_1',
    label: '学号',
    disabled: true,
    required: false,
    placeholder: ''
  },
  {
    value1: 'oldGradeName',
    value2: 'oldClassName',
    initValue1: '',
    initValue2: '',
    disabled: true,
    type: 'selectPanel_2',
    required: false,
    label: '休学班级',
    placeholder1: '',
    placeholder2: '',
    firstList: [],
    secondList: []
  },
  {
    value1: 'newGradeName',
    value2: 'newClassName',
    initValue1: '',
    initValue2: '',
    initValue3: '',
    type: 'linkSelect',
    required: false,
    label: '复学班级',
    placeholder1: '',
    placeholder2: '',
    firstList: [],
    secondList: [],
    threeList: []
  },
  {
    value: 'startTime',
    initValue: '',
    type: 'singleTime',
    label: '复学日期',
    placeholder: '年/月/日'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'textarea',
    label: '复学原因',
    max: 200,
    minRows: 2,
    maxRows: 3,
    placeholder: '限200字内'
  },
  {
    value: 'agentPerson',
    initValue: '',
    type: 'input',
    label: '经办人',
    max: 30,
    placeholder: '请输入经办人(限20字内)'
  },
  {
    value: 'agentDate',
    initValue: '',
    type: 'singleTime',
    label: '办理日期',
    placeholder: '年/月/日'
  }
]
export default {
  name: 'BackToSchool',
  components: {
    TableList,
    PageNum,
    SubForm,
    SearchForm,
    StudentPanel
  },
  data() {
    return {
      columns,
      searchLabel,
      title: '添加',
      formStatus: false,
      panelStatus: false,
      formData,
      disableSelect: false,
      studentInfo: {
        userName: '',
        workNo: '',
        gradeName: '',
        className: ''
      },
      chooseList: [],
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      schoolYearList: [],
      gradeList: [],
      classList: [],
      userList: [],
      newClassCode: '',
      newClassId: '',
      newGradeCode: '',
      newClassName: '',
      newGradeName: '',
      newGradeId: '',
      newSchoolYearId: '',
      newSchoolYearName: '',
      oldClassCode: '',
      oldClassId: '',
      oldGradeCode: '',
      oldGradeId: '',
      oldSchoolYearId: '',
      oldSchoolYearName: '',
      userCode: '',
      userId: '',
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'isHighSchool'])
  },
  created() {
    if (this.isHighSchool) {
      this.formData[3].value1 = 'newSchoolYear'
      this.formData[3].value2 = 'newGradeName'
      this.formData[3].value3 = 'newClassName'
      this.formData[3].initValue3 = ''
      this.formData[3].type = 'link3Select'
      this.formData[3].label = '复学班级'
      this.formData[3].placeholder3 = ''
      this.formData[3].threeList = []
      this.formData[3].firstChange = this.changeSchoolYear
      this.formData[3].secondChange = this.changeSubject
    } else {
      this.formData[3].type = 'linkSelect'
      this.formData[3].firstChange = this.getClass
    }
    this.columns[3].title = this.isHighSchool ? '年级' : '复学年级'
    this.columns[3].dataIndex = this.isHighSchool ? 'newSchoolYearName' : 'newGradeName'
    this.columns[4].title = this.isHighSchool ? '复学专业' : ''
    this.columns[4].dataIndex = this.isHighSchool ? 'newGradeName' : ''
    this.columns[4].width = this.isHighSchool ? '10%' : '0.1%'

    this.getYear(this.isHighSchool)
    this.getGrade(this.isHighSchool)
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getSchoolYear',
      'getGradeList',
      'getClassList',
      'addReentry',
      'editReentry',
      'getReentryList',
      'delChangeList',
      'getHighGradeList',
      'getHighMajorList',
      'getHighClassList'
    ]),
    // 修改年级-中高职
    async changeSchoolYear(id) {
      this.formData[3].secondList = []
      this.formData[3].threeList = []
      const list = this.schoolYearList.filter((item) => {
        return item.id === id
      })
      this.schoolYearId = list[0].gradeName
      this.newSchoolYearName = list[0].gradeName
      const req = {
        schoolCode: this.userInfo.schoolCode,
        gradeName: list[0].gradeName
      }
      const res = await this.getHighMajorList(req)
      if (res && res.code === 200) {
        this.gradeList = res.data
        this.formData[3].secondList = res.data.map((item) => {
          return {
            key: item.id,
            val: item.subjectName
          }
        })
      }
    },
    // 修改专业-中高职
    async changeSubject(id) {
      const list = this.gradeList.filter((item) => {
        return item.id === id
      })
      const req = {
        schoolCode: this.userInfo.schoolCode,
        gradeName: this.schoolYearId,
        subjectCode: list[0].subjectCode
      }
      const res = await this.getHighClassList(req)
      if (res && res.code === 200) {
        this.classList = res.data
        this.formData[3].threeList = res.data.map((item) => {
          return {
            key: item.id,
            val: item.className
          }
        })
      }
    },
    // 获取当前学年
    async getYear(isHighSchool) {
      // 获取中高职年级列表
      if (isHighSchool) {
        const res = await this.getHighGradeList({ schoolCode: this.userInfo.schoolCode })
        if (res && res.code === 200) {
          this.schoolYearList = res.data
            .map((item) => {
              return {
                ...item,
                schoolYear: item.gradeName
              }
            })
            .reverse()
        }
        this.formData[3].firstList = res.data
          .map((item) => {
            return {
              key: item.id,
              val: item.gradeName
            }
          })
          .reverse()
        return
      }
      // 获取小初高年级列表
      const res = await this.getSchoolYear({ schoolCode: this.userInfo.schoolCode })
      if (res && res.code === 200) {
        const list = res.data.list
          .filter((item) => {
            return item.semester === '下学期'
          })
          .filter((item) => {
            return item.valid === '1'
          })
        if (res.data.list[0].semester === '上学期') {
          list.unshift({
            id: res.data.list[0].id,
            semester: res.data.list[0].semester,
            schoolYear: res.data.list[0].schoolYear
          })
        }
        this.schoolYearList = list
        this.schoolYear = list[0].schoolYear
        this.newSchoolYearId = list[0].id
        this.newSchoolYearName = list[0].schoolYear
      }
    },
    // 获取年级列表（小初高）
    async getGrade(isHighSchool) {
      // 中高职
      if (this.isHighSchool) {
        return
      }
      // 小初高
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      if (res.data.list.length === 0) return
      this.gradeList = res.data.list
      this.formData[3].firstList = res.data.list.map((item) => {
        return {
          key: item.id,
          val: item.name
        }
      })
    },
    // 获取班级列表
    async getClass(id) {
      // 中高职
      if (this.isHighSchool) {
        return
      }

      // 小初高
      this.formData[3].secondList = []
      const list = this.gradeList.filter((item) => {
        return item.id === id
      })
      const req = {
        gradeCode: list[0].code,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        page: 1,
        size: 9999
      }
      const res = await this.getClassList(req)
      this.classList = res.data.list
      this.formData[3].secondList = res.data.list.map((item) => {
        return {
          key: item.classId,
          val: item.className
        }
      })
    },
    searchForm(values) {
      const req = {
        keyword: values.keyword || '',
        startTime: new Date(`${values.time[0]} 00:00:00`).getTime(),
        endTime: new Date(`${values.time[1]} 23:59:59`).getTime()
      }
      this.searchObj = req
      this.showList()
    },
    async submitForm(values) {
      if (!this.studentInfo.userName) {
        this.$message.warning('请选择学生')
        return
      }
      const newGrade = this.gradeList.filter((item) => {
        return item.id === values.newGradeName
      })
      const newClass = this.classList.filter((item) => {
        return item.id === values.newClassName
      })
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        agentDate: new Date(values.agentDate).getTime(),
        createTime: new Date().getTime(),
        startTime: new Date(values.startTime).getTime(),
        optCode: this.userInfo.userCode,
        optName: this.userInfo.userName,
        newClassName: newClass.length > 0 ? newClass[0].className : '',
        newClassCode: newClass.length > 0 ? newClass[0].classCode : '',
        newClassId: values.newClassName,
        newGradeName: newGrade.length > 0 ? newGrade[0][this.isHighSchool? 'subjectName' : 'name'] : '',
        newGradeCode: newGrade.length > 0 ? newGrade[0][this.isHighSchool? 'subjectCode' : 'code'] : '',
        newGradeId: values.newGradeName,
        newSchoolYearId: this.newSchoolYearId,
        newSchoolYearName: this.newSchoolYearName,
        oldClassCode: this.oldClassCode,
        oldClassId: this.oldClassId,
        oldGradeCode: this.oldGradeCode,
        oldGradeId: this.oldGradeId,
        oldSchoolYearId: this.oldSchoolYearId,
        oldSchoolYearName: this.oldSchoolYearName,
        userCode: this.userCode,
        userId: this.userId,
        ...this.studentInfo,
        oldClassName: this.studentInfo.className,
        oldGradeName: this.studentInfo.gradeName
      }
      if (this.type) {
        req.id = this.listId
        req.newClassName = this.newClassName
        req.newGradeName = this.newGradeName
      }
      const res = this.type ? await this.editReentry(req) : await this.addReentry(req)
      if (res && res.code === 200) {
        this.formStatus = false
        this.pageList.page = 1
        this.showList()
        this.classList = []
      }
    },
    addAward(type, record) {
      this.formStatus = true
      this.formData[3].firstChange = this.isHighSchool ? this.changeSchoolYear : this.getClass
      if (type) {
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, record)
        this.type = 1
        this.formData[3].disabled = true
        this.disableSelect = true
        this.studentInfo = {
          userName: record.userName,
          workNo: record.workNo,
          gradeName: record.oldGradeName,
          className: record.oldClassName
        }
        this.formData[3].initValue1 = record.newGradeId || ''
        this.formData[3].initValue2 = record.newClassId || ''
        this.formData[4].initValue = Tools.getDate(record.startTime, 1)
        this.formData[7].initValue = Tools.getDate(record.agentDate, 1)
        this.userCode = record.userCode || ''
        this.userId = record.userId || ''
        this.newGradeName = record.newGradeName || ''
        this.newClassName = record.newClassName || ''
        this.listId = record.id
      } else {
        this.title = '添加'
        this.formData = formData
        this.type = 0
        this.disableSelect = false
        this.studentInfo = {
          userName: '',
          workNo: '',
          gradeName: '',
          className: ''
        }
      }
    },
    async showList(obj = {}) {
      const req = {
        ...this.searchObj,
        ...obj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getReentryList(req)
      if (!res.data.list) {
        this.userList = []
        return
      }
      this.userList = res.data.list
      this.total = res.data.total
    },
    async deleteList(record) {
      const res = await this.delChangeList({ id: record.id })
      if (res && res.code === 200) {
        this.showList()
      }
    },
    clickRow(id) {
      console.log(id)
    },
    showSelectPanel() {
      this.panelStatus = true
    },
    confirmSelect(item) {
      this.panelStatus = false
      const {
        userName,
        schoolYearId,
        id,
        userId,
        userCode,
        classCode,
        gradeName,
        gradeCode,
        className,
        workNo
      } = item
      this.studentInfo = {
        userName: userName || '',
        workNo: workNo || '',
        gradeName: gradeName || '',
        className: className || ''
      }
      this.oldClassCode = classCode
      this.userCode = userCode
      this.oldGradeCode = gradeCode
      this.oldSchoolYearId = schoolYearId
      this.userId = this.isHighSchool ? userId : id
    }
  }
}
</script>
<style lang="less" scoped>
.students {
  background: #fff;
  height: 100%;
  .left {
    padding: 10px;
  }
  .right {
    padding: 0 10px;
    border-left: 1px solid @bor-color;
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
