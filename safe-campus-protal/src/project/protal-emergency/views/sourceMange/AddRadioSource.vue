<template>
  <div class="area-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item label="广播名称：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'name',
              {
                initialValue: appForm.name,
                rules: [{ required: true, message: '请填写广播名称' }]
              }
            ]"
            placeholder="请填写广播名称"
          />
        </a-form-item>
        <a-form-item label="资源分类" v-bind="formItemLayout">
          <a-select
            v-decorator="[
              'categoryCode',
              { initialValue: appForm.categoryCode, rules: [{ required: true, message: '请选择资源分类' }] },
            ]"
            placeholder="请选择资源分类"
          >
            <a-select-option v-for="item in classifyList" :key="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="广播类型" v-bind="formItemLayout">
          <a-radio-group
            v-decorator="[
              'type',
              {
                initialValue: appForm.type,
                rules: [{ required: true, message: '请选择广播类型' }]
              }
            ]"
          >
            <a-radio value="2">普通广播</a-radio>
            <a-radio value="1">应急广播</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="音频上传" v-bind="formItemLayout" required>
          <a-upload
            name="fileList"
            accept="audio/mp3"
            :beforeUpload="beforeUpload"
            :remove="handleRemove"
          >
            <a-button v-if="show"> <a-icon type="upload" /> 上传MP3文件 </a-button>
          </a-upload>
          <audio class="u-mar-t10" :src="url" v-if="detailId && url" controls></audio>
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
  name: 'AreaAdd',
  data() {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      appForm: {
        type: '1'
      },
      detailId: '',
      classifyList: [],
      show: true,
      url: '',
      fileType: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getClassifyByCode()
    this.detailId = this.$route.query.code
    if (this.detailId) {
      this._radioSourceDetail()
    }
  },
  methods: {
    ...mapActions('home', ['addRadioSource', 'radioSourceDetail', 'updateRadioSource', 'getClassifyByCode']),
    // 资源分类列表
    async _getClassifyByCode() {
      const res = await this.getClassifyByCode(this.userInfo.schoolCode)
      this.classifyList = res.data
    },
    // 广播资源详情
    async _radioSourceDetail() {
      const res = await this.radioSourceDetail(this.detailId)
      this.appForm = res.data
      this.url = res.data.url
      this.fileType = res.data.fileType
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 音频上传
    beforeUpload(file) {
      const isMp4 = file.type === 'audio/mp3' || file.type === 'audio/mpeg'
      if (!isMp4) {
        this.$message.error('请上传mp3格式的视频文件')
        return false
      }
      this.fileType = file.name.split('.')[1]
      this.$tools.ossUpload(this.userInfo.schoolCode, file, this.fileType, res => {
        if (!res) {
          return
        }
        if (res.code === 200) {
          this.show = false
          this.url = res.data.url
        } else {
          this.$message.error(res.data)
        }
      })
      return false
    },
    // 音频删除
    handleRemove(file) {
      this.show = true
      this.url = ''
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (!this.url) {
            this.$message.warning('请选择音频上传')
            return false
          }
          values.schoolCode = this.userInfo.schoolCode
          values.fileType = this.fileType
          values.url = this.url
          this.isLoad = true
          if (!this.detailId) {
            this.addRadioSource(values)
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
            values.code = this.detailId
            this.updateRadioSource(values)
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
