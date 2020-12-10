<template>
  <div class="page-layout qui-fx goods">
    <submit-form
      ref="form"
      @submit-form="submitApply"
      @getGrade="getGrade"
      :title="title"
      v-model="addFormStatus"
      :form-data="addFormDatas"
    >
      <div slot="upload" class="qui-fx qui-fx-ac">
        <upload-multi is-check :length="1" v-model="fileList" type="face" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <div class="page-left">
      <grade-tree @select="select" @showList="showList"></grade-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="export-btn" @click="addClick">添加</a-button>
          <a-button class="export-btn" @click="checkClick(true)">批量通过</a-button>
          <a-button class="export-btn" @click="checkClick(false)">批量拒绝</a-button>
        </div>
      </search-form>
      <table-list
        isZoom
        isCheck
        v-model="chooseList"
        :page-list="pageList"
        @selectAll="selectAll"
        :columns="columns"
        :table-list="userList"
      >
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="查看详情">
            <a-button
              size="small"
              class="detail-action-btn"
              icon="ellipsis"
              @click.stop="detail(action.record.id)"
            ></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import GradeTree from '../../component/ApplyTree'
import UploadMulti from '@c/UploadFace'
import Tools from '@u/tools'
import SubmitForm from '../../component/SubForm.vue'
import { nation } from '@u/nation'
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '姓名'
  },
  {
    value: 'idCard',
    type: 'input',
    label: '身份证号'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '申请中'
      },
      {
        key: '2',
        val: '申请失败'
      },
      {
        key: '3',
        val: '申请成功'
      }
    ],
    value: 'status',
    type: 'select',
    label: '申请状态'
  }
]
const addFormDatas = [
  {
    value: 'gradeName',
    initValue: [],
    list: [],
    type: 'select',
    label: '年级',
    eventClick: true,
    placeholder: '请选择年级'
  },
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '姓名',
    max: 20,
    placeholder: '请输入学生姓名(长度限制在20字符以内)',
    message: '学生姓名限制在20字符以内'
  },
  {
    value: 'sex',
    initValue: '1',
    list: [
      {
        key: '1',
        val: '男'
      },
      {
        key: '2',
        val: '女'
      }
    ],
    type: 'radio',
    label: '性别',
    placeholder: ''
  },
  {
    value: 'idCard',
    initValue: '',
    type: 'input',
    label: '身份证号',
    placeholder: '请输入身份证号',
    message: '身份证号码格式错误',
    regular: 'idCard'
  },
  {
    value: 'identity',
    initValue: '群众',
    list: [
      {
        key: '群众',
        val: '群众'
      },
      {
        key: '团员',
        val: '团员'
      },
      {
        key: '党员',
        val: '党员'
      }
    ],
    type: 'select',
    label: '政治面貌',
    placeholder: '请选择政治面貌'
  },
  {
    value: 'nation',
    initValue: [],
    list: nation.map((item) => {
      return {
        key: item.name,
        val: item.name
      }
    }),
    type: 'select',
    label: '民族',
    placeholder: '请选择民族'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '联系电话',
    placeholder: '请输入电话号码',
    message: '电话号码格式错误',
    regular: 'phone'
  },
  {
    value: 'project',
    initValue: [],
    list: [],
    type: 'select',
    label: '申请专业',
    placeholder: '请选择专业'
  },
  {
    value: 'source',
    initValue: '应届',
    list: [
      {
        key: '应届',
        val: '应届'
      },
      {
        key: '非应届',
        val: '非应届'
      }
    ],
    type: 'radio',
    label: '学生来源',
    placeholder: ''
  },
  {
    value: 'object',
    initValue: '应届初中',
    list: [
      {
        key: '应届初中',
        val: '应届初中'
      },
      {
        key: '非应届',
        val: '非应届'
      }
    ],
    type: 'radio',
    label: '招生对象',
    placeholder: ''
  },
  {
    value: 'lastSchool',
    initValue: '',
    type: 'input',
    label: '毕业学校',
    max: 20,
    placeholder: '请输入毕业学校',
    message: '毕业学校名称限制在20字符内'
  },
  {
    value: 'health',
    initValue: '',
    type: 'input',
    label: '健康状况',
    max: 10,
    placeholder: '请输入健康状况',
    message: '健康状况限制在10字符内'
  },
  {
    value: 'houseType',
    initValue: '农业',
    list: [
      {
        key: '农业',
        val: '农业'
      },
      {
        key: '2',
        val: '非农'
      }
    ],
    type: 'radio',
    label: '户口性质',
    placeholder: ''
  },
  {
    value: 'address',
    initValue: '',
    type: 'input',
    label: '户口所在地区县以下详细地址',
    max: 30,
    placeholder: '请输入详细地址',
    message: '详细地址限制在30字符内'
  },
  {
    value: 'police',
    initValue: '',
    type: 'input',
    label: '所属派出所',
    placeholder: '请输入所属派出所名称',
    max: 20,
    message: '派出所名称限制在20字符内'
  },
  {
    value: 'addressType',
    initValue: '农村',
    list: [
      {
        key: '农村',
        val: '农村'
      },
      {
        key: '城镇',
        val: '城镇'
      },
      {
        key: '县城',
        val: '县城'
      }
    ],
    type: 'select',
    label: '学生居住地类型',
    placeholder: '请选择居住地类型'
  },
  {
    value: 'addressNow',
    initValue: '',
    type: 'input',
    label: '家庭现住址',
    max: 20,
    placeholder: '请输入家庭现住址',
    message: '住址限制在20字符内'
  },
  {
    value: 'parentName',
    initValue: '',
    type: 'input',
    label: '家长姓名',
    max: 20,
    placeholder: '请输入家长姓名',
    message: '家长姓名在20字符内'
  },
  {
    value: 'parentTel',
    initValue: '',
    type: 'input',
    label: '家长手机号',
    placeholder: '请输入家长手机号',
    message: '电话号码格式错误',
    regular: 'phone'
  },
  {
    value: 'relation',
    initValue: '',
    type: 'input',
    label: '与本人关系',
    max: 10,
    placeholder: '请输入家长与本人关系',
    message: '关系字数在10字符内'
  },
  {
    value: 'isGuardian',
    initValue: true,
    list: [
      {
        key: true,
        val: '是'
      },
      {
        key: false,
        val: '否'
      }
    ],
    type: 'radio',
    label: '是否监护人',
    placeholder: ''
  },
  {
    type: 'upload',
    initValue: '',
    label: '学生人脸照片(选填)',
    required: false,
    placeholder: '请上传人脸照片'
  }
]
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'studentName',
    width: '8%'
  },
  {
    title: '年级',
    width: '8%',
    dataIndex: 'grade'
  },
  {
    title: '申请专业',
    dataIndex: 'majorName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '5%',
    customRender: (text) => {
      if (text === 1 || text === '1') {
        return '男'
      }
      if (text === 2 || text === '2') {
        return '女'
      }
      return '未知'
    }
  },
  {
    title: '身份证号',
    dataIndex: 'idNumber',
    width: '8%'
  },
  {
    title: '联系电话',
    dataIndex: 'mobile',
    width: '8%'
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    width: '8%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '申请状态',
    dataIndex: 'state',
    width: '8%',
    customRender: (text) => {
      if (text === 1 || text === '1') {
        return '申请中'
      }
      if (text === 2 || text === '2') {
        return '申请失败'
      }
      if (text === 3 || text === '3') {
        return '申请成功'
      }
      return ''
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
    title: '操作',
    width: '5%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'StudentApply',
  components: {
    TableList,
    SearchForm,
    PageNum,
    GradeTree,
    SubmitForm,
    UploadMulti
  },
  data() {
    return {
      columns,
      searchLabel,
      title: '添加新生',
      addFormStatus: false,
      addFormDatas,
      fileList: [],
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      userList: [],
      chooseList: [],
      totalList: [],
      previewVisible: false,
      detailList: {},
      subjectList: [],
      gradeTreeList: [],
      grade: '', // 年级名称
      majorCode: '', // 	申请专业编码
      majorName: '' // 申请专业名称
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'gradeList', 'schoolCode'])
  },
  watch: {},
  mounted() {
    const gradeList = JSON.parse(sessionStorage.getItem('gradeList') || [])
    this.addFormDatas[0].list = gradeList.map((item) => {
      return {
        key: Number(item.gradeName),
        val: Number(item.gradeName)
      }
    })
    this.getGradeTree()
  },
  methods: {
    ...mapActions('home', [
      'getStudentList',
      'addStudent',
      'getStudentList',
      'batchCheck',
      'getGradeList',
      'getApplyTree'
    ]),
    async showList(searchObj = {}) {
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const req = {
        ...this.searchList,
        schoolCode: this.userInfo.schoolCode // 学校编码
      }
      const res = await this.getStudentList(req)
      if (res && res.code === 200) {
        this.userList = res.data.records.map((item) => {
          return {
            ...item,
            disabled: item.state === '3'
          }
        })
        this.total = res.data.total
      }
    },
    async getGradeTree() {
      const res = await this.getApplyTree(this.schoolCode)
      this.gradeTreeList = [...res.data]
    },
    // 获取年级下专业列表
    async getGrade(gradeName) {
      const list = this.gradeTreeList.filter((item) => {
        return item.grade === gradeName
      })
      if (list.length > 0) {
        this.addFormDatas[7].list = list[0].majorList.map((item) => {
          return {
            ...item,
            key: item.majorCode,
            val: item.majorName
          }
        })
      }
    },
    // 条件搜索
    searchForm(values) {
      const { idCard, name, status } = values
      this.pageList.page = 1
      const searchObj = {
        idNumber: idCard, // 身份证号
        state: status, // 申请状态 1:申请中；2：失败；3：成功
        studentName: name // 学生姓名
      }
      this.showList(searchObj)
    },
    // 去详情
    detail(id) {
      this.$router.push({
        path: `/studentApply/applyDetails`,
        query: {
          id
        }
      })
    },
    // 选择树形列表
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      const { gradeCode, title, schoolYearName } = item
      this.majorCode = gradeCode
      this.majorName = title
      this.grade = schoolYearName
      this.$nextTick(() => {
        this.showList()
      })
    },
    addClick() {
      this.addFormStatus = true
    },
    // 表格全选
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 提交新生申请添加
    async submitApply(item) {
      const photoUrl = this.fileList.length === 0 ? '' : this.fileList[0].url
      const gradeList = this.gradeTreeList.filter((el) => {
        return el.grade === item.gradeName
      })
      const majorList = gradeList[0].majorList
      const nowMajor = majorList.filter((el) => {
        return el.majorCode === item.project
      })

      const req = {
        enrollmentTarget: item.object,
        gender: item.sex,
        grade: item.gradeName,
        graduationSchool: item.lastSchool,
        hasGuardian: item.isGuardian,
        healthyState: item.health,
        homeAddress: item.addressNow,
        idNumber: item.idCard,
        majorCode: item.project,
        majorName: nowMajor[0].majorName,
        mobile: item.mobile,
        nationality: item.nation,
        parentMobile: item.parentTel,
        parentName: item.parentName,
        photoUrl: photoUrl,
        policeStation: item.police,
        politicalOutlook: item.identity,
        registrationAddress: item.address,
        registrationNature: item.houseType,
        relationship: item.relation,
        residentialType: item.addressType,
        schoolCode: this.schoolCode,
        schoolName: this.userInfo.schoolName,
        studentName: item.name,
        studentSource: item.source
      }
      const res = await this.addStudent(req)
      if (res && res.code === 200) {
        this.addFormStatus = false
        this.fileList = []
        this.showList()
      } else {
        this.$message.error(res.message || '添加失败')
      }
    },
    // 批量审核通过、拒绝按钮
    checkClick(val) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择学生')
        return
      }
      this.$confirm({
        title: val ? '审核通过' : '审核拒绝',
        content: val ? '确定通过新生入学申请吗？（录取）' : '确定拒绝新生入学申请吗？（不录取）',
        onOk: async () => {
          const req = {
            auditResult: val,
            auditor: this.userInfo.userName,
            ids: [...this.chooseList]
          }
          const res = await this.batchCheck(req)
          if (res && res.code === 200) {
            this.showList()
          } else {
            this.$message.error('审核失败')
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.goods {
  .page-left {
    background: #fff;
    margin-right: 10px;
    width: 150px;
  }
}
</style>
