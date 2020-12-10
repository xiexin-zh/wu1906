/* eslint-disable space-infix-ops */
<template>
  <div class="students page-layout qui-fx">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload" class="qui-fx qui-fx-ac">
        <upload-multi
          is-check
          :length="1"
          v-model="fileList"
          type="face"
          :fileInfo="fileInfo"
        ></upload-multi>
        <span style="font-size: 12px; margin-left: 10px"
          >大小20到100kB，像素400x400到800x800，格式仅jpg</span
        >
      </div>
    </sub-form>
    <no-data msg="暂无学生" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="addStudents(0)"> <a-icon type="plus" />添加学生 </a-button>
      </div>
    </no-data>
    <div class="qui-fx qui-fx-jsb" style="width: 100%" v-else>
      <div class="left">
        <grade-tree @select="select"></grade-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left" v-if="isNewYear">
            <a-button icon="plus" class="add-btn" @click="addStudents(0)">添加</a-button>
            <!--             <a-button icon="delete" class="del-btn" @click.stop="deleteList(0)">批量删除</a-button> -->
          </div>
        </search-form>
        <table-list
          is-check
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
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
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addStudents(1, action.record)"
              ></a-button>
            </a-tooltip>
            <!-- <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteList(action.record)">
              <template slot="title">
                您确定删除吗?
              </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>-->
          </template>
          <template v-slot:other1="other1">
            <a-tag
              :color="
                other1.record.hasDorm === '1'
                  ? '#87d068'
                  : other1.record.hasDorm === '0'
                  ? '#2db7f5'
                  : 'purple'
              "
              >{{
                other1.record.hasDorm === '1'
                  ? '住读'
                  : other1.record.hasDorm === '0'
                  ? '走读'
                  : '未知'
              }}</a-tag
            >
          </template>
          <template v-slot:other2="other2">
            <a-tag :color="other2.record.status === '1' ? '#87d068' : '#f50'">{{
              getStudentStatus(other2.record.status)
            }}</a-tag>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showMore"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import GradeTree from '@c/GradeTree'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubForm from '../components/SubForm'
import SearchForm from '@c/SearchForm'
import UploadMulti from '@c/UploadFace'
import ShowDialog from '@c/ShowDialog'
import Tools from '@u/tools'
import { nation } from '@u/nation'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
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
    title: '年级',
    dataIndex: 'gradeName',
    width: '15%',
    customRender: (text, record) => {
      return `${record.gradeName}${record.className}`
    }
  },
  {
    title: '入学年份',
    dataIndex: 'admissionTime',
    width: '10%',
    customRender: text => {
      return new Date(text).getFullYear()
    }
  },
  {
    title: '走住读类型',
    dataIndex: 'hasDorm',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   width: '8%',
  //   scopedSlots: {
  //     customRender: 'other2'
  //   }
  // },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
const searchLabel = [
  {
    value: 'keyword',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '学号'
      }
    ],
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '住读'
      },
      {
        key: 0,
        val: '走读'
      }
    ],
    style: 'width: 80px',
    value: 'hasDorm',
    type: 'select',
    label: '走住读类型'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '有照片'
      },
      {
        key: 0,
        val: '无照片'
      }
    ],
    value: 'hasPhoto',
    style: 'width: 80px',
    type: 'select',
    label: '有无照片'
  }
  // {
  //   list: [
  //     {
  //       key: '',
  //       val: '全部'
  //     },
  //     {
  //       key: '1',
  //       val: '已分班'
  //     },
  //     {
  //       key: '2',
  //       val: '未分班'
  //     }
  //   ],
  //   value: 'hasClass',
  //   style: 'width: 80px',
  //   type: 'select',
  //   label: '班级'
  // },
  // {
  //   list: [
  //     {
  //       key: '',
  //       val: '全部'
  //     },
  //     {
  //       key: '1',
  //       val: '已绑定'
  //     },
  //     {
  //       key: '2',
  //       val: '未绑定'
  //     }
  //   ],
  //   value: 'hasBindParent',
  //   type: 'select',
  //   style: 'width: 80px',
  //   label: '学生家长'
  // },
  // {
  //   list: [
  //     {
  //       key: '',
  //       val: '全部'
  //     },
  //     {
  //       key: '1',
  //       val: '在读'
  //     },
  //     {
  //       key: '2',
  //       val: '已毕业'
  //     },
  //     {
  //       key: '3',
  //       val: '已转学'
  //     },
  //     {
  //       key: '4',
  //       val: '已休学'
  //     },
  //     {
  //       key: '5',
  //       val: '已辍学'
  //     }
  //   ],
  //   value: 'status',
  //   style: 'width: 80px',
  //   type: 'select',
  //   label: '状态'
  // }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '学生姓名',
    placeholder: '请输入学生姓名'
  },
  {
    value: 'sex',
    initValue: '',
    list: [
      {
        key: 1,
        val: '男'
      },
      {
        key: 2,
        val: '女'
      },
      {
        key: 3,
        val: '未知'
      }
    ],
    type: 'select',
    label: '性别',
    placeholder: '请选择性别'
  },
  {
    value: 'workNo',
    initValue: '',
    type: 'input',
    label: '学号',
    placeholder: '请输入学生学号'
  },
  {
    value: 'hasDorm',
    initValue: '',
    list: [
      {
        key: 1,
        val: '住读'
      },
      {
        key: 0,
        val: '走读'
      }
    ],
    type: 'select',
    label: '走住读类型',
    placeholder: '请选择走住读类型'
  },
  {
    value: 'admissionTime',
    initValue: [new Date().getFullYear()],
    list: [
      { key: new Date().getFullYear() + 1, val: new Date().getFullYear() + 1 },
      { key: new Date().getFullYear(), val: new Date().getFullYear() },
      { key: new Date().getFullYear() - 1, val: new Date().getFullYear() - 1 }
    ],
    type: 'select',
    label: '入学年份',
    placeholder: '请选择入学年份'
  },
  {
    type: 'upload',
    label: '人脸照片',
    required: false,
    placeholder: '请上传人脸照片'
  },
  {
    value1: 'grade',
    value2: 'class',
    initValue1: [],
    initValue2: [],
    type: 'linkSelect',
    required: false,
    label: '班级',
    placeholder1: '请选择',
    placeholder2: '请选择',
    firstList: [],
    secondList: []
  },
  {
    value: 'cardNo',
    initValue: '',
    type: 'input',
    label: '卡号',
    required: false,
    placeholder: '请输入学生卡号'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
  // {
  //   value: 'nativePlace',
  //   initValue: '',
  //   type: 'input',
  //   label: '籍贯',
  //   required: false,
  //   max: 30,
  //   placeholder: '请输入籍贯'
  // },
  // {
  //   value: 'nation',
  //   initValue: '',
  //   list: nation.map(item => {
  //     return {
  //       key: item.name,
  //       val: item.name
  //     }
  //   }),
  //   type: 'select',
  //   label: '民族',
  //   required: false,
  //   placeholder: '请选择民族'
  // },
  // {
  //   value: 'publicFace',
  //   initValue: '',
  //   list: [
  //     {
  //       key: 1,
  //       val: '党员'
  //     },
  //     {
  //       key: 2,
  //       val: '团员'
  //     },
  //     {
  //       key: 3,
  //       val: '群众'
  //     },
  //     {
  //       key: 4,
  //       val: '其它'
  //     }
  //   ],
  //   type: 'select',
  //   label: '政治面貌',
  //   required: false,
  //   placeholder: '请选择政治面貌'
  // },
  // {
  //   value: 'homeAddress',
  //   initValue: '',
  //   type: 'input',
  //   label: '家庭地址',
  //   required: false,
  //   max: 50,
  //   placeholder: '请输入家庭地址'
  // }
]
export default {
  name: 'Students',
  components: {
    TableList,
    GradeTree,
    PageNum,
    SubForm,
    UploadMulti,
    SearchForm,
    NoData,
    ShowDialog
  },
  data() {
    return {
      dialogTag: false,
      confirmLoading: false,
      columns,
      searchLabel,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      uploadFile: [],
      title: '添加学生',
      formStatus: false,
      formData,
      gradeList: [],
      classList: [],
      gradeId: '',
      classId: '',
      classChoose: '',
      chooseList: [],
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      studentsList: [],
      schoolYear: '',
      schoolYearId: '',
      gradeCode: '',
      classCode: '',
      isNewYear: true,
      userId: '',
      keyObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.getGrade()
    this.formData[6].firstChange = this.firstChange
    this.formData[6].secondChange = this.secondChange
  },
  mounted() {},
  methods: {
    ...mapActions('home', [
      'getClassList',
      'withoutClassStudent',
      'studentUpdate',
      'getGradeList',
      'studentList',
      'addStudent',
      'detailClassStudent',
      'changeClass',
      'deleteClassStudent'
    ]),
    // 获取年级
    async getGrade() {
      this.formData[6].firstList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      if (!res.data) {
        return
      }
      if (res.data.list.length > 0) {
        res.data.list.forEach(ele => {
          this.formData[6].firstList.push({ key: ele.code, val: ele.name })
          this.gradeList.push({ key: ele.code, val: ele.name })
        })
      }
    },
    select(item) {
      console.log(item)
      this.schoolYear = item.title
      this.schoolYearId = item.schoolYearId
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      this.isNewYear = item.isNewYear
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: item.schoolYearId,
        gradeId: item.gradeCode || '',
        // gradeCode: item.gradeCode || '',
        classId: item.classCode || '',
        ...this.keyObj
      }
      this.showList(req)
      this.columns[9] = this.isNewYear
        ? {
            title: '操作',
            width: '10%',
            scopedSlots: {
              customRender: 'action'
            }
          }
        : {}
    },
    submit() {
      this.confirmLoading = true
      setTimeout(() => {
        this.dialogTag = false
        this.confirmLoading = false
      }, 2000)
    },
    searchForm(values) {
      this.keywords = values.keyword
      this.keyObj = values
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        gradeId: this.gradeCode || '',
        classId: this.classCode || '',
        ...values,
        hasClass: Tools.isBindParent(values.hasClass),
        hasBindParent: Tools.isBindParent(values.hasBindParent)
      }
      this.showList(req)
    },
    submitForm(values) {
      values.hasDorm =
        values.hasDorm === '住读' ? '1' : values.hasDorm === '走读' ? '0' : values.hasDorm
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        schoolId: this.userInfo.schoolId,
        admissionTime: values.admissionTime[0] || values.admissionTime,
        photoUrl: this.fileList.length > 0 ? this.fileList[0].url : '',
        gradeId: this.gradeId,
        classId: this.classChoose
      }
      let res = null
      if (this.type === 0) {
        res = this.addStudent(req)
      } else {
        req.userId = this.userId
        res = this.studentUpdate(req)
      }
      res
        .then(() => {
          this.keywords = ''
          this.$message.success(this.type === 0 ? '添加成功' : '编辑成功')
          this.$tools.goNext(() => {
            const data = {
              ...this.pageList,
              schoolCode: this.userInfo.schoolCode,
              schoolYearId: this.schoolYearId,
              gradeId: this.gradeCode || '',
              classId: this.classCode || '',
              ...this.keyObj
            }
            this.showList(data)
            this.$refs.form.reset()
            this.fileList = []
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    addStudents(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑学生'
        this.formData = this.$tools.fillForm(formData, record)
        this.fileList = record.photoUrl ? [{ url: record.photoUrl }] : []
        this.userId = record.id
        this.formData[3].initValue = record.hasDorm === '1' ? '住读' : '走读'
        this.formData[4].initValue = new Date(record.admissionTime).getFullYear()
        this.formData[6].disabled = true
        this.formData[6].initValue1 = record.gradeName ? [record.gradeName] : ['请选择']
        this.formData[6].initValue2 = record.className ? [record.className] : ['请选择']
        this.type = 1
      } else {
        this.title = '添加学生'
        this.formData = formData
        this.fileList = []
        this.formData[6].disabled = false
        this.type = 0
      }
    },
    async showList(req) {
      const res = await this.studentList(req)
      if (!res.data.list) {
        this.studentsList = []
        return
      }
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    showMore() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        gradeId: this.gradeCode || '',
        classId: this.classCode || '',
        ...this.keyObj
      }
      this.showList(req)
    },
    deleteList(type, record) {
      if (type) {
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
        }
      }
    },
    clickRow(id) {
      console.log(id)
    },
    goLead(path, record) {
      if (record) {
        this.$router.push({
          path,
          query: { userCode: record.userCode, year: this.schoolYear, yearId: this.schoolYearId }
        })
      } else {
        this.$router.push({ path, query: { type: 'students' } })
      }
    },
    async firstChange(value) {
      this.formData[6].secondList = []
      this.classList = []
      this.$refs.form.form.resetFields('class')
      this.classChoose = ''
      this.gradeId = value === undefined ? '' : this.gradeList[value].key
      if (value !== undefined) {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          gradeCode: this.gradeList[value].key,
          schoolYearId: this.schoolYearId
        }
        const res = await this.getClassList(req)
        if (!res.data) {
          return
        }
        if (res.data.list.length > 0) {
          res.data.list.forEach(ele => {
            this.formData[6].secondList.push({ key: ele.id, val: ele.className })
            this.classList.push({ key: ele.id, val: ele.className })
          })
        }
      }
    },
    secondChange(value) {
      this.classChoose = value === undefined ? '' : this.classList[value].key
    },
    getStudentStatus(state) {
      return Tools.getStudentStatus(state)
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
