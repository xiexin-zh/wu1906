<template>
  <a-modal
    :title="title"
    :visible="addVisible"
    @cancel="editRoomCancel"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
    :footer="null"
  >
    <a-upload
      name="file"
      :multiple="true"
      :action="url"
      :data="params"
      :headers="headers"
      :withCredentials="true"
      :showUploadList="false"
      @change="handleChange">
      <a-button>
        <a-icon type="upload" /> 文件上传
      </a-button>
    </a-upload>
  </a-modal>
</template>
<script>
export default {
  data () {
    return {
      addVisible: false,
      confirmLoading: false,
      headers: {
        authorization: 'authorization-text'
      }
    }
  },
  props: {
    value: {// 弹层显隐
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '批量导入'
    },
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    visible (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.visible = val
    }
  },
  methods: {
    editRoomCancel () {
      this.addVisible = false
      this.visible = false
    },
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        if (info.file.response) {
          this.$message.error(info.file.response.message)
        }
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          this.$message.success(`${info.file.name} 上传成功`)
          this.logoUrl = info.file.name
          this.$tools.goNext(() => {
            this.$emit('upload-success')
          })
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
