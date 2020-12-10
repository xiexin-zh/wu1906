<template>
  <a-modal
    width="800px"
    title="变更状态"
    v-model="dialogTag"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="submitOk"
    okText="保存"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-form-item v-bind="formItemLayout" label="状态改为" required>
        <a-checkbox-group v-model="checkedList">
          <div class="qui-fx mar-b10">
            <div style="width:80px">
              <a-checkbox :value="onWork"> 上班 </a-checkbox>
            </div>
            <div style="width:300px">
              <a-select v-model="onState">
                <a-select-option v-for="item in stateType" :key="item.key">{{ item.value }}</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="qui-fx mar-b10">
            <div style="width:80px">
              <a-checkbox :value="onRest"> 下班 </a-checkbox>
            </div>
            <div style="width:300px">
              <a-select v-model="offState" >
                <a-select-option v-for="item in stateType" :key="item.key">{{ item.value }}</a-select-option>
              </a-select>
            </div>
          </div>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="备注" >
        <a-textarea
          placeholder="请输入备注"
          v-decorator="[
            'remark',
            { initialValue: appForm.remark, rules: [ { required: false, message: '请输入备注' } ]}
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
export default {
  name: 'RecordChange',
  components: {
    TableList
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      dialogTag: false,
      confirmLoading: false,
      recordId: '',
      checkedList: [],
      onState: '5',
      offState: '5',
      onWork: '1',
      onRest: '2',
      stateType: [{
        key: '5',
        value: '正常'
      }, {
        key: '4',
        value: '请假'
      }],
      appForm: {}
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('home', ['recordUpdate']),
    submitOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.checkedList.length === 0) {
            this.$message.warning('请选择更改项')
            return false
          }
          if (this.checkedList.indexOf('1') > -1) {
            values.onWork = true
            values.onState = this.onState
          } else {
            values.onState = ''
          }
          if (this.checkedList.indexOf('2') > -1) {
            values.onRest = true
            values.offState = this.offState
          } else {
            values.offState = ''
          }
          values.optName = this.userInfo.userName
          values.userType = '1'
          values.recordId = this.recordId
          this.dialogTag = false
          this.recordUpdate(values).then(res => {
            this.confirmLoading = false
            this.dialogTag = false
            this.checkedList = []
            this.$message.success('操作成功')
            this.$tools.goNext(() => {
              this.$emit('update')
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
</style>
