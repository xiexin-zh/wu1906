<template>
  <div class="area-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item label="标题名称：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'name',
              {
                initialValue: appForm.name,
                rules: [{ required: true, message: '请填写标题' }]
              }
            ]"
            placeholder="请填写标题"
          />
        </a-form-item>
        <a-form-item label="路线图上传：" v-bind="formItemLayout" required>
          <a-upload
            name="fileList"
            :file-list="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
          >
            <a-button>
              <a-icon type="upload" /> 上传图片
            </a-button>
          </a-upload>
          <img v-if="photourl" class="img" :src="photourl" alt="">
          <div class="u-type-error">
            备注：支持图片格式jpg、png
          </div>
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
  name: 'AddRoute',
  data() {
    return {
      fileList: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      appForm: {},
      detailId: '',
      photourl: '',
      uploadTag: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this._routeImgDetail()
    }
  },
  methods: {
    ...mapActions('home', ['addRouteImg', 'routeImgDetail', 'updateRouteImg']),
    // 疏散路线详情
    async _routeImgDetail() {
      const res = await this.routeImgDetail(this.detailId)
      this.appForm = res.data
      this.photourl = res.data.photoUrl
      this.fileList = [{
        name: res.data.photoUrl,
        uid: res.data.photoUrl
      }]
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 图片上传
    beforeUpload(file) {
      console.log('file', file)
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImg) {
        this.$message.error('请上传jpg、png格式的图片')
        return false
      }
      const fileType = file.name.split('.')[1]
      this.$tools.ossUpload(this.userInfo.schoolCode, file, fileType, res => {
        if (!res) {
          return
        }
        if (res.code === 200) {
          this.photourl = res.data.url
          this.fileList = [file]
        } else {
          this.$message.error(res.data)
        }
      })
      return false
    },
    // 图片删除
    handleRemove(file) {
      this.photourl = ''
      this.fileList = []
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (!this.photourl) {
            this.$message.warning('请选择路线图上传')
            return false
          }
          values.schoolCode = this.userInfo.schoolCode
          values.photourl = this.photourl
          this.isLoad = true
          if (!this.detailId) {
            this.addRouteImg(values)
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
            this.updateRouteImg(values)
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
.img {
  width: 120px;
  height: 120px;
}
</style>
