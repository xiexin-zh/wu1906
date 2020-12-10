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
      <img :src="pic.url" style="width: 80px; height: 80px" alt="" />
    </div>
    <a-upload
      :multiple="true"
      name="fileList"
      listType="picture-card"
      class="avatar-uploader mar-t10"
      :showUploadList="false"
      :action="reqUrl"
      :beforeUpload="beforeUpload"
      @change="uploadPic"
    >
      <div
        v-if="fileList.length < length"
        :style="{ height: fileInfo.h || 120 + 'px', width: fileInfo.w || 120 + 'px' }"
        class="qui-fx-ac-jc"
      >
        <div><a-icon style="font-size: 20px" :type="uploadTag ? 'loading' : 'plus'" /></div>
        <div class="ant-upload-text">{{ fileInfo.tip }}</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import hostEnv from '@config/host-env'
import { mapState } from 'vuex'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'UploadFile',
  props: {
    isCheck: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 3
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileInfo: {
      type: Object,
      default: () => {
        return {
          url: '',
          height: 120,
          width: 120,
          tip: '上传图片'
        }
      }
    }
  },
  data() {
    return {
      reqUrl: '',
      previewVisible: false,
      uploadTag: false,
      previewImage: '',
      currentIndex: -1
    }
  },
  mounted() {
    if (this.fileInfo.url) {
      this.reqUrl = this.fileInfo.url
    } else {
      this.reqUrl = !this.isCheck
        ? `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.schoolCode}`
        : `${hostEnv.protal_api_10050}/file/uploadUserPhoto?schoolCode=${this.schoolCode}`
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
      this.fileList.splice(index, 1)
    },
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error('请上传图片格式的文件(jpg/png)')
      }
      return isJpg || isPng
    },
    uploadPic(info) {
      if (info.file.status === 'uploading') {
        this.uploadTag = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 400) {
          this.$message.warning(info.file.response.message)
          return
        }
        getBase64(info.file.originFileObj, imageUrl => {
          this.fileList.push({
            uid: info.file.uid,
            uname: info.file.name,
            url: Array.isArray(info.file.response.data) ? info.file.response.data[0].url : info.file.response.data.url
          })
          this.uploadTag = false
        })
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
