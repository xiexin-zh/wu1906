<template>
  <a-modal
    width="800px"
    :title="`${title}学生`"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form" layout="inline">
      <a-row>
        <a-col :span="12">
          <a-form-item label="学生姓名" v-bind="formItemLayout" style="width: 100%">
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
          <a-form-item label="学号" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入学号"
              v-decorator="[
                'workNo',
                {
                  initialValue: appForm.workNo,
                  rules: [{ required: true, message: '请输入学号' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="走住读" v-bind="formItemLayout" style="width: 100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[
                'hasDorm',
                {
                  initialValue: appForm.hasDorm,
                  rules: [{ required: true, message: '请选择走住读状态' }]
                }
              ]"
            >
              <a-radio value="0">走读</a-radio>
              <a-radio value="1">住读</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" v-bind="formItemLayout" style="width: 100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[
                'gender',
                {
                  initialValue: appForm.gender,
                  rules: [{ required: true, message: '请选择性别' }]
                }
              ]"
            >
              <a-radio value="1">男</a-radio>
              <a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="入学年份" v-bind="formItemLayout" style="width: 100%">
            <a-select
              v-decorator="[
                'admissionYear',
                {
                  initialValue: appForm.admissionYear,
                  rules: [{ required: true, message: '请选择入学年份' }]
                }
              ]"
              placeholder="请选择入学年份"
            >
              <a-select-option
                v-for="(year, index) in 6"
                :value="new Date().getFullYear() - index"
                :key="index"
              >{{ new Date().getFullYear() - index }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="身份证号码" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入身份证号码"
              v-decorator="[
                'idNumber',
                {
                  initialValue: appForm.idNumber,
                  rules: [{ required: false, pattern: idCard, message: '请输入正确的身份证号码' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="班级" v-bind="formItemLayout" style="width: 100%">
            <choose-high-grade
              v-if="schoolType"
              :school="school"
              @choose="choose"
              :placeholder="placeholder"
              :disabled="disabled"
            ></choose-high-grade>
            <choose-grade
              v-else
              :school="school"
              :schoolYearCode="schoolYearCode"
              @choose="choose"
              :placeholder="placeholder"
              :disabled="disabled"
            ></choose-grade>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="卡号" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入卡号"
              v-decorator="['cardNo', { initialValue: appForm.cardNo }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="人脸照片" v-bind="itemLayout" style="width: 100%">
          <div class="qui-fx qui-fx-ac">
            <u-upload
              isCheck
              showProgressTag
              type="image"
              :length="1"
              v-model="imgList"
              :schoolCode="schoolCode"
            ></u-upload>
            <span style="font-size: 12px; margin-left: 10px">大小20到100kB，像素400x400到800x800，格式仅jpg</span>
          </div>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" v-bind="itemLayout" style="width: 100%">
          <a-textarea
            placeholder="请输入备注"
            v-decorator="[
              'introduce',
              { initialValue: appForm.introduce, rules: [{ required: false, message: '请输入备注' }] }
            ]"
          />
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import ChooseGrade from './ChooseGrade'
import ChooseHighGrade from './ChooseHighGrade'
export default {
  name: 'AddStu',
  components: {
    ChooseGrade,
    ChooseHighGrade
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
    school: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      defaultValue: [],
      imgList: [],
      idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
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
      type: 1,
      appForm: {},
      classCode: '',
      schoolType: false,
      schoolYearCode: '',
      placeholder: '',
      disabled: false,
      gradeCode: ''
    }
  },
  mounted() {
    this.schoolType = this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9'
  },
  methods: {
    ...mapActions('home', ['addStudent', 'updateStu']),
    choose(value, info) {
      this.classCode =
        this.schoolType && value.length === 3 ? value[2] : !this.schoolType && value.length === 2 ? value[1] : ''
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
          this.submit(values)
        }
      })
    },
    async submit(values) {
      try {
        const req = {
          ...this.appForm,
          photoUrl: this.imgList.length > 0 ? this.imgList[0].url : '',
          ...values,
          schoolCode: this.schoolCode,
          schoolYearCode: this.schoolYearCode,
          classCode: this.classCode,
          gradeCode: this.gradeCode
        }
        req.hasDorm = req.hasDorm === '1'
        this.title === '添加' ? await this.addStudent(req) : await this.updateStu(req)
        this.reset()
        this.$message.success(`${this.title}成功`)
        this.$tools.goNext(() => {
          this.$emit('update')
        })
      } catch (err) {
        this.error()
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 14px;
}
</style>
