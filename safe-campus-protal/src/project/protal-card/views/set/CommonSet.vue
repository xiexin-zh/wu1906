<template>
  <div class="common-set page-layout qui-fx-ver">
    <div class="form">
      <a-form :form="form">
        <div>
          <a-form-item v-bind="formItemLayout" label="最大充值金额">
            <a-input-number
              style="width: 50%"
              :min="0"
              v-decorator="['maxPay', {initialValue: formData.maxPay}]"
            />
          </a-form-item>
        </div>
        <div>
          <a-form-item v-bind="formItemLayout" label="最大收款金额">
            <a-input-number
              style="width: 50%"
              :min="0"
              v-decorator="['maxColl', {initialValue: formData.maxColl}]"
            />
          </a-form-item>
        </div>
        <div>
          <a-form-item v-bind="formItemLayout" label="最大补助金额">
            <a-input-number
              style="width: 50%"
              :min="0"
              v-decorator="['maxSub', {initialValue: formData.maxSub}]"
            />
          </a-form-item>
        </div>
        <div>
          <a-form-item v-bind="formItemLayout" label="优先消费补助">
            <a-switch v-decorator="['status', {initialValue: formData.status}]" />
          </a-form-item>
        </div>
        <div>
          <a-form-item default-checked :wrapper-col="{ span: 15, offset: 5 }">
            <a-button type="primary" @click="handleSubmit">
              保存
            </a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script>
import { Switch } from 'ant-design-vue'
export default {
  name: 'CommonSet',
  components: {
    ASwitch: Switch
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 12 }
      },
      formData: {
        maxPay: 0,
        maxColl: 0,
        maxSub: 0,
        status: false
      }
    }
  },
  mounted() {},
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .common-set{
    .form{margin-top:24px}
  }
</style>
