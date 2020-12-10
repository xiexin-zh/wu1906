<template>
  <sub-form
    ref="form"
    @submit-form="submitForm"
    :title="title"
    :zIndex="99999"
    v-if="formStatus"
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
      { key: new Date().getFullYear(), val: new Date().getFullYear() },
      { key: new Date().getFullYear() - 1, val: new Date().getFullYear() - 1 },
      { key: new Date().getFullYear() - 2, val: new Date().getFullYear() - 2 },
      { key: new Date().getFullYear() - 3, val: new Date().getFullYear() - 3 },
      { key: new Date().getFullYear() - 4, val: new Date().getFullYear() - 4 },
      { key: new Date().getFullYear() - 5, val: new Date().getFullYear() - 5 },
      { key: new Date().getFullYear() - 6, val: new Date().getFullYear() - 6 }
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
    value1: 'gradeCode',
    value2: 'subject',
    value3: 'class',
    initValue1: [],
    initValue2: [],
    initValue3: [],
    type: 'threeLinkSelect',
    required: false,
    label: '班级',
    placeholder1: '请选择年级',
    placeholder2: '请选择专业',
    placeholder3: '请选择班级',
    firstList: [],
    secondList: [],
    threeList: []
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
      this.formData[6].disabled = true
      this.formData[6].initValue1 = val.gradeName ? `${[val.gradeName]}级` : ['请选择']
      this.formData[6].initValue2 = val.subjectName ? [val.subjectName] : ['请选择']
      this.formData[6].initValue3 = val.className ? [val.className] : ['请选择']
      this.gradeId = val.gradeCode
      this.classChoose = val.id
    }
  },
  methods: {
    ...mapActions('home', ['getClassList', 'getGradeList', 'addStudent', 'addHighStu']),
    submitForm(values) {
      values.hasDorm = values.hasDorm === '住读' ? '1' : values.hasDorm === '走读' ? '0' : values.hasDorm
      values.schoolCode = this.userInfo.schoolCode
      values.schoolId = this.userInfo.schoolId
      const req = {
        ...values,
        ...this.classInfo,
        grade: this.classInfo.gradeName,
        admissionTime: values.admissionTime[0] || values.admissionTime,
        photoUrl: this.fileList.length > 0 ? this.fileList[0].url : ''
      }
      this.addHighStu(req)
        .then(() => {
          this.$message.success('添加成功')
          this.$tools.goNext(() => {
            this.$refs.form.reset()
            this.$emit('closeModel')
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
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
