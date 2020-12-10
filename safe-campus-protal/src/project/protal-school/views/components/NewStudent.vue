<template>
  <sub-form
    ref="form"
    @submit-form="submitForm"
    :title="title"
    v-model="formStatus"
    :form-data="formData"
  >
    <div slot="upload" class="qui-fx qui-fx-ac">
      <upload-multi is-check :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      <span style="font-size:12px;margin-left:10px;">大小20到100kB，像素400x400到800x800，格式仅jpg</span>
    </div>
  </sub-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SubForm from '../components/SubForm'
import UploadMulti from '@c/UploadFace'
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
    initValue: [],
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
    type: 'upload',
    label: '人脸照片',
    required: false,
    placeholder: '请上传人脸照片'
  },
  {
    value: 'hasDorm',
    initValue: [],
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
]
export default {
  name: 'MenuDrawer',
  components: {
    SubForm,
    UploadMulti
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    schoolYearId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData,
      formStatus: false,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      gradeList: [],
      classList: [],
      gradeId: '',
      classChoose: '',
      classInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    classInfo(val) {
      console.log(val)
      this.formData[6].disabled = true
      this.formData[6].initValue1 = val.gradeName ? [val.gradeName] : ['请选择']
      this.formData[6].initValue2 = val.className ? [val.className] : ['请选择']
      this.gradeId = val.gradeCode
      this.classChoose = val.id
    }
  },
  mounted() {
    this.getGrade()
    this.formData[6].firstChange = this.firstChange
    this.formData[6].secondChange = this.secondChange
  },
  methods: {
    ...mapActions('home', ['getClassList', 'getGradeList', 'addStudent']),
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
    submitForm(values) {
      values.hasDorm = values.hasDorm === '住读' ? '1' : values.hasDorm === '走读' ? '0' : values.hasDorm
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
      res = this.addStudent(req)
      res
        .then(() => {
          this.$message.success('添加成功')
          this.$refs.form.reset()
          this.formData[6].initValue1 = this.classInfo.gradeName ? [this.classInfo.gradeName] : ['请选择']
          this.formData[6].initValue2 = this.classInfo.className ? [this.classInfo.className] : ['请选择']
          this.fileList = []
          this.$emit('closeModel')
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    async firstChange(value) {
      this.formData[6].secondList = []
      this.classList = []
      console.log(value)
      if (value === undefined) {
        this.gradeId = ''
        this.classChoose = ''
        return
      }
      this.gradeId = this.gradeList[value].key
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
        this.secondChange(0)
      }
    },
    secondChange(value) {
      if (value === undefined) {
        this.secondChange(0)
        return
      }
      this.classChoose = this.classList[value].key
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-tree li {
  margin: 3px 0;
}
/deep/ .ant-tree li ul {
  height: 100%;
  overflow: hidden;
}
/deep/ .ant-btn {
  border-radius: 4px;
}
</style>
