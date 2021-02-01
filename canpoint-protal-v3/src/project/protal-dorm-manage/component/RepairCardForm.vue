<template>
  <a-modal
    width="800px"
    title="补卡"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="reset"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-form-item label="归寝时间" required v-bind="formItemLayout">
        <a-date-picker
          v-decorator="[
            'repairCardDate',
            {
              initialValue: moment(new Date(), 'YYYY-MM-DD')
            }
          ]"
          disabled
        />
        <a-time-picker
          format="HH:mm"
          v-decorator="['repairCardTime', { rules: [{ required: true, message: '请选择时间!' }] }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'RepairCardForm',
  components: {},
  props: {
    // 是否显示弹出框
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  mounted() {},
  data() {
    return {
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
    }
  },
  methods: {
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
          if (!values) return
          this.confirmLoading = true
          this.$emit('submit', values)
        } else {
          this.$message.warning('请选择时间!')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
