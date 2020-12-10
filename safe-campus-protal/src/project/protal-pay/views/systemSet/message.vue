<template>
  <div class="common-set page-layout qui-fx-ver">
    <div class="form">
      <a-form>
        <div>
          <a-form-item v-bind="formItemLayout" label="消息类型">
            <a-checkbox-group @change="msgChange" v-model="msgType">
              <a-row>
                <a-col :span="24">
                  <a-checkbox value="1">
                    发起收费
                  </a-checkbox>
                </a-col>
              </a-row>
              <a-row type="flex" justify="center" align="middle" class="u-mar-b10">
                <a-col :span="8">
                  <a-checkbox value="2">
                    收费即将过期
                  </a-checkbox>
                </a-col>
                <a-col :span="16">
                  <a-row type="flex" justify="center" align="middle">
                    <a-col :span="5" class="u-mar-r10">剩余</a-col>
                    <a-col :span="10"><a-input addon-after="天" :min="0" type="number" v-model="warnDay"/></a-col>
                    <a-col :span="5" class="u-mar-l10">提醒</a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row class="u-mar-b10">
                <a-col :span="24">
                  <a-checkbox value="3">
                    账单更新
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </div>
        <div>
          <a-form-item v-bind="formItemLayout" label="通知方式">
            <a-checkbox-group @change="informChange" v-model="informType">
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
            <a-checkbox-group @change="targetChange" v-model="targetType" style="width: 200px">
              <a-row class="u-mar-b10" type="flex" align="middle">
                <a-col :span="14">学生消息通知</a-col>
                <a-col :span="10">
                  <a-checkbox value="16">
                    家长
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
      <div>
        <img style="position: fixed; right: 60px; bottom: 60px;" src="../../assets/img/illustration.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { Switch } from 'ant-design-vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Message',
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
      msgType: [],
      informType: [],
      targetType: [],
      warnDay: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    warnDay(val) {
      this.warnDay = val
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('home', ['getMsgSet', 'addMessageSet']),
    async init() {
      const res = await this.getMsgSet(this.userInfo.schoolCode)
      res.data.msgTypeSettings.forEach(item => {
        this.msgType.push(item.msgType)
        this.warnDay = item.msgType == '2' ? item.warnDay : ''
      })
      res.data.noticeTypeSettings.forEach(item => {
        this.informType.push(item.noticeType)
      })
      res.data.noticeUserSettings.forEach(item => {
        this.targetType.push(item.userType)
      })
      this.msgType = String(this.msgType).split(',')
      this.informType = String(this.informType).split(',')
      this.targetType = String(this.targetType).split(',')
    },
    msgChange(checkedValues) {
      this.msgType = checkedValues
    },
    informChange(checkedValues) {
      this.informType = checkedValues
    },
    targetChange(checkedValues) {
      this.targetType = checkedValues
    },
    handleSubmit() {
      const req = {
        msgTypeSettings: this.msgType.map(el => {
          return {
            msgType: el,
            schoolCode: this.userInfo.schoolCode,
            warnDay: el == '2' ? this.warnDay : '0'
          }
        }),
        noticeTypeCodes: this.informType,
        noticeUserCodes: this.targetType,
        schoolCode: this.userInfo.schoolCode
      }
      this.addMessageSet(req).then(res => {
        this.$message.success('保存成功')
        this.msgType = []
        this.informType = []
        this.targetType = []
        this.init()
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
