<template>
  <div class="add-find page-layout bg-fff qui-fx-ver">
    <a-form :form="form">
      <a-form-item v-bind="formItemLayout" label="负责人" required>
        <a-select
          v-decorator="[
            'leaderName',
            { initialValue: appForm.leaderName, rules: [{ required: true, message: '请选择负责人' }] },
          ]"
          placeholder="请选择负责人"
        >
          <a-select-option v-for="list in userList" :key="`${list.name}+${list.code}`">
            {{ list.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="隐患位置：" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'address',
            {
              initialValue: appForm.address,
              rules: [{ required: true, message: '请填写隐患位置' }]
            }
          ]"
          placeholder="请填写隐患位置"
        />
      </a-form-item>
      <a-form-item label="隐患描述：" v-bind="formItemLayout">
        <a-textarea
          v-decorator="[
            'description',
            {
              initialValue: appForm.description,
              rules: [{ required: true, message: '请填写隐患描述' }]
            }
          ]"
          placeholder="请填写隐患描述"
        />
      </a-form-item>
      <a-form-item label="隐患图片上传：" v-bind="formItemLayout" required>
        <upload-multi :length="9" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
        备注：限上传9张照片
      </a-form-item>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UploadMulti from '@c/UploadMulti'
export default {
  name: 'AddFind',
  components: {
    UploadMulti
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      isLoad: false,
      appForm: {},
      userList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    ...mapActions('home', ['getGroupDetail', 'reportDanger']),
    async getUserList() {
      const res = await this.getGroupDetail({ schoolCode: this.userInfo.schoolCode })
      this.userList = res.data.leaders
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.fileList.length === 0) {
            this.$message.warning('请上传图片')
            return
          }
          values.leaderCode = values.leaderName.split('+')[1]
          values.leaderName = values.leaderName.split('+')[0]
          values.reporterCode = this.userInfo.userCode
          values.reporterName = this.userInfo.userName
          values.reporterPhotoUrl = this.userInfo.photoUrl
          values.schoolCode = this.userInfo.schoolCode
          values.schoolName = this.userInfo.schoolName
          values.photoUrl = this.fileList.map(el => el.url)
          this.isLoad = true
          this.reportDanger(values)
            .then(res => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$router.go(-1)
              })
            })
            .catch(res => {
              this.isLoad = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.add-find {
  padding: 20px;
}
</style>
