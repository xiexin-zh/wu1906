<template>
  <a-modal
    width="600px"
    title="导入"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-upload-dragger
      name="file"
      :file-list="fileList"
      :multiple="true"
      accept=".xlsx,.xls"
      :beforeUpload="beforeUpload"
    >
      <u-space direction="vertical" :vSize="10">
        <img class="upload-icon" :src="uploadImg" alt="">
        <span class="ant-upload-text"> 点击或将文件拖拽到这里上传 </span>
        <span class="ant-upload-hint"> 支持扩展名：.xlsx，.xls </span>
      </u-space>
    </a-upload-dragger>
  </a-modal>
</template>

<script>
import uploadImg from '../assets/img/upload.png'
export default {
  name: 'BatchImport',
  components: {},
  props: {
    // 打开弹窗
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      uploadImg,
      confirmLoading: false,
      actionUrl: '/protal_v3_11102/canpointDormManage/batchImport',
      fileList: []
    }
  },
  async mounted() {},
  methods: {
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    submitOk() {
      if (this.fileList.length === 0) {
        this.$message.warning(`请选择文件`)
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.fileList)
    }
  }
}
</script>

<style lang="less" scoped>
.upload-icon{
  width: 60px;
  height: 60px;
}
</style>
