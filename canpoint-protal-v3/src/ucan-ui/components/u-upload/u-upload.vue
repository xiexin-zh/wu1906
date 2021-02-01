<template>
  <div class="upload-file u-fx-ac">
    <div class="upload-file u-fx-ac" v-if="type !== 'file'">
      <div
        @mouseover="showTip(index)"
        v-for="(pic, index) in fileList"
        :key="pic.id"
        class="u-fx u-fx-ac-jc mar-t10"
        :style="{
          position: 'relative',
          marginRight: '10px',
          backgroundColor: '#fff',
          padding: '18px',
          border: '1px dashed #ccc',
          height: fileInfo.height + 'px',
          width: fileInfo.width + 'px'
        }"
      >
        <div @mouseleave="showTip()" class="showTip u-fx-ac-jc" v-if="currentIndex === index">
          <div>
            <a-icon type="eye" @click="show(pic)"></a-icon>
            <a-icon type="delete" @click="del(pic)"></a-icon>
          </div>
        </div>
        <video
          v-if="type === 'video'"
          :src="pic.url"
          controls
          object-fit="contain"
          :style="{
            height: fileInfo.height - 20 + 'px',
            width: fileInfo.width - 20 + 'px'
          }"
        ></video>
        <img
          v-else
          :src="pic.url"
          :style="{
            height: fileInfo.height - 20 + 'px',
            width: fileInfo.width - 20 + 'px'
          }"
          alt
        />
      </div>
    </div>
    <a-upload
      :multiple="type !== 'file'"
      :showUploadList="type === 'file'"
      :listType="type === 'file' ? 'text' : 'picture-card'"
      class="avatar-uploader mar-t10"
      :accept="type === 'image' ? '.jpg, .jpeg, .png' : type === 'video' ? 'video/mp4' : ''"
      :remove="del"
      @preview="show"
      :beforeUpload="beforeUpload"
      :customRequest="customRequest"
      :disabled="fileList.length >= length"
    >
      <div
        v-if="fileList.length < length && type !== 'file'"
        class="u-fx-ac-jc"
        :style="{
          height: fileInfo.height + 'px',
          width: fileInfo.width + 'px'
        }"
      >
        <div>
          <a-icon style="font-size: 20px" :type="uploadTag ? 'loading' : 'plus'" />
        </div>
        <div class="ant-upload-text">{{ type === 'image' ? '上传图片' : '上传视频' }}</div>
      </div>
      <div v-if="type === 'file'">
        <u-button :icon="hasIcon ? 'upload' : ''" :type="buttonType">{{ title }}</u-button>
        <span v-if="tips" @click.stop.prevent class="u-tips-color u-mar-10">{{ tips }}</span>
      </div>
    </a-upload>
    <div v-if="tips && type !== 'file'" @click.stop.prevent class="u-tips-color u-mar-10">{{ tips }}</div>
    <div class="progress">
      <a-progress
        class="bar"
        v-if="total > 0 && showProgressTag"
        :percent="percent"
        :format="percent => `${per} / ${total}`"
      />
    </div>
    <a-modal
      v-if="type !== 'file'"
      destroyOnClose
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <div class="u-fx-ac-jc">
        <video
          v-if="type === 'video'"
          :src="previewImage"
          controls
          object-fit="contain"
          :style="{ maxHeight: videoHeight + 'px', maxWidth: '100%' }"
        ></video>
        <img
          v-else
          :src="previewImage"
          :style="{ maxHeight: videoHeight + 'px', maxWidth: '100%' }"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'UploadFile',
  props: {
    showProgressTag: {
      // 是否展示上传进度条： 默认不展示
      type: Boolean,
      default: false
    },
    type: {
      // 附件类型： 图片：'image' 视频:'video' 文件: 'file',默认图片
      type: String,
      default: 'image'
    },
    isCheck: {
      // 是否开启人脸检测模式,默认关闭
      type: Boolean,
      default: false
    },
    length: {
      // 允许上传附件数量,默认5个
      type: Number,
      default: 5
    },
    maxSize: {
      // 允许上传附件大小,默认10M
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
      // 学校编码
      type: String,
      default: ''
    },
    fileInfo: {
      // 图片视频模式中，展示的图片大小
      type: Object,
      default: () => {
        return {
          height: 120,
          width: 120
        }
      }
    },
    tips: {
      // 说明文字
      type: String,
      default: ''
    },
    title: {
      // 按钮标题
      type: String,
      default: '上传附件'
    },
    hasIcon: {
      // 是否有图标
      type: Boolean,
      default: false
    },
    buttonType: {
      // 按钮类型
      type: String,
      default: 'light'
    }
  },
  data() {
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
  mounted() {
    this.videoHeight = document.body.clientHeight * 0.8
  },
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
    showTip(index = -1) {
      this.currentIndex = index
    },
    show(file) {
      this.previewVisible = true
      this.previewImage = file.url
    },
    del(file) {
      const index = this.fileList.findIndex(item => {
        return item.uid === file.uid
      })
      if (index !== -1) {
        this.fileList.splice(index, 1)
        this.per--
        this.total--
        this.percent = (this.per / this.total) * 100
      }
      this.$emit('delFile', file)
    },
    beforeUpload(file) {
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
      return true
    },
    customRequest(data) {
      // 上传提交
      if (this.type === 'image' && this.isCheck) {
        const reader = new FileReader()
        reader.readAsDataURL(data.file)
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]
          try {
            $ajax
              .postForm({
                url: `/face_upload/facePhoto`,
                params: {
                  userCode: Math.floor(Math.random() * 100000),
                  file: base64
                }
              })
              .then(res => {
                if (!res.data.result) {
                  this.$message.warning(res.message)
                  return
                }
                this.$message.success(`${data.file.name}上传成功`)
                if (this.fileList.length < this.length) {
                  this.fileList = [
                    ...this.fileList,
                    {
                      uid: data.file.uid,
                      id: Math.floor(Math.random() * 100000),
                      url: res.data.url
                    }
                  ]
                } else {
                  this.$message.warning(`超过上传数量限制,限制上传${this.length}个`)
                }
                this.uploadTag = false
              })
          } catch (err) {}
          const prom = new Promise((resolve, reject) => {})
          prom.abort = () => {}
          return prom
        }
      } else {
        this.uploadTag = true
        const fileType = data.file.name.split('.')[data.file.name.split('.').length - 1]
        this.total < this.length && this.total++
        this.percent = (this.per / this.total) * 100
        this.$tools.ossUpload(
          this.schoolCode,
          data.file,
          fileType,
          res => {
            if (!res) {
              return
            }
            this.uploadTag = false
            this.per < this.length && this.per++
            this.percent = (this.per / this.total) * 100
            if (res.code === 200) {
              this.$emit('onUploadProgress', 100)
              data.onSuccess()
              this.$message.success(`${data.file.name}上传成功`)
              if (this.fileList.length < this.length) {
                this.fileList = [
                  ...this.fileList,
                  {
                    uid: data.file.uid,
                    ...res.data
                  }
                ]
              } else {
                this.$message.warning(`超过上传数量限制,限制上传${this.length}个`)
              }
            } else {
              data.onError()
              this.$message.error(`${data.file.name}上传失败`)
            }
          },
          uploadPercent => {
            this.uploadPercent = uploadPercent === 100 ? 99 : uploadPercent
            this.$emit('onUploadProgress', this.uploadPercent)
          }
        )
      }
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
.upload-file {
  flex-wrap: wrap;
}
.progress {
  width: 100%;
  .bar {
    max-width: 500px;
  }
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
</style>
