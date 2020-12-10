<template>
  <a-modal
    width="650px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :okText="okText"
    :confirmLoading="confirmLoading"
  >
    <div v-if="type === 1 || type === 3" class="tip mar-b10">
      * 请将空白新卡置于发卡器上发卡
    </div>
    <a-form :form="form">
      <a-form-item label="新卡号" v-bind="formItemLayout" v-if="type === 3">
        <a-input
          v-decorator="[
            'card',
            { initialValue: cardInfo.card, rules: [{ required: true, message: '请输入新卡号' }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="卡号" v-bind="formItemLayout" v-if="type === 1" required>
        <a-input
          v-decorator="[
            'card',
            { initialValue: cardInfo.card, rules: [{ required: true, message: '请输入卡号' }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="姓名" v-bind="formItemLayout">
        <a-input v-decorator="[ 'userName', { initialValue: cardInfo.userName} ]" disabled />
      </a-form-item>
      <a-form-item label="班级/部门" v-bind="formItemLayout">
        <a-input v-decorator="[ 'orgName', { initialValue: cardInfo.orgName} ]" disabled/>
      </a-form-item>
      <a-form-item label="身份" v-bind="formItemLayout">
        <a-input v-decorator="[ 'userIdentity', { initialValue: cardInfo.userIdentity === 8 ? '学生' : '教职工'}]" disabled/>
      </a-form-item>
      <a-form-item label="学号/工号" v-bind="formItemLayout">
        <a-input v-decorator="[ 'workNo', { initialValue: cardInfo.workNo} ]" disabled/>
      </a-form-item>
      <a-form-item label="原卡号" v-bind="formItemLayout" v-if="type === 3">
        <a-input v-decorator="[ 'card', { initialValue: cardInfo.card} ]" disabled/>
      </a-form-item>
      <a-form-item label="卡号" v-bind="formItemLayout" v-if="type === 2 || type === 4 || type === 5">
        <a-input v-decorator="[ 'card', { initialValue: cardInfo.card} ]" disabled/>
      </a-form-item>
      <a-form-item label="状态" v-bind="formItemLayout">
        <a-input v-decorator="[ 'status', { initialValue: cardInfo.status === -1 ? '未发卡' : cardInfo.status === 0 ? '启用' : cardInfo.status === 2 ? '禁用' :'' } ]" disabled/>
      </a-form-item>
      <a-form-item label="卡类型" v-bind="formItemLayout" v-if="type !== 1">
        <a-input v-decorator="[ 'cardName', { initialValue: cardInfo.cardName} ]" disabled/>
      </a-form-item>
      <a-form-item label="卡类型" v-bind="formItemLayout" v-if="type === 1" required>
        <a-select
          style="width:100%"
          @change="changeType"
          v-decorator="[
            'cardType',
            { initialValue: cardInfo.cardType, rules: [{ required: true, message: '请选择卡类型' }] }
          ]"
          placeholder="请选择卡类型"
        >
          <a-select-option v-for="item in dataList" :key="item.cardType" :value="item.cardType">
            {{ item.cardName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="联机日消费限额" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="type === 1">
        <a-input v-decorator="[ 'dailyMaxConsumeAmount', { initialValue: ruleInfo.dailyMaxConsumeAmount} ]" disabled/>
      </a-form-item>
      <a-form-item label="脱机日消费限额" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="type === 1">
        <a-input v-decorator="[ 'offlineConsumeAmount', { initialValue: ruleInfo.offlineConsumeAmount} ]" disabled/>
      </a-form-item>
      <a-form-item label="单次消费限额" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="type === 1">
        <a-input v-decorator="[ 'singleConsume', { initialValue: ruleInfo.singleConsume} ]" disabled/>
      </a-form-item>
      <a-form-item label="账户余额" v-bind="formItemLayout" v-if="type !== 1">
        <a-input v-decorator="[ 'balance', { initialValue: cardInfo.balance} ]" disabled/>
      </a-form-item>
      <a-form-item label="换卡原因" v-bind="formItemLayout" v-if="type === 3" required>
        <a-select
          style="width:100%"
          @change="changeType"
          v-decorator="[
            'remark',
            { initialValue: cardInfo.remark, rules: [{ required: true, message: '请选择换卡原因' }] }
          ]"
          placeholder="请选择换卡原因"
        >
          <a-select-option value="卡片丢失">卡片丢失</a-select-option>
          <a-select-option value="卡片损坏">卡片损坏</a-select-option>
          <a-select-option value="其他">其他</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="余额处理" v-bind="formItemLayout" v-if="type === 5">
        <a-radio-group
          @change="changeProtocol"
          v-decorator="[
            'handleStatus',
            {
              initialValue: cardInfo.handleStatus,
              rules: [{ required: true, message: '请选择余额处理' }]
            }
          ]"
        >
          <a-radio value="0">退还余额</a-radio>
          <a-radio value="1">不退余额</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="备注" v-bind="formItemLayout" v-if="type === 2 || type === 5" required>
        <a-textarea
          v-decorator="[
            'remark',
            {
              initialValue: cardInfo.remark,
              rules: [{ required: true, message: '请输入备注' }]
            }
          ]"
          placeholder="请输入备注" />
      </a-form-item>
      <div v-if="type === 2" class="tip mar-l30"> * 挂失后卡片及刷脸消费将无法正常使用 </div>
      <div v-if="type === 3" class="tip mar-l30"> * 换卡后原卡将被自动销卡作废，原卡余额、卡类型信息将转移至新卡，如有额外换卡费用，向用户收取现金 </div>
      <div v-if="type === 5" class="tip mar-l30"> * 退还余额，将退还账户所有余额 不退余额，仅变更卡状态，账户余额不变 </div>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CardOperate',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    cardInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    okText: {
      type: String,
      default: ''
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
  data() {
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      type: 1,
      ruleInfo: {},
      dataList: {}
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [ 'getRuleInfo', 'bindCard', 'changeCard', 'unBindCard', 'reportCard', 'getCardType'
    ]),
    async showList () {
      const res = await this.getCardType()
      this.dataList = res.data
    },
    async ruleGet (userType) {
      const res = await this.getRuleInfo({ userType: userType })
      if (res.data) {
        this.ruleInfo = res.data
      } else {
        this.ruleInfo = {
          dailyMaxConsumeAmount: 0,
          offlineConsumeAmount: 0,
          singleConsume: 0
        }
      }
    },
    changeType(value) {
      this.deviceType = value
    },
    changeProtocol(event) {
      this.protocolType = event.target.value
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let res = null
          if (this.type === 1) {
            const req = {
              ...this.cardInfo,
              ...this.ruleInfo,
              cardType: values.cardType,
              card: values.card
            }
            res = this.bindCard(req)
          } else if (this.type === 3) {
            const req = {
              ...this.cardInfo,
              card: values.card,
              remark: values.remark
            }
            res = this.changeCard(req)
            // 4 解挂req2  5 销卡req1  2 挂失req3
          } else if (this.type === 4 || this.type === 5 || this.type === 2) {
            const status = this.type === 4 ? 0 : this.type === 5 ? 2 : 1
            const req1 = {
              ...this.cardInfo,
              handleStatus: Number(values.handleStatus),
              remark: values.remark,
              status: status
            }
            const req2 = {
              ...this.cardInfo,
              status: status
            }
            const req3 = {
              ...this.cardInfo,
              remark: values.remark,
              status: status
            }
            res = this.reportCard(this.type === 5 ? req1 : this.type === 4 ? req2 : req3)
          }
          res.then(() => {
            this.$message.success('操作成功')
            this.$tools.goNext(() => {
              this.confirmLoading = false
              this.status = false
              this.$emit('update', false)
            })
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tip {
  color: @tip-color;
}
.ant-form-item {
  margin-bottom: 10px!important;
}
.mar-l30 {
  margin-left: 100px;
}
</style>
