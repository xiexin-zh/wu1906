<template>
  <div class="send-message page-layout u-type-white-bg u-fx-ver">
    <u-submit-page
      :labelCol="2"
      :wrapperCol="15"
      ref="form"
      @cancel="$router.back()"
      @submit="sumbit"
      is-button
      :form-data="messageSubmit"
    >
      <div slot="slotOne">
        <u-editor :height="480" v-model="content"></u-editor>
      </div>
    </u-submit-page>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import messageSubmit from '../../submit-columns/message'
export default {
  name: 'SendMessage',
  components: {},
  data() {
    return {
      messageSubmit,
      content: ''
    }
  },
  mounted() {
    this.isEdit = this.$route.query.type
    const detail = JSON.parse(window.sessionStorage.getItem('messageDetail'))
    if (parseInt(this.isEdit) === 1) {
      // 编辑消息
      this.id = detail.id
      detail.hasFrame = detail.hasFrame ? 1 : 0
      this.content = detail.content
      this.messageSubmit = this.$tools.fillForm(this.messageSubmit, detail)
    }
  },
  methods: {
    ...mapActions('home', ['loginInfo', 'addMessage', 'modifyMessage', 'delMessage']),
    // 提交或编辑公告
    async sumbit(values) {
      if (!this.content) {
        this.$message.warning('请输入公告内容')
        this.$refs.form.reset()
        return
      }
      const params = {
        publisherName: this.loginInfo.schoolName,
        publisherCode: '',
        content: this.content,
        title: values.title,
        hasFrame: !!values.hasFrame
      }
      try {
        if (parseInt(this.isEdit) === 0) {
          await this.addMessage(params)
        } else {
          params.id = this.id
          await this.modifyMessage(params)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$router.back()
        })
      } catch (err) {
        this.$refs.form.reset()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.send-message {
  padding: 50px 10px;
}
</style>
