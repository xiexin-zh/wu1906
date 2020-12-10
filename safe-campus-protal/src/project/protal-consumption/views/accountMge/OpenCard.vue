<template>
  <a-modal width="800px" title="开卡" v-model="status" :maskClosable="false" :destroyOnClose="true">
    <div class="open-card">
      <a-form id="components-form-demo-validate-other" :form="form" v-bind="formItemLayout">
        <a-form-item label="姓名">
          <span class="ant-form-text">{{ detail.userName }}</span>
        </a-form-item>
        <a-form-item label="学号/工号">
          <span class="ant-form-text">{{ detail.workNo }}</span>
        </a-form-item>
        <a-form-item label="班级/部门">
          <span class="ant-form-text">{{ detail.classBoards }}</span>
        </a-form-item>
        <a-form-item label="身份">
          <span class="ant-form-text">{{ baseData.userType(detail.userType) }}</span>
        </a-form-item>
        <a-form-item label="状态">
          <span class="ant-form-text">未开户</span>
        </a-form-item>
        <a-form-item label="每日消费限额">
          <a-input v-model="detail.consumeRule.everydayConsume" placeholder="请输入每日消费限额" />
        </a-form-item>
        <a-form-item label="单次消费限额">
          <a-input v-model="detail.consumeRule.singleConsume" placeholder="请输入单次消费限额" />
        </a-form-item>
        <a-form-item label="优惠类型">
          <a-radio-group v-model="detail.consumeRule.preferType">
            <a-radio value="0">无优惠</a-radio>
            <a-radio value="1">折扣</a-radio>
            <a-radio value="2">减免</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="detail.consumeRule.preferType === '1'" label="折扣比例">
          <a-input v-model="detail.consumeRule.discount" placeholder="请输入折扣比例" />
        </a-form-item>
        <a-form-item v-if="detail.consumeRule.preferType === '2'" label="减免金额">
          <a-input v-model="detail.consumeRule.remit" placeholder="请输入减免金额" />
        </a-form-item>
        <a-form-item label="账户余额">
          <span class="ant-form-text">{{ detail.balance }}</span>
        </a-form-item>
        <a-form-item label="押金">
          <span class="ant-form-text">{{ detail.deposit }}</span>
        </a-form-item>
      </a-form>
    </div>
    <template slot="footer">
      <a-button key="submit" type="primary" :loading="loading" @click="_addOpenAccount">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import baseData from '../../assets/js/base'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'OpenCard',
  props: {
    value: {
      type: Boolean
    },
    userCode: {
      type: String,
      default: ''
    },
    userType: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    status: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      loading: false,
      baseData,
      preferType: '0',
      detail: { consumeRule: { everydayConsume: 0, singleConsume: 0 } },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'validate_other' })
  },
  mounted() {
    this._getOpenAccount()
  },
  methods: {
    ...mapActions('home', ['getOpenAccount', 'addOpenAccount', 'getTeaOpenAccount']),
    /**
     * @description 查询开户人信息
     */
    async _getOpenAccount() {
      try {
        let res = null
        if (this.userType === '1') {
          res = await this.getOpenAccount(this.userCode)
        } else if (this.userType === '2') {
          res = await this.getTeaOpenAccount(this.userCode)
        }
        this.detail = res.data
      } catch (err) {
        this.$emit('hide')
      }
    },
    /**
     * @description 开户
     */
    async _addOpenAccount() {
      console.log(this.preferType)
      if (!this.detail.consumeRule.everydayConsume) {
        this.$message.warning('请输入单日消费限额')
        return
      }
      if (!this.detail.consumeRule.singleConsume) {
        this.$message.warning('请输入单次消费限额')
        return
      }
      this.loading = true
      try {
        await this.addOpenAccount({
          consumeRule: {
            ...this.detail
          },
          ...this.detail
        })
        this.$message.success('开户成功')
        this.loading = true
        this.status = false
        this.$tools.goNext(() => {
          this.$parent._getAccountList()
        })
      } catch (err) {
        this.status = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.open-card {
  .ant-form-item {
    margin-bottom: 10px !important;
  }
}
</style>
