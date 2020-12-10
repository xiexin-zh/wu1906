<template>
  <div class="common-set page-layout qui-fx-ver">
    <div class="form">
      <a-form :form="form">
        <div>
          <a-form-item v-bind="formItemLayout" label="消息类型">
            <a-checkbox-group @change="msgChange" :defaultValue="msgType">
              <a-row type="flex" justify="center" align="middle">
                <a-col :span="8">
                  <a-checkbox value="1">
                    余额不足提醒
                  </a-checkbox>
                </a-col>
                <a-col :span="16">
                  <a-row type="flex" justify="center" align="middle">
                    <a-col :span="5" class="u-mar-r10">余额小于</a-col>
                    <a-col :span="10"><a-input addon-after="元" defaultValue="200" :min="0" type="number" v-model="minBalance" /></a-col>
                    <a-col :span="5" class="u-mar-l10">提醒</a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="2">
                    补助到账通知
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="3">
                    充值到账通知
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="4">
                    退款到账通知
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="5">
                    消费通知
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="6">
                    撤销通知
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div>
          <a-form-item v-bind="formItemLayout" label="通知方式">
            <a-checkbox-group @change="informChange" :defaultValue="informType">
              <a-row class="u-mar-b10" type="flex" justify="center" align="middle">
                <a-col :span="24">
                  <a-checkbox value="1">
                    微信公众号
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="2">
                    短信
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div>
          <a-form-item v-bind="formItemLayout" label="通知对象">
            <a-checkbox-group @change="targetChange" :defaultValue="targetType" style="width: 200px">
              <a-row class="u-mar-b10" type="flex" align="middle">
                <a-col :span="14">学生消息通知</a-col>
                <a-col :span="10">
                  <a-checkbox value="1">
                    家长
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="14">教职工消息通知</a-col>
                <a-col :span="10">
                  <a-checkbox value="2">
                    本人
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div>
          <a-form-item default-checked :wrapper-col="{ span: 15, offset: 5 }">
            <a-button type="primary" @click="handleSubmit">保存</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script>
import { Switch } from 'ant-design-vue'
export default {
  name: 'MessageSettings',
  components: {
    ASwitch: Switch
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      msgType: ['1', '2', '3', '4', '5', '6'],
      informType: ['1'],
      targetType: ['1', '2'],
      minBalance: 200
    }
  },
  mounted() {
  },
  methods: {
    msgChange(checkedValues) {
      console.log('checked = ', checkedValues)
      this.msgType = checkedValues
    },
    informChange(checkedValues) {
      console.log('checked = ', checkedValues)
      this.informType = checkedValues
    },
    targetChange(checkedValues) {
      console.log('checked = ', checkedValues)
      this.targetType = checkedValues
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this.minBalance)
          console.log(this.msgType)
          console.log(this.targetType)
          console.log(this.informType)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.common-set {
  .form {
    margin-top: 24px;
  }
}
</style>
