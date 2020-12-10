<template>
  <div class="page-layout notice-add">
    <a-row type="flex" align="middle">
      <a-col span="3" class="u-tx-r u-mar-r"><span class="tip">*</span>公告标题:</a-col>
      <a-col span="18">
        <a-input style="width: 80%" v-model="appForm.title" placeholder="请输入公告标题" />
      </a-col>
    </a-row>
    <a-row class="u-mar-t30" style="height: 400px">
      <a-col span="3" class="u-tx-r u-mar-r"><span class="tip">*</span>公告内容:</a-col>
      <a-col span="18">
        <quill-editor
          style="height: 380px; width: 80%"
          v-model="appForm.content"
          ref="myQuillEditor"
          :options="quillOption"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
      </a-col>
    </a-row>
    <a-row class="u-mar-t40">
      <a-col span="3" class="u-tx-r u-mar-r">是否弹出:</a-col>
      <a-col span="18">
        <a-switch v-model="appForm.popFalg" />
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" class="u-mar-t40">
      <a-col span="3" class="u-tx-r u-mar-r"></a-col>
      <a-col span="18">
        <a-button type="primary" @click="publish">发布</a-button>
        <a-button class="u-mar-l40" @click="quit">取消</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from './quill-config'
export default {
  name: 'AddNotice',
  components: { quillEditor },
  data() {
    return {
      quillOption: quillConfig,
      appForm: {
        title: '',
        content: '',
        popFalg: false
      }
    }
  },
  created() {
    const { detail } = this.$route.query
    if (detail.noticeCode) {
      this.isEdit = true
      this.noticeCode = detail.noticeCode
      this.appForm = {
        title: detail.title,
        content: detail.content,
        popFalg: parseInt(detail.popFalg) === 1 ? true : false
      }
      this.actionFun = 'updateNotice'
    } else {
      this.isEdit = false
      this.actionFun = 'addNotice'
    }
  },
  computed: {
    ...mapState('home', ['loginType', 'schoolCode'])
  },
  methods: {
    ...mapActions('home', ['addNotice', 'updateNotice']),
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    /**
     * @description 新增或修改公告
     */
    async publish() {
      if (!this.appForm.title) {
        this.$message.warning('请输入公告标题')
        return
      }
      if (!this.appForm.content) {
        this.$message.warning('请输入公告内容')
        return
      }
      try {
        if (this.isEdit) {
          this.appForm.noticeCode = this.noticeCode
        }
        this.appForm.popFalg = this.appForm.popFalg ? 1 : 0
        await this[this.actionFun]({
          ...this.appForm,
          publisherCode: this.loginType.userCode,
          publisherEduName: this.loginType.schoolName,
          publisherEduCode: this.schoolCode,
          publisherName: this.loginType.userName,
          remark: ''
        })
        this.$message.success('发布成功')
        this.$tools.goNext(() => {
          this.quit()
        })
      } catch (err) {}
    },
    quit() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.notice-add {
  padding: 40px;
  .tip {
    color: red;
    padding-right: 5px;
  }
}
</style>
