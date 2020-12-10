<template>
  <div class="area-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item label="器材名称：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'name',
              {
                initialValue: appForm.name,
                rules: [{ required: true, message: '请填写器材' }]
              }
            ]"
            placeholder="请填写器材"
          />
        </a-form-item>
        <a-form-item label="器材型号：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'type',
              {
                initialValue: appForm.type,
                rules: [{ required: true, message: '请填写器材型号' }]
              }
            ]"
            placeholder="请填写器材型号"
          />
        </a-form-item>
        <a-form-item label="器材数量：" v-bind="formItemLayout">
          <a-input-number
            style="width: 100%"
            :min="1"
            placeholder="（请填写阿拉伯数字）"
            v-decorator="[
              'amount',
              { initialValue: appForm.amount, rules: [ { required: true, message: '请输入器材数量' } ]}
            ]"
          />
        </a-form-item>
        <a-form-item label="计量单位：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'unit',
              {
                initialValue: appForm.unit,
                rules: [{ required: true, message: '请填写计量单位' }]
              }
            ]"
            placeholder="（如：个，件，把）"
          />
        </a-form-item>
        <a-form-item label="器材现状" v-bind="formItemLayout">
          <a-select
            v-decorator="[
              'state',
              { initialValue: appForm.state,
                rules: [{ required: true, message: '请选择器材现状' }] },
            ]"
            placeholder="请选择器材现状">
            <a-select-option value="1">全新</a-select-option>
            <a-select-option value="2">完好</a-select-option>
            <a-select-option value="3">已损坏</a-select-option>
            <a-select-option value="4">已报废</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="存放位置：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'address',
              {
                initialValue: appForm.address,
                rules: [{ required: true, message: '请填写存放位置' }]
              }
            ]"
            placeholder="请输入存放位置"
          />
        </a-form-item>
        <a-form-item label="备注：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'remark', { initialValue: appForm.remark }
            ]"
            placeholder="（填写不超过30字备注）"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center'}">
          <a-button @click="cancel">取消</a-button>
          <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddEquip',
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      appForm: {},
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this._rescueEquipDetail()
    }
  },
  methods: {
    ...mapActions('home', ['addRescueEquip', 'rescueEquipDetail', 'updateRescueEquip']),
    // 疏散路线详情
    async _rescueEquipDetail() {
      const res = await this.rescueEquipDetail(this.detailId)
      this.appForm = res.data
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          values.schoolCode = this.userInfo.schoolCode
          this.isLoad = true
          if (!this.detailId) {
            this.addRescueEquip(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            values.id = this.detailId
            this.updateRescueEquip(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.area-add {
  padding: 20px;
  .content {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
}
</style>
