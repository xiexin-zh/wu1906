<template>
  <div class="set-group page-layout qui-fx-ver">
    <a-form :form="form" :style="{ maxHeight: maxHeight, overflow: 'auto' }">
      <a-form-item label="新闻标题：" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-model="orders"
          maxlength="30"
          v-decorator="[
            'title',
            { initialValue: appForm.title, rules: [{ required: true, message: '请填写新闻标题', whitespace: true }] }
          ]"
          placeholder="最多不超过30字"
        />
      </a-form-item>
      <a-form-item label="摘要" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-textarea
          placeholder="请输入摘要"
          v-decorator="[
            'remark',
            { initialValue: appForm.remark, rules: [{ required: true, message: '请输入摘要', whitespace: true }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="新闻内容：" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :required="true">
        <quill-editor
          style="height: 450px; width: 80%"
          v-model="appForm.content"
          ref="myQuillEditor"
          :options="quillOption"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
      </a-form-item>
      <div style="margin-top: 70px;">
        <a-form-item label="新闻封面：" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :required="true">
          <div class="qui-fx-ac">
            <upload-multi :length="1" v-model="appForm.fileList" :fileInfo="fileInfo"></upload-multi>
            <span style="font-size:12px;margin-left:10px;">大小20到100kB，像素400x400到800x800</span>
          </div>
        </a-form-item>
      </div>
      <a-form-item>
        <div :style="{ textAlign: 'center', marginTop: '-5px' }">
          <a-button style="margin-right:10px; background-color: #ccc; color:#fff" @click="cancle">取消</a-button>
          <a-button class="edit-action-btn" style="margin-right:10px" @click="previewClick">预览</a-button>
          <a-button class="add-btn" @click="handleSubmit" :loading="state.loginBtn" :disabled="state.loginBtn"
            >发布新闻</a-button
          >
        </div>
      </a-form-item>
    </a-form>
    <a-modal v-model="previewVisible" :destroyOnClose="true" width="900px" :footer="null">
      <div style="text-align: center;">
        <h2>{{ appForm.title }}</h2>
        <p>发布时间：{{ this.getDateTime(new Date(), 1) }}</p>
        <div style="background-color: #ebeef5; height: 1px; border: none;"></div>
        <div style="min-height: 300px;">
          <p class="ql-editor img_" v-html="appForm.content">
            {{ appForm.content }}
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from './quill-config'
import UploadMulti from '@c/UploadMulti'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Addnews',
  components: {
    quillEditor,
    UploadMulti
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      maxHeight: 0,
      moment,
      userTag: false,
      form: this.$form.createForm(this),
      groupList: [],
      appForm: {
        schoolCode: '',
        title: '',
        content: '',
        createBy: '',
        imgUrl: '',
        fileList: []
      },
      upload: '',
      previewVisible: false,
      quillOption: quillConfig,
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      },
      loading: false,
      placeholder: '请选择班级',
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      uploadFile: [],
      detailInfo: {},
      orders: ''
    }
  },
  props: {
    refBuildList: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getDetail()
  },
  watch: {
    orders(val) {
      if (val.length >= 30) {
        this.$message.warning('标题字数不能超过30')
      }
    }
  },
  mounted() {
    this.maxHeight = window.screen.height - 280 + 'px'
  },
  methods: {
    ...mapActions('home', ['addNews', 'updateNews', 'getNewsDetail']),
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.appForm.fileList.length === 0) {
            this.$message.warning('请上传封面照片')
            return
          }
          if (Number(this.$route.query.type) === 1) {
            const req = {
              schoolCode: this.userInfo.schoolCode,
              createBy: this.userInfo.userName,
              content: this.content,
              title: values.title,
              remark: values.remark,
              imgUrl: this.appForm.fileList[0].url,
              id: this.detailInfo.id,
              creatorCode: this.userInfo.userCode
            }
            this.updateNews(req).then(res => {
              this.$message.success('修改成功')
              this.$tools.goNext(() => {
                this.$router.push({
                  path: '/schoolNews'
                })
              })
            })
          } else {
            const req = {
              schoolCode: this.userInfo.schoolCode,
              createBy: this.userInfo.userName,
              content: this.content,
              title: values.title,
              remark: values.remark,
              imgUrl: this.appForm.fileList[0].url,
              creatorCode: this.userInfo.userCode
            }
            this.addNews(req).then(res => {
              this.$message.success('添加成功')
              this.$tools.goNext(() => {
                this.$router.push({
                  path: '/schoolNews'
                })
              })
            })
          }
        }
      })
    },
    async getDetail() {
      const id = this.$route.query.id
      if (Number(this.$route.query.type) === 1) {
        const res = await this.getNewsDetail(id)
        this.detailInfo = res.data
        this.appForm.title = this.detailInfo.title
        this.appForm.content = this.detailInfo.content
        this.appForm.remark = this.detailInfo.remark
        this.appForm.fileList = [{ url: this.detailInfo.imgUrl }]
      }
    },
    cancle() {
      this.$router.push({
        path: '/schoolNews'
      })
    },
    // 点击预览
    previewClick() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.appForm.title = values.title
          this.previewVisible = true
        }
      })
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
      )
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  padding-top: 20px;
  .table {
    max-height: 380px;
    overflow: auto;
  }
  .action {
    margin: 5px 0;
    span {
      margin: 0 5px;
    }
    .right {
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  .control-list {
    display: inline-block;
    margin: 0 10px 10px 0;
    line-height: 25px;
  }
}
.img_ /deep/ img {
  width: 600px;
  margin: 10px 0;
}
</style>
