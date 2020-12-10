<template>
  <div class="base-form">
    <a-form :form="form" @submit="handleSubmit">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="专业" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-select
              v-decorator="['majorCode', { rules: [{ required: true, message: '请选择专业' }] }]"
              placeholder="请选择专业"
            >
              <a-select-option v-for="item in subjectList" :key="item.subjectCode">
                {{ item.subjectName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="学制" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-input
              type="number"
              :min="0"
              v-decorator="[
                'systemType',
                {
                  rules: [{ required: false, message: '请输入学制' }, { validator: valSystemType }]
                }
              ]"
              placeholder="请选择学制"
            />
          </a-form-item>
          <a-form-item label="选修学分" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-input
              type="number"
              min="0"
              v-decorator="[
                'chooseScore',
                {
                  rules: [
                    { required: false, message: '请输入选修学分' },
                    { validator: handleConfirmNumber }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="最低学分" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-input
              type="number"
              v-decorator="[
                'lessScore',
                {
                  rules: [
                    { required: false, message: '请输入最低学分' },
                    { validator: handleConfirmNumber }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="招生对象" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-textarea
              placeholder="（限制500字）"
              :rows="8"
              :max-length="500"
              v-decorator="[
                'recruitObject',
                { rules: [{ required: false, message: '限制500字内' }] }
              ]"
            />
          </a-form-item>
          <a-form-item label="就业岗位群" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-textarea
              placeholder="（限制500字）"
              :rows="8"
              :max-length="500"
              v-decorator="['obtainJob', { rules: [{ required: false, message: '限制500字内' }] }]"
            />
          </a-form-item>
          <a-form-item>
            <div style="display: flex; justify-content: center">
              <a-button type="primary" style="margin-right: 40px"> 取消 </a-button>
              <a-button type="primary" html-type="submit"> 保存 </a-button>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="专业培养年份" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-select
              v-decorator="[
                'gradeYear',
                { rules: [{ required: true, message: '请选择专业培养年份' }] }
              ]"
              placeholder="请选择专业培养年份"
            >
              <a-select-option v-for="item in gradeList" :key="item.gradeName">
                {{ item.gradeName }}级
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="学历" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-select
              v-decorator="[
                'educationType',
                { rules: [{ required: false, message: '请选择学历' }] }
              ]"
              placeholder="请选择学历"
            >
              <a-select-option :value="1"> 中职 </a-select-option>
              <a-select-option :value="2"> 高职(高专) </a-select-option>
              <a-select-option :value="3"> 本科 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="必修学分" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-input
              type="number"
              v-decorator="[
                'requiredScore',
                {
                  rules: [
                    { required: false, message: '请输入必修学分' },
                    { validator: handleConfirmNumber }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="培养目标" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <a-textarea
              placeholder="（限制500字）"
              :rows="8"
              :max-length="500"
              v-decorator="[
                'cultureTarget',
                { rules: [{ required: false, message: '限制500字内' }] }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'BaseForm',
  props: {
    programId: {
      required: true
    },
    programInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      gradeList: [],
      subjectList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getSubject()
    this.getGrade()
  },
  watch: {
    programInfo(newVal, oldVal) {
      const {
        majorCode,
        systemType,
        chooseScore,
        lessScore,
        recruitObject,
        obtainJob,
        gradeYear,
        educationType,
        requiredScore,
        cultureTarget
      } = newVal
      this.form.setFieldsValue({
        majorCode,
        systemType,
        chooseScore,
        lessScore,
        recruitObject,
        obtainJob,
        gradeYear,
        educationType,
        requiredScore,
        cultureTarget
      })
    }
  },
  methods: {
    ...mapActions('home', ['getHighMajorAll', 'getHighGradeList', 'addScheme', 'editScheme']),
    async getSubject() {
      const req = {
        size: 9999,
        page: 1,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighMajorAll(req)
      if (res && res.code === 200) {
        this.subjectList = res.data.records
      }
    },
    async getGrade() {
      const res = await this.getHighGradeList({
        schoolCode: this.userInfo.schoolCode
      })
      if (res && res.code === 200) {
        this.gradeList = res.data.reverse()
      }
    },
    valSystemType(rule, value, callback) {
      const reg = /^\+?[1-9][0-9]*$/
      if (!reg.test(value)) {
        callback('请输入正整数')
      }
      callback()
    },
    handleConfirmNumber(rule, value, callback) {
      if (value < 0) {
        callback('学分不能小于0')
      }
      callback()
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values)
          const list = this.subjectList.filter((item) => item.subjectCode === values.majorCode)
          const majorName = list[0].subjectName
          const req = {
            ...values,
            majorName,
            createName: this.userInfo.userName,
            schoolCode: this.userInfo.schoolCode
          }
          if (this.programId) {
            req.id = this.programId
          }
          const res = this.programId ? await this.editScheme(req) : await this.addScheme(req)
          if (res && res.code === 200) {
            this.$router.go(-1)
          }
        }
      })
    }
  }
}
</script>