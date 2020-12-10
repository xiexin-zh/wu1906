<template>
  <div class="page-layout cunsume-rule qui-fx-ver">
    <a-row type="flex" align="middle" :gutter="20">
      <a-col class="qui-tx-r" :span="3">是否开启脱机消费:</a-col>
      <a-col :span="21">
        <a-switch default-checked @change="onChange" :checked="defaultChecked" />
      </a-col>
    </a-row>
    <a-row :gutter="20" style="margin-top: 30px">
      <a-col style="padding-top: 10px" class="qui-tx-r" :span="3">卡消费规则:</a-col>
      <a-col :span="21">
        <table-list :columns="ruleColumns" :table-list="ruleList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑规则">
              <a-button size="small" class="edit-action-btn" icon="form" @click="edit(action.record)"></a-button>
            </a-tooltip>
          </template>
        </table-list>
      </a-col>
    </a-row>
    <a-modal
      width="650px"
      title="编辑消费规则"
      v-model="status"
      @ok="submitOk"
      :maskClosable="false"
      :destroyOnClose="true"
      okText="提交"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-form-item v-bind="formItemLayout" label="卡名称" >
          <a-input
            disabled
            placeholder="请输入卡名称"
            v-decorator="[
              'cardName',
              { initialValue: appForm.cardName}
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="联机日消费限额" >
          <a-input-number
            :min="1"
            :max="999999999"
            placeholder="请输入联机日消费限额"
            v-decorator="[
              'dailyMaxConsumeAmount',
              { initialValue: appForm.dailyMaxConsumeAmount, rules: [ { required: true, message: '请输入联机日消费限额' } ]}
            ]"
          />
          *不计设备，每个用户所有消费单日限额

        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="脱机日消费限额" required>
          <a-input-number
            :min="1"
            :max="999999999"
            placeholder="请输入脱机日消费限额"
            v-decorator="[
              'offlineConsumeAmount',
              { initialValue: appForm.offlineConsumeAmount, rules: [ { required: true, message: '请输入脱机日消费限额' } ]}
            ]"
          />
          *单台设备，每个用户所有消费单日限额
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="单次消费限额" >
          <a-input-number
            :min="1"
            :max="999999999"
            placeholder="请输入单次消费限额"
            v-decorator="[
              'singleConsume',
              { initialValue: appForm.singleConsume, rules: [ { required: true, message: '请输入单次消费限额' } ]}
            ]"
          />
          *联机或脱机，单次消费限额
        </a-form-item>
        <!-- <a-form-item label="优惠类型" v-bind="formItemLayout">
          <a-radio-group
            @change="change"
            v-decorator="[
              'handleStatus',
              {
                initialValue: appForm.handleStatus,
                rules: [{ required: true, message: '请选择优惠类型' }]
              }
            ]"
          >
            <a-radio value="0">无优惠</a-radio>
            <a-radio value="1">折扣</a-radio>
            <a-radio value="2">减免</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="折扣比例" >
          <a-input
            placeholder="请输入折扣比例"
            v-decorator="[
              'detailAddress',
              { initialValue: appForm.detailAddress, rules: [ { required: false, message: '请输入折扣比例' } ]}
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="减免金额" >
          <a-input
            placeholder="请输入减免金额"
            v-decorator="[
              'detailAddress',
              { initialValue: appForm.detailAddress, rules: [ { required: false, message: '请输入减免金额' } ]}
            ]"
          />
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import { Switch } from 'ant-design-vue'
const ruleColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '卡类型',
    dataIndex: 'cardName',
    width: '20%'
  },
  // {
  //   title: '优惠类型',
  //   dataIndex: 'type',
  //   width: '10%'
  // },
  {
    title: '联机日消费限额',
    dataIndex: 'dailyMaxConsumeAmount',
    width: '20%'
  },
  {
    title: '脱机日消费限额',
    dataIndex: 'offlineConsumeAmount',
    width: '20%'
  },
  {
    title: '单次消费限额',
    dataIndex: 'singleConsume',
    width: '15%'
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ConsumeRule',
  components: {
    ASwitch: Switch,
    TableList
  },
  data() {
    return {
      ruleColumns,
      ruleList: [],
      confirmLoading: false,
      status: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      appForm: {

      },
      defaultChecked: false
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getConsumeRule', 'changeRule', 'getRuleStatus', 'updateRule', 'getLineStatus']),
    async showList() {
      const res = await this.getConsumeRule()
      this.ruleList = res.data
      const status = await this.getLineStatus()
      console.log(status)
      if (status.data) {
        this.defaultChecked = status.data.offLine === 2
      }
    },
    async onChange(check) {
      this.defaultChecked = check
      await this.getLineStatus({ offLine: check ? 2 : 1 })
      this.$message.success('操作成功')
    },
    edit(record) {
      this.status = true
      this.appForm = record
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateRule({
            ...this.appForm,
            ...values
          }).then(res => {
            this.confirmLoading = false
            this.status = false
            this.$message.success('操作成功')
            this.$tools.goNext(() => {
              this.showList()
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
.cunsume-rule {
  padding: 30px;
}
.ant-input-number{
  width: 45%;
}
</style>
