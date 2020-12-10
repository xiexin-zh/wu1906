<template>
  <div class="upload-file qui-fx">
    <div
      @mouseover="showTip(index)"
      v-for="(pic, index) in fileList"
      :key="pic.id"
      class="qui-fx qui-fx-ac-jc mar-t10"
      :style="{
        position: 'relative',
        marginRight: '10px',
        backgroundColor: '#fff',
        padding: '18px',
        border: '1px dashed #ccc',
        height: fileInfo.h || 120 + 'px',
        width: fileInfo.w || 120 + 'px'
      }"
    >
      <div @mouseleave="showTip()" class="showTip qui-fx-ac-jc" v-if="currentIndex === index">
        <div>
          <a-icon type="eye" @click="show(pic)"></a-icon>
          <a-icon type="delete" @click="del(pic)"></a-icon>
        </div>
      </div>
      <video v-if="type === 'video'" :src="pic.url" controls object-fit="contain" style="width: 80px; height: 80px"></video>
      <img v-else :src="pic.url" style="width: 80px; height: 80px" alt="" />
    </div>
    <a-upload
      :multiple="true"
      :showUploadList="false"
      listType="picture-card"
      class="avatar-uploader mar-t10"
      :accept="type === 'image' ? '.jpg, .jpeg, .png' : type === 'video' ? 'video/mp4' : ''"
      :remove="del"
      @preview="show"
      :beforeUpload="beforeUpload"
    >
      <div v-if="fileList.length < length">
        <div><a-icon style="font-size: 20px" :type="uploadTag ? 'loading' : 'plus'" /></div>
        <div class="ant-upload-text">{{ tip }}</div>
      </div>
    </a-upload>
    <a-progress v-if="total > 0 && showProgressTag" :percent="percent" :format="percent => `${per} / ${total}`" />
    <a-modal destroyOnClose :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <div class="qui-fx-ac-jc">
        <video v-if="type === 'video'" :src="previewImage" controls object-fit="contain" :style="{maxHeight: videoHeight + 'px', maxWidth: '100%'}"></video>
        <img v-else :src="previewImage" :style="{maxHeight: videoHeight + 'px', maxWidth: '100%'}" />
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'UploadWeb',
  props: {
    showProgressTag: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'image'
    },
    length: {
      type: Number,
      default: 1
    },
    maxSize: {
      type: Number,
      default: 10
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    schoolCode: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: '上传图片'
    },
    fileInfo: {
      type: Object,
      default: () => {
        return {
          url: '',
          height: 120,
          width: 120
        }
      }
    }
  },
  data () {
    return {
      previewVisible: false,
      uploadTag: false,
      previewImage: '',
      videoHeight: 0,
      currentIndex: -1,
      per: 0,
      percent: 0,
      total: 0
    }
  },
  mounted () {
    this.videoHeight = (document.body.clientHeight) * 0.8
  },
  computed: {
    fileList: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    showTip(index = -1) {
      this.currentIndex = index
    },
    show (file) {
      console.log(file)
      this.previewVisible = true
      this.previewImage = file.url
    },
    del (file) {
      console.log(file)
      const index = this.fileList.findIndex(item => {
        return item.id === file.id
      })
      if (index !== -1) {
        this.fileList.splice(index, 1)
        this.per--
        this.total--
        this.percent = (this.per / this.total) * 100
      }
      console.log(this.fileList)
    },
    beforeUpload(file) {
      console.log(file)
      const isLt100M = file.size / 1024 / 1024 < this.maxSize
      if (!isLt100M) {
        this.$message.error(`大小必须小于${this.maxSize}M`)
        return false
      }
      if (this.type === 'video') {
        const isMp4 = file.type === 'video/mp4'
        if (!isMp4) {
          this.$message.error('请上传mp4格式的视频文件')
          return false
        }
      } else if (this.type === 'image') {
        const isJpg = file.type === ('image/jpeg' || 'image/jpg')
        const isPng = file.type === 'image/png'
        if (!isJpg && !isPng) {
          this.$message.error('请上传图片格式的文件(jpg/jpeg/png)')
          return false
        }
      }
      this.uploadTag = true
      console.log(this.schoolCode)
      const fileType = file.name.split('.')[1]
      this.total++
      this.percent = (this.per / this.total) * 100
      this.$tools.ossUpload(this.schoolCode, file, fileType, res => {
        if (!res) {
          return
        }
        this.uploadTag = false
        console.log(res)
        this.per++
        this.percent = (this.per / this.total) * 100
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
/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
  padding: 0px !important;
}
/deep/ .ant-upload-picture-card-wrapper {
  width: auto;
}
.showTip {
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  i {
    cursor: pointer;
    color: #fff;
    padding: 0 8px;
    font-size: 18px;
  }
}
.upload-file {
  flex-wrap: wrap;
}
</style>
