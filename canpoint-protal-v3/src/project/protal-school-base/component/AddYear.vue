<template>
  <a-modal
    width="800px"
    :title="title + '学年'"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-form-item label="学年名称" v-bind="formItemLayout">
        <div class="u-fx">
          <a-select
            :disabled="disabled"
            v-decorator="['name', { initialValue: appForm.name, rules: [{ required: true, message: '请选择学年' }] }]"
            placeholder="请选择学年"
            @change="change"
          >
            <a-select-option v-for="list in bureauLevel" :key="list">
              {{ list }}
            </a-select-option>
          </a-select>
        </div>
      </a-form-item>
      <a-form-item label="学年起止日期" v-bind="formItemLayout">
        <a-range-picker
          :disabled="datedisabled"
          v-decorator="[
            'schoolyeartime',
            { initialValue: [appForm.startTime, appForm.endTime], rules: [{ required: true, message: '请选择时间' }] }
          ]"
          format="YYYY-MM-DD"
        />
      </a-form-item>
      <div v-if="!datedisabled && limit.length > 0" class="tip u-mar-b20">
        <a-icon class="u-mar-r10 u-type-primary u-font-1" type="info-circle" />
        开始日期需在{{ limit[0] }}年{{ defaultStartDate }}，结束日期需在{{ limit[1] }}年。学年创建后起止日期不可修改，请谨慎操作
      </div>
      <a-form-item label="第一学期" v-bind="formItemLayout">
        <a-range-picker
          v-decorator="[
            'onesemester',
            {
              initialValue: [appForm.upStartTime, appForm.upEndTime],
              rules: [{ required: true, message: '请选择时间' }]
            }
          ]"
          format="YYYY-MM-DD"
        />
      </a-form-item>
      <a-form-item label="第二学期" v-bind="formItemLayout">
        <a-range-picker
          v-decorator="[
            'twosemester',
            {
              initialValue: [appForm.downStartTime, appForm.downEndTime],
              rules: [{ required: true, message: '请选择时间' }]
            }
          ]"
          format="YYYY-MM-DD"
        />
      </a-form-item>
      <div class="tip u-mar-b20">
        <a-icon class="u-mar-r10 u-type-primary u-font-1" type="info-circle" />
        第一学期、第二学期的起止日期需在学年起止日期之内、且不可有交叉
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'AddYear',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    appForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      confirmLoading: false,
      bureauLevel: [],
      limit: [],
      disabled: false,
      datedisabled: false,
      defaultStartDate: ''
    }
  },
  created() {
    console.log(this.appForm)
    if (this.appForm.id) {
      this.disabled = true
      this.datedisabled = true
      this.limit = this.appForm.name.split('学年')[0].split('-')
    } else {
      if (this.appForm.name) {
        this.disabled = true
        this.datedisabled = false
        this.defaultStartDate = this.appForm.startTime.format('MM月DD日')
        this.limit = this.appForm.name.split('学年')[0].split('-')
      } else {
        const year = new Date().getFullYear()
        for (let i = 0; i < 2; i++) {
          this.bureauLevel[i] = `${year - 1 + i}-${year + i}学年`
        }
      }
    }
  },
  methods: {
    ...mapActions('home', ['addSchoolYearApi', 'editSchoolYearApi']),
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    // 切换学年
    change(value) {
      this.limit = value.split('学年')[0].split('-')
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          values.schoolCode = this.schoolCode
          const startTime = moment(values.schoolyeartime[0]).format('YYYY-MM-DD')
          const endTime = moment(values.schoolyeartime[1]).format('YYYY-MM-DD')
          if (this.disabled && !this.datedisabled && startTime !== this.appForm.startTime.format('YYYY-MM-DD')) {
            this.$message.warning(`开始日期需在${this.appForm.startTime.format('YYYY年MM月DD日')}`)
            return
          }
          if (`${this.limit[0]}-12-31` < startTime || `${this.limit[0]}-01-01` > startTime || endTime > `${this.limit[1]}-12-31` || endTime < `${this.limit[1]}-01-01`) {
            this.$message.warning('请选择正确的学年起止日期')
            return
          }
          if (!values.onesemester[0] || !values.onesemester[1] || !values.twosemester[0] || !values.twosemester[1]) {
            this.$message.warning('请选择学期起止日期')
            return
          }
          const upStartTime = moment(values.onesemester[0]).format('YYYY-MM-DD')
          const upEndTime = moment(values.onesemester[1]).format('YYYY-MM-DD')
          const downStartTime = moment(values.twosemester[0]).format('YYYY-MM-DD')
          const downEndTime = moment(values.twosemester[1]).format('YYYY-MM-DD')
          if (startTime > upStartTime || endTime < downEndTime || upEndTime > downStartTime) {
            this.$message.warning('请选择正确的学期起止日期')
            return
          }
          this.confirmLoading = true
          if (this.appForm.id) values.id = this.appForm.id
          const req = { ...values, startTime, endTime, upStartTime, upEndTime, downStartTime, downEndTime }
          try {
            this.appForm.id ? await this.editSchoolYearApi(req) : await this.addSchoolYearApi(req)
            this.$message.success(`${this.title}成功`)
            this.$tools.goNext(() => {
              this.$emit('update')
              this.reset()
            })
          } catch (err) {
            this.error()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tip {
  margin-left: 130px;
}
</style>
