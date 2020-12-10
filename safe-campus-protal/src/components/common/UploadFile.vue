<template>
  <div class="upload-file">
    <a-upload
      name="fileList"
      listType="picture-card"
      class="avatar-uploader"
      :showUploadList="false"
      :action="fileInfo.url"
      :beforeUpload="beforeUpload"
      @change="uploadPic"
    >
      <img :style="{height: fileInfo.h + 'px', width: fileInfo.w + 'px'}" v-if="imageUrl !== ''" :src="imageUrl" alt="" />
      <div v-else :style="{height: fileInfo.h + 'px', width: fileInfo.w + 'px'}" class="qui-fx-ac-jc">
        <div><a-icon :type="uploadTag ? 'loading' : 'plus'" /></div>
        <div class="ant-upload-text">{{ fileInfo.tip }}</div>
      </div>
    </a-upload>
  </div>
</template>
<script>
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'UploadFile',
  props: {
    value: {
      type: String,
      default: ''
    },
    fileInfo: {
      type: Object,
      default: () => {
        return {
          height: 160,
          width: 160,
          tip: '上传图片'
        }
      }
    }
  },
  data () {
    return {
      imageUrl: this.value,
      uploadTag: false
    }
  },
  methods: {
    beforeUpload (file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error('请上传图片格式的文件(jpg/png)')
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('大小必须小于5M')
      }
      return (isJpg || isPng) && isLt5M
    },
    uploadPic (info) {
      if (info.file.status === 'uploading') {
        this.uploadTag = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 400) {
          this.$message.warning(info.file.response.message)
          return
        }
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          const url = info.file.response.data[0].url
          this.$emit('input', url)
          this.uploadTag = false
        })
      }
    }
  }
}
</script>
