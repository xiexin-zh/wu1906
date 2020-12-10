<template>
  <a-modal
    width="750px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form" layout="inline">
      <div class="title">
        <span class="line"></span> 基础信息
      </div>
      <a-row>
        <a-col :span="12">
          <a-form-item label="学生姓名" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入学生姓名"
              v-decorator="[
                'userName',
                {
                  initialValue: appForm.userName,
                  rules: [
                    {
                      max: 10,
                      required: true,
                      message: '请输入学生姓名'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="学号" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入学生学号"
              v-decorator="[
                'workNo',
                {
                  initialValue: appForm.workNo,
                  rules: [
                    {
                      max: 30,
                      required: true,
                      message: '请输入学生学号'
                    }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="性别" v-bind="formItemLayout" style="width:100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[
                'sex',
                {
                  initialValue: appForm.sex,
                  rules: [{ required: true, message: '请选择性别' }]
                }
              ]"
            >
              <a-radio :value="1"> 男 </a-radio>
              <a-radio :value="2"> 女 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="走住读" v-bind="formItemLayout" style="width:100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[
                'hasDorm',
                {
                  initialValue: appForm.hasDorm,
                  rules: [{ required: true, message: '请选择走住读类型' }]
                }
              ]"
            >
              <a-radio value="1"> 住读 </a-radio>
              <a-radio value="0"> 走读 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="入学年份" v-bind="formItemLayout" style="width:100%">
            <a-select
              v-decorator="[
                'admissionTime',
                {
                  initialValue: appForm.admissionTime,
                  rules: [{ required: true, message: '请选择入学年份' }]
                }
              ]"
              placeholder="请选择入学年份"
            >
              <a-select-option :value="new Date().getFullYear()"> {{ new Date().getFullYear() }} </a-select-option>
              <a-select-option :value="new Date().getFullYear() - 1"> {{ new Date().getFullYear() - 1 }} </a-select-option>
              <a-select-option :value="new Date().getFullYear() - 2"> {{ new Date().getFullYear() - 2 }} </a-select-option>
              <a-select-option :value="new Date().getFullYear() - 3"> {{ new Date().getFullYear() - 3 }} </a-select-option>
              <a-select-option :value="new Date().getFullYear() - 4"> {{ new Date().getFullYear() - 4 }} </a-select-option>
              <a-select-option :value="new Date().getFullYear() - 5"> {{ new Date().getFullYear() - 5 }} </a-select-option>
              <a-select-option :value="new Date().getFullYear() - 6"> {{ new Date().getFullYear() - 6 }} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="卡号" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入学生卡号"
              v-decorator="[ 'cardNo', { initialValue: appForm.cardNo, rules: [ { max: 30 }] } ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="班级" v-bind="itemLayout" style="width:100%">
            <a-select
              allowClear
              :disabled="disabled"
              v-decorator="[ 'gradeCode', { initialValue: appForm.gradeCode } ]"
              style="width: calc(33% - 10px); margin-right: 10px"
              placeholder="请选择年级"
              @change="firstChange"
            >
              <a-select-option v-for="(first, i) in firstList" :value="i" :key="i">{{
                first.val
              }}</a-select-option>
            </a-select>
            <a-select
              allowClear
              :disabled="disabled"
              style="width: calc(33% - 10px); margin-right: 10px"
              placeholder="请选择专业"
              @change="secondChange"
              v-decorator="['subject',{ initialValue: appForm.subject }]"
            >
              <a-select-option v-for="(second, i) in secondList" :value="i" :key="i">{{
                second.val
              }}</a-select-option>
            </a-select>
            <a-select
              allowClear
              :disabled="disabled"
              style="width: 33%"
              placeholder="请选择班级"
              v-decorator="[ 'class', { initialValue: appForm.class }]"
            >
              <a-select-option v-for="(three, i) in threeList" :value="i" :key="i">{{
                three.val
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="人脸照片" v-bind="itemLayout" style="width:100%">
          <div class="qui-fx qui-fx-ac">
            <upload-multi is-check :length="1" v-model="fileList" type="face" :fileInfo="fileInfo"></upload-multi>
            <span style="font-size:12px;margin-left:10px;">大小20到100kB，像素400x400到800x800，格式仅jpg</span>
          </div>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" v-bind="itemLayout" style="width:100%">
          <a-textarea
            placeholder="限200字"
            :allowClear="true"
            v-decorator="[ 'remark', { initialValue: appForm.remark, rules: [ { max: 200 }] }]"
          />
        </a-form-item>
      </a-row>
      <!-- <div class="title">
        <span class="line"></span> 户籍信息
      </div>
      <a-row>
        <a-col :span="12">
          <a-form-item label="籍贯" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入籍贯"
              v-decorator="['nativePlace', {initialValue: appForm.nativePlace, rules: [ { max: 30 } ]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="民族" v-bind="formItemLayout" style="width:100%">
            <a-select
              placeholder="请选择民族"
              v-decorator="['nationality',{ initialValue: appForm.nationality }]"
            >
              <a-select-option v-for="lsit in select.native" :key="lsit">
                {{ lsit }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="政治面貌" v-bind="formItemLayout" style="width:100%">
            <a-select
              placeholder="请选择政治面貌"
              v-decorator="['politicalOutlook',{ initialValue: appForm.politicalOutlook } ]"
            >
              <a-select-option v-for="item in select.political" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="户口性质" v-bind="formItemLayout" style="width:100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[ 'registrationNature',{ initialValue: appForm.registrationNature,}]"
            >
              <a-radio value="农业"> 农业 </a-radio>
              <a-radio value="非农"> 非农 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="户口所在地区县以下详细地址" v-bind="formItemLayout" style="width:100%">
          <a-input
            placeholder="请输入户口所在地区县以下详细地址"
            v-decorator="['registrationAddress', {initialValue: appForm.registrationAddress,rules: [{ max: 50 }] }]"
          />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="学生居住地类型" v-bind="formItemLayout" style="width:100%">
          <a-select
            v-decorator="[ 'residentialType',{ initialValue: appForm.residentialType }]"
            placeholder="请选择居住地类型"
          >
            <a-select-option v-for="el in select.residence" :key="el">
              {{ el }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="家庭现住址" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入家庭现住址"
              v-decorator="[ 'homeAddress', { initialValue: appForm.homeAddress, rules: [ { max: 50 } ] } ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所属派出所" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入所属派出所"
              v-decorator="[ 'policeStation', { initialValue: appForm.policeStation, rules: [ { max: 30 } ]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div class="title">
        <span class="line"></span> 家长信息
      </div>
      <a-row>
        <a-col :span="12">
          <a-form-item label="家长姓名" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入家长姓名"
              v-decorator="[ 'parentName',{ initialValue: appForm.parentName, rules: [ { max: 10 } ] } ]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="家长手机号" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入家长手机号"
              v-decorator="[
                'parentMobile',
                {
                  initialValue: appForm.parentMobile,
                  rules: [
                    { max: 30 },
                    { pattern: phone , message: '请输入正确的手机号' }]
                }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="与本人关系" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入与本人关系"
              v-decorator="[ 'relationship', { initialValue: appForm.relationship, rules: [{ max: 10 } ] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否监护人" v-bind="formItemLayout" style="width:100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[ 'hasGuardian', { initialValue: appForm.hasGuardian }]"
            >
              <a-radio value="1"> 是 </a-radio>
              <a-radio value="2"> 否 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="title">
        <span class="line"></span> 其他信息
      </div>
      <a-row>
        <a-col :span="12">
          <a-form-item label="学生来源" v-bind="formItemLayout" style="width:100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[ 'studentSource', { initialValue: appForm.studentSource }]"
            >
              <a-radio value="应届"> 应届 </a-radio>
              <a-radio value="非应届"> 非应届 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="招生对象" v-bind="formItemLayout" style="width:100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[ 'enrollmentTarget', { initialValue: appForm.enrollmentTarget}]"
            >
              <a-radio value="应届初中"> 应届初中 </a-radio>
              <a-radio value="非应届"> 非应届 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="毕业学校" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入毕业学校"
              v-decorator="[ 'graduationSchool', { initialValue: appForm.graduationSchool, rules: [ { max: 10 } ] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="健康状况" v-bind="formItemLayout" style="width:100%">
            <a-input
              placeholder="请输入健康状况"
              v-decorator="['healthyState', {initialValue: appForm.healthyState, rules: [ { max: 10 } ] }]"
            />
          </a-form-item>
        </a-col>
      </a-row> -->
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import UploadMulti from '@c/UploadFace'
import { mapState, mapActions } from 'vuex'
import select from '../../assets/js/table/stuSelect.js'

export default {
  name: 'SubmitForm',
  components: {
    UploadMulti
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    },
    useFormData: function () {
      return this.formData.filter(function (item) {
        return !item.hasOwnProperty('show') || item.show
      })
    }
  },
  data() {
    return {
      select,
      phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      itemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      firstList: [],
      secondList: [],
      threeList: [],
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      appForm: {},
      gradeName: '',
      highSubTerm: [],
      disabled: false
    }
  },
  mounted() {
    this.getGrade()
  },
  methods: {
    ...mapActions('home', [
      'getHighGrade', 'getHighGradeSub', 'getHighClass', 'addHighStu', 'getHighStuDetail', 'updateHighStu'
    ]),
    async _getHighStuDetail(id) {
      this.userId = id
      const res = await this.getHighStuDetail({ id: id })
      const data = res.data
      // data.otherInfo.hasGuardian = res.data.otherInfo.hasGuardian ? '1' : '2'
      this.appForm = Object.assign(data, data.otherInfo)
      this.fileList = this.appForm.photoUrl ? [{ url: this.appForm.photoUrl }] : []
      console.log(' this.userId', this.appForm)
      this.disabled = true
      this.appForm.hasGuardian = this.appForm.hasGuardian ? '1' : '2'
      this.appForm.gradeCode = new Date(this.appForm.admissionTime).getFullYear()
      this.appForm.grade = this.appForm.grade ? `${[this.appForm.grade]}级` : ['请选择']
      this.appForm.subject = this.appForm.subjectName ? [this.appForm.subjectName] : ['请选择']
      this.appForm.class = this.appForm.className ? [this.appForm.className] : ['请选择']
    },
    firstChange(value) {
      console.log('value', value)
      if (value || value === 0) {
        this.gradeName = this.highSubTerm[value].gradeName
        console.log('this.highSubTerm', this.highSubTerm)
        this._getSubjectList()
      }
    },
    // 点击专业获取班级
    secondChange(value) {
      if (value || value === 0) {
        this._getHighClass(this.highSubList[value].subjectCode)
      }
    },
    // 获取年级
    async getGrade() {
      this.firstList = []
      const res = await this.getHighGrade({ schoolCode: this.userInfo.schoolCode })
      this.highSubTerm = res.data
      if (res.data.length === 0) {
        this.gradeCode = []
        this.subject = []
        this.class = []
        return
      }
      res.data.forEach(ele => {
        this.firstList.push({ key: ele.gradeCode, val: `${ele.gradeName}级` })
      })
      this.gradeName = res.data[0].gradeName

      this._getSubjectList()
    },
    // 获取专业
    async _getSubjectList() {
      this.secondList = []
      const req = {
        gradeName: this.gradeName,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighGradeSub(req)
      this.highSubList = res.data
      if (res.data.length === 0) {
        this.subject = []
        this.class = []
        return
      }
      res.data.forEach(ele => {
        this.secondList.push({ key: ele.subjectCode, val: ele.subjectName })
      })
      this.subject = [0]
      this._getHighClass(this.highSubList[0].subjectCode)
    },
    // 查询班级列表
    async _getHighClass(subjectCode) {
      this.threeList = []
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
        this.class = []
        return
      }
      res.data.records.forEach(ele => {
        this.threeList.push({ key: ele.id, val: ele.className })
      })
      this.class = [0]
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // values.hasDorm = values.hasDorm === '住读' ? '1' : values.hasDorm === '走读' ? '0' : values.hasDorm
          values.hasGuardian = values.hasGuardian === '1'
          values.schoolCode = this.userInfo.schoolCode
          values.schoolId = this.userInfo.schoolId
          const req = {
            ...values,
            admissionTime: values.admissionTime[0] || values.admissionTime,
            photoUrl: this.fileList.length > 0 ? this.fileList[0].url : '',
            otherInfo: {
              enrollmentTarget: values.enrollmentTarget,
              graduationSchool: values.graduationSchool,
              hasGuardian: values.hasGuardian,
              healthyState: values.healthyState,
              homeAddress: values.homeAddress,
              nationality: values.nationality,
              nativePlace: values.nativePlace,
              parentMobile: values.parentMobile,
              parentName: values.parentName,
              policeStation: values.policeStation,
              politicalOutlook: values.politicalOutlook,
              registrationAddress: values.registrationAddress,
              registrationNature: values.registrationNature,
              relationship: values.relationship,
              residentialType: values.residentialType,
              studentSource: values.studentSource
            }
          }
          let res = null
          if (this.title === '添加学生') {
            // fixed by xiexin  values.gradeCode values.class和values.subject有等于0的情况
            req.grade = (typeof values.gradeCode === 'number' && values.gradeCode.length !== 0) ? this.highSubTerm[values.gradeCode].gradeName : ''
            req.className = (typeof values.class === 'number' && values.class.length !== 0) ? this.highClass[values.class].className : ''
            req.classCode = (typeof values.class === 'number' && values.class.length !== 0) ? this.highClass[values.class].classCode : ''
            req.subjectName = (typeof values.subject === 'number' && values.subject.length !== 0) ? this.highSubList[values.subject].subjectName : ''
            req.subjectCode = (typeof values.subject === 'number' && values.subject.length !== 0) ? this.highSubList[values.subject].subjectCode : ''
            res = this.addHighStu(req)
          } else {
            req.id = this.userId
            res = this.updateHighStu(req)
          }
          res
            .then(() => {
              this.keywords = ''
              this.$message.success(this.title === '添加学生' ? '添加成功' : '编辑成功')
              this.$tools.goNext(() => {
                this.$emit('update')
                this.confirmLoading = false
                this.status = false
                this.$emit('input', false)
                this.fileList = []
              })
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 14px;
}
.title {
  display: flex;
  align-items: flex-end;
  font-weight: bold;
  margin-bottom: 10px;
  .line {
    display: inline-block;
    width: 6px;
    height: 20px;
    background-color: #6cdeff;
    margin-right: 5px;
  }
}
</style>
