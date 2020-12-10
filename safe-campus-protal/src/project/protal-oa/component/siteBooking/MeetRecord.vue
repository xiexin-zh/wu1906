<template>
  <div>
    <a-modal width="1200px" :title="title" v-model="status" :maskClosable="false" :destroyOnClose="true">
      <template slot="footer" v-if="showTag === '1'">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="submitOk">
          提交
        </a-button>
      </template>
      <template slot="footer" v-else>
        <a-button type="primary" key="back" @click="handleCancel">
          确定
        </a-button>
      </template>
      <a-form :form="form" v-if="showTag === '1'">
        <a-form-item label="纪要内容：" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :required="true">
          <quill-editor
            style="height: 400px; width: 80%"
            v-model="appForm.content"
            ref="myQuillEditor"
            :options="quillOption"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
        </a-form-item>
        <div style="margin-top: 70px;">
          <a-form-item label="上传图片：" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" :required="false">
            <div class="qui-fx qui-fx-ac">
              <upload-multi :length="9" v-model="appForm.fileList" :fileInfo="fileInfo"></upload-multi>
              <!--  <span style="font-size:12px;margin-left:10px;">大小20到100kB，像素400x400到800x800，格式仅jpg</span> -->
            </div>
          </a-form-item>
          <!-- <a-form-item
            label="上传附件："
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
            :required="false"
          >
            <div class="qui-fx-ac">
              <a-upload
                name="fileList"
                :action="fileInfo.url"
                :remove="remove"
                @change="upload"
                accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf"
              >
                <a-button v-if="appForm.otherList.length < 5" type="primary">
                  <a-icon type="upload" />上传
                </a-button>
              </a-upload>
            </div>
          </a-form-item> -->
        </div>
      </a-form>
      <div class="content" v-else>
        <div class="down-load qui-fx" v-if="recordInfo.attachList.length > 0">
          <div class="album">
            <swiper :options="swiperOption">
              <swiper-slide :key="i" v-for="(item, i) in recordInfo.attachList">
                <img :src="item.fileUrl" />
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </div>
        <div class="down-load qui-fx" v-if="recordInfo.otherList.length > 0">
          <h3>附件：</h3>
          <ul>
            <li class v-for="(item, i) in recordInfo.otherList" :key="i">
              {{ item.fileName }}
              <a-button class="button mar-l10" type="primary" @click="goDownload(item.fileUrl)">查看</a-button>
            </li>
          </ul>
        </div>
        <div class="">
          <p class="ql-editor img_" v-html="recordInfo.content"></p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from '@a/js/quill-config'
import UploadMulti from '@c/UploadMulti'
import { mapState, mapActions } from 'vuex'
import hostEnv from '@config/host-env'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import 'swiper/css/swiper.css'
export default {
  name: 'MeetRecord',
  components: {
    quillEditor,
    UploadMulti,
    Swiper,
    SwiperSlide
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    id(val) {
      this.showData()
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
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
      swiperOption: {
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      },
      confirmLoading: false,
      showTag: '1',
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      quillOption: quillConfig,
      fileInfo: {
        tip: '上传图片',
        url: '',
        h: 120, // 高度
        w: 120 // 宽度
      },
      uploadFile: [],
      appForm: {
        content: '',
        fileList: [],
        otherList: []
      },
      recordInfo: {
        content: '',
        attachList: [],
        otherList: []
      }
    }
  },
  mounted() {
    this.fileInfo.url = `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.userInfo.schoolCode}`
  },
  methods: {
    ...mapActions('home', ['getMeetRecordById']),
    valiImgType(str) {
      return /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(str)
    },
    async showData() {
      const res = await this.getMeetRecordById(this.id)
      if (res.data === null) {
        this.showTag = '1'
        this.recordInfo = {
          content: '',
          attachList: [],
          otherList: []
        }
      } else {
        this.showTag = '2'
        this.recordInfo.attachList = []
        this.recordInfo.otherList = []
        this.recordInfo.content = res.data.content
        res.data.attachList.forEach(ele => {
          if (this.valiImgType(ele.fileUrl)) {
            this.recordInfo.attachList.push(ele)
          } else {
            this.recordInfo.otherList.push(ele)
          }
        })
      }
    },
    // 获得焦点事件
    onEditorFocus(data) {},
    onEditorChange(data) {
      this.appForm.content = data.html
    },
    remove(file) {
      const index = this.appForm.fileList.findIndex(item => {
        return item.uid === file.uid
      })
      this.appForm.fileList.splice(index, 1)
    },
    upload(info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'error') {
        if (info.file.size > 10485760) {
          this.$message.error('上传文件大小限制在10MB内')
        }
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 400) {
          this.$message.warning(info.file.response.message)
          return
        }
        this.appForm.otherList.push({
          fileName: info.file.name,
          uid: info.file.uid,
          fileUrl: Array.isArray(info.file.response.data) ? info.file.response.data[0].url : info.file.response.data.url
        })
      }
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    handleCancel() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.appForm.content.length === 0) {
            this.$message.warning('请输入纪要内容')
            this.confirmLoading = false
            return
          }
          this.appForm.fileList.map(el => {
            el.fileName = el.uname
            el.fileUrl = el.url
          })
          this.$emit('submit-form', this.appForm)
        }
      })
    },
    goDownload(url) {
      window.open(url, '_blank')
      /* window.location.href = url */
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  max-height: 700px;
  overflow: auto;
}
.img_ /deep/ img {
  max-width: 600px;
  margin: 10px 0;
}
.down-load {
  margin-bottom: 20px;
  h3 {
    margin-bottom: 0;
  }
  li {
    margin-bottom: 10px;
    /*       padding-right: 60px;
      position: relative;
      .button{
        position: absolute;
        right: 0;
      } */
  }
}
.album {
  width: 600px;
  height: 400px;
  margin: 20px auto 40px auto;
  img {
    width: 600px;
    height: 400px;
  }
}
</style>
