<template>
  <div class="upload-file">
    <a-upload
      :multiple="true"
      :name="fileName"
      accept="video/mp4"
      :remove="handleRemove"
      :beforeUpload="beforeUpload"
    >
      <div v-if="fileList.length < length && !uploadTag" class="qui-fx-ac-jc">
        <a-button type="primary">
          <a-icon type="upload" />上传视频
        </a-button>
      </div>
    </a-upload>
    <a-progress
      style="width: 300px"
      :strokeColor="{
        '0%': '#2979ff',
        '100%': '#19be6b',
      }"
      v-if="percent > 0 && percent < 100"
      :percent="percent"
      status="active"
    />
  </div>
</template>
<script>
export default {
  name: 'UploadVideo',
  props: {
    length: {
      type: Number,
      default: 1
    },
    maxSize: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileName: {
      type: String,
      default: 'fileList'
    },
    schoolCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadTag: false
    }
  },
  mounted() {},
  computed: {
    fileList: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleRemove(file) {
      if (this.uploadTag) {
        this.$tools.closeUpload()
        this.$emit('onUploadProgress', 0)
        return
      }
      const index = this.fileList.findIndex(list => list.file.uid === file.uid)
      console.log(index)
      this.fileList.splice(index, 1)
    },
    beforeUpload(file) {
      const isLt100M = file.size / 1024 / 1024 < this.maxSize
      if (!isLt100M) {
        this.$message.error(`大小必须小于${this.maxSize}M`)
        return false
      }
      const isMp4 = file.type === 'video/mp4'
      if (!isMp4) {
        this.$message.error('请上传mp4格式的视频文件')
        return false
      }
      console.log(this.schoolCode)
      const fileType = file.name.split('.')[1]
      this.uploadTag = true
      this.$tools.ossUpload(this.schoolCode, file, fileType, res => {
        if (!res) {
          return
        }
        console.log(res)
        this.uploadTag = false
        if (res.code === 200) {
          this.$emit('onUploadProgress', 100)
          this.fileList = [...this.fileList, {
            file,
            ...res.data
          }]
        } else {
          this.$message.error(res.data)
        }
      }, uploadPercent => {
        this.uploadPercent = uploadPercent === 100 ? 99 : uploadPercent
        this.$emit('onUploadProgress', this.uploadPercent)
      })
      return false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-upload-list-item-card-actions {
  right: -10px;
}
</style>
