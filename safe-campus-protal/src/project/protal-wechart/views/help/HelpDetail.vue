<template>
  <div class="help-detail page-layout bg-fff">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
      <a-form-item label="标题">
        <a-input
          v-decorator="['title', { initialValue: title, rules: [{ required: true, message: '请输入标题' }] }]"
          placeholder="请输入标题"
        />
      </a-form-item>
      <a-form-item label="模块名称" v-if="funType == 1">
        <a-select
          :disabled="Boolean(detail)"
          v-decorator="[
            'moduleType',
            { initialValue: moduleType, rules: [{ required: true, message: '请选择模块名称' }] }
          ]"
          placeholder="请选择模块名称"
        >
          <a-select-option :value="0">通知公告</a-select-option>
          <a-select-option :value="1">作业</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="内容">
        <div style="height: 580px;" class="u-of">
          <quill-editor
            style="width: 100%; height: 520px"
            v-model="content"
            ref="myQuillEditor"
            :options="quillOption"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button @click="quit" type="default" class="u-mar-r">取消</a-button>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillOption from '../../quill-config'
export default {
  name: 'Help',
  components: { quillEditor },
  data() {
    return {
      moduleList: ['通知公告', '作业'],
      title: '',
      moduleType: 0,
      funType: '',
      content: '',
      quillOption,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      detail: ''
    }
  },
  mounted() {
    const detail = window.sessionStorage.getItem('helpInfo')
    if (detail) {
      this.detail = JSON.parse(detail)
      this.title = this.detail.title
      this.content = this.detail.content
      this.moduleType = this.detail.moduleType
    }
    this.funType = this.$route.query.funType
    if (this.funType == 0) {
      this.moduleType = 0
    }
  },
  methods: {
    ...mapActions('home', ['addHelp', 'updateHelp']),
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.content === '') {
            this.$message.warning('请输入内容')
            return
          }
          this.values = values
          this._addHelp()
        }
      })
    },
    async _addHelp() {
      const params = {
        ...this.values,
        moduleName: this.funType == 0 ? '公共' : this.moduleList[this.values.moduleType],
        content: this.content,
        funType: this.funType,
        createTime: new Date().getTime()
      }
      if (this.detail) {
        params._id = this.detail._id
        await this.updateHelp(params)
      } else {
        await this.addHelp(params)
      }
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.$router.back()
      })
    },
    quit() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.help-detail {
  padding: 30px;
  overflow-y: scroll;
}
</style>
