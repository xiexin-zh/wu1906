<template>
  <div class="upload-file qui-fx">
    <a-upload
      :multiple="true"
      :name="fileName"
      listType="picture-card"
      class="avatar-uploader mar-t10"
      :showUploadList="false"
      :action="reqUrl"
      :accept="type === 'image' ? 'image/*' : type === 'video' ? 'video/mp4' : ''"
      :beforeUpload="beforeUpload"
      @change="uploadPic"
    >
      <div v-if="fileList.length < length" :style="{height: fileInfo.h + 'px', width: fileInfo.w + 'px'}" class="qui-fx-ac-jc">
        <div><a-icon style="font-size: 20px" :type="uploadTag ? 'loading' : 'plus'" /></div>
        <div class="ant-upload-text">{{ fileInfo.tip }}</div>
      </div>
    </a-upload>
    <div
      @mouseover="showTip(index)"
      v-for="(pic, index) in fileList"
      :key="pic.id"
      class="qui-fx qui-fx-ac-jc mar-t10"
      :style="{position: 'relative', marginRight: '10px', backgroundColor: '#fff', padding: '18px', border: '1px dashed #ccc', height: fileInfo.h + 'px', width: fileInfo.w + 'px'}">
      <div @mouseleave="showTip()" class="showTip qui-fx-ac-jc" v-if="currentIndex === index">
        <div class="create-time" v-if="showTimeTag">{{ pic.createTime | gmtToDate() }}</div>
        <div>
          <a-icon type="eye" @click="show(pic)"></a-icon>
          <a-icon type="delete" @click="del(pic)"></a-icon>
        </div>
      </div>
      <video v-if="type === 'video'" :src="pic.url" :style="{height: (fileInfo.h - 40) + 'px', width: (fileInfo.w - 40) + 'px'}" />
      <img v-else :style="{height: (fileInfo.h - 40)+ 'px', width: (fileInfo.w - 40) + 'px'}" :src="pic.url" alt=""/>
    </div>
    <a-modal destroyOnClose :visible="previewVisible" :footer="null" @cancel="previewVisible = false" width="800px">
      <div class="qui-fx-ac-jc">
        <video v-if="type === 'video'" :src="previewImage" controls object-fit="contain" :style="{maxHeight: videoHeight + 'px', maxWidth: '100%'}"></video>
        <img v-else :style="{maxHeight: videoHeight + 'px', maxWidth: '100%'}" :src="previewImage" />
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'UploadVideo',
  props: {
    type: {
      type: String,
      default: 'video'
    },
    length: {
      type: Number,
      default: 1
    },
    maxSize: {
      type: Number,
      default: 100
    },
    showTimeTag: {
      type: Boolean,
      default: false
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
    fileInfo: {
      type: Object,
      default: () => {
        return {
          url: '',
          h: 120,
          w: 120,
          tip: '上传视频'
        }
      }
    }
  },
  data () {
    return {
      reqUrl: '',
      previewVisible: false,
      uploadTag: false,
      previewImage: '',
      currentIndex: -1,
      videoHeight: 0
    }
  },
  mounted () {
    this.reqUrl = this.fileInfo.url
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
    showTip (index = -1) {
      this.currentIndex = index
    },
    show (file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
    del (file) {
      this.$tools.delTip('确定删除吗?', () => {
        const index = this.fileList.findIndex(item => {
          return item.id === file.id
        })
        this.$emit('delUpload', this.fileList[index])
        this.fileList.splice(index, 1)
      })
    },
    beforeUpload (file) {
      const isLt100M = file.size / 1024 / 1024 < this.maxSize
      if (!isLt100M) {
        this.$message.error(`大小必须小于${this.maxSize}M`)
      }
      if (this.type === 'video') {
        const isMp4 = file.type === 'video/mp4'
        if (!isMp4) {
          this.$message.error('请上传mp4格式的视频文件')
        }
        this.$emit('beforeUpload')
        return isMp4 && isLt100M
      } else {
        this.$emit('beforeUpload')
        return isLt100M
      }
    },
    uploadPic (info) {
      if (info.file.status === 'uploading') {
        this.uploadTag = true
        return
      }
      if (info.file.status === 'error') {
        this.uploadTag = false
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 400) {
          this.$message.warning(info.file.response.message)
          this.uploadTag = false
          return
        }
        if (this.fileList.length >= this.length) {
          this.type === 'video' ? this.$message.error(`视频数量不能超过${this.length}个`) : this.$message.error(`图片数量不能超过${this.length}张`)
          return
        }
        this.fileList.unshift({
          uid: info.file.uid,
          uname: info.file.name,
          createTime: Array.isArray(info.file.response.data) ? info.file.response.data[0].createTime : info.file.response.data.createTime,
          id: Array.isArray(info.file.response.data) ? info.file.response.data[0].id : info.file.response.data.id,
          url: Array.isArray(info.file.response.data) ? info.file.response.data[0].url || info.file.response.data[0] : info.file.response.data.url
        })
        this.$emit('success', info.file.response.data)
        this.uploadTag = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0px !important;
  }
  /deep/ .ant-upload-picture-card-wrapper{
    width: auto;
  }
  .showTip {
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    .create-time{
      position: absolute;
      top: 10px;
      color: #fff;
    }
    i {
      cursor: pointer;
      color:#fff;
      padding: 0 8px;
      font-size: 18px;
    }
  }
  .upload-file{
    flex-wrap: wrap;
  }
</style>
