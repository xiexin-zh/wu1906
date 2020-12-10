<template>
  <a-modal
    width="800px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-form-item label="学期名称" v-bind="formItemLayout">
        <div class="qui-fx">
          <a-select
            :disabled="disabled"
            v-decorator="[
              'schoolYearName',
              { initialValue: appForm.schoolYearName, rules: [{ required: true, message: '请选择学年' }] },
            ]"
            placeholder="请选择学年"
            @change="change"
          >
            <a-select-option v-for="list in bureauLevel" :key="list">
              {{ list }}
            </a-select-option>
          </a-select>
          <a-select
            v-decorator="[
              'semesterName',
              { initialValue: appForm.semesterName, rules: [{ required: true, message: '请选择学期' }] },
            ]"
            placeholder="请选择学期"
          >
            <a-select-option key="第一学期"> 第一学期 </a-select-option>
            <a-select-option key="第二学期"> 第二学期 </a-select-option>
          </a-select>
        </div>

      </a-form-item>
      <a-form-item label="起止日期" v-bind="formItemLayout">
        <a-range-picker
          v-decorator="[
            'time',
            {initialValue: [appForm.startDate, appForm.endDate ], rules: [{ required: true, message: '请选择时间' }]}
          ]"
          format="YYYY-MM-DD"
        />
      </a-form-item>
      <div class="tip">
        <a-icon class="u-mar-r10 u-type-primary" type="info-circle" />
        开始日期不早于{{ limit[0] }}年8月1日，结束日期不晚于{{ limit[1] }}年7月31日。
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
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
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get () {
        return this.value
      },
      set () {
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
      appForm: {},
      bureauLevel: [],
      limit: [],
      detailId: '',
      disabled: false
    }
  },
  mounted() {
    const year = new Date().getFullYear()
    for (let i = 0; i < 6; i++) {
      this.bureauLevel[i] = `${year + i}-${year + 1 + i}学年`
    }
  },
  methods: {
    ...mapActions('home', ['addHighTerm', 'updateHighTerm', 'getSubById', 'getHighTerm', 'deleteSub']),
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    change(value) {
      this.limit = value.split('学年')[0].split('-')
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.schoolCode = this.userInfo.schoolCode
          const startDate = moment(values.time[0]).format('YYYY-MM-DD')
          const endDate = moment(values.time[1]).format('YYYY-MM-DD')
          if (`${this.limit[0]}-08-01` <= startDate && endDate <= `${this.limit[1]}-07-31`) {
            if (!this.detailId) {
              this.confirmLoading = true
              this.addHighTerm({ ...values, startDate, endDate })
                .then(res => {
                  this.$message.success('添加成功')
                  this.$tools.goNext(() => {
                    this.$emit('update')
                    this.reset()
                  })
                })
                .catch(() => {
                  this.error()
                })
            } else {
              this.confirmLoading = true
              values.id = this.detailId
              this.updateHighTerm({ ...values, startDate, endDate })
                .then(res => {
                  this.$message.success('编辑成功')
                  this.$tools.goNext(() => {
                    this.$emit('update')
                    this.reset()
                  })
                })
                .catch(() => {
                  this.error()
                })
            }
          } else {
            this.$message.warning('请选择正确的时间')
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
