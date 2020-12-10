<template>
  <div>
    <a-modal
      title="编辑"
      :visible="addVisible"
      @cancel="addCancel"
      @ok="addHandleForm"
      :destroyOnClose="true"
      :maskClosable="false"
      :confirmLoading="isLoad"
      width="600px"
    >
      <a-form :form="addForm" >
        <a-form-item label="上课时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" >
          <a-time-picker v-decorator="['startTime',{initialValue: appForm.startTime,rules: [{ required: true, message: '请选择上课时间' }]}]" />
        </a-form-item>
        <a-form-item label="下课时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" >
          <a-time-picker v-decorator="['endTime',{initialValue: appForm.endTime,rules: [{ required: true, message: '请选择下课时间' }]}]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'EditHour',
  components: {
  },
  props: {
  },
  data () {
    return {
      addForm: this.$form.createForm(this),
      addVisible: false,
      isLoad: false, // 弹出框按钮是否可用
      buildName: '',
      selectTeacher: {},
      appForm: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', [
      'addBuild', 'getBuildList'
    ]),
    addCancel () {
      this.addVisible = false
    },
    addHandleForm () {
      const _this = this
      _this.addForm.validateFields((err, values) => {
        if (!err) {
          _this.isLoad = true
          const params = {
            name: values.buildName,
            schoolScheme: this.authWebUserInfo.exts.schoolScheme,
            schoolName: this.authWebUserInfo.exts.schoolName,
            id: ''
          }
          _this.addBuild(params).then(res => {
            _this.isLoad = false
            _this.$message.success('添加成功')
            _this.addForm.resetFields()
            _this.addVisible = false
            _this.$tools.goNext(() => {
              _this.$emit('updataList')
            })
          }).catch()
        } else {
          _this.isLoad = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .ant-time-picker{
  width:100%;
}
</style>
