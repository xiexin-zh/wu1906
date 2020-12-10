<template>
  <div class="class-card qui-fx">
    <div class="left">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <class-tree v-else @select="select"></class-tree>
    </div>
    <div class="right qui-fx-ver">
      <div class="tit u-mar-t10">
        <p class="qui-fx qui-fx-ac">班级格言</p>
      </div>
      <a-input allowClear :maxLength="30" placeholder="请输入班级格言" v-model="inputText"></a-input>
      <div class="tit">
        <p class="qui-fx qui-fx-ac">班级简介</p>
      </div>
      <a-textarea
        allowClear
        :maxLength="200"
        :autoSize="{ minRows: 5, maxRows: 5 }"
        placeholder="请输入班级简介"
        v-model="areaText"
      ></a-textarea>
      <div class="tit" style="margin-bottom: 10px">
        <p class="qui-fx qui-fx-ac">班级全家福</p>
      </div>
      <div class="qui-fx qui-fx-ac">
        <upload-video
          v-if="flag"
          type="image"
          :length="1"
          v-model="fileList"
          :fileInfo="fileInfo"
          @delUpload="delUpload"
          :maxSize="10"
        ></upload-video>
        <span class="u-mar-l10 u-font-01 u-tips-color">说明：支持上传JPG、PNG格式的图片，图片大小不得超过10M。</span>
      </div>
      <div class="button">
        <a-button type="primary" @click="save">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import UploadVideo from '@c/UploadVideo'
import { mapActions, mapState } from 'vuex'
import ClassTree from '@c/ClassTree'
import MajorTree from '@c/MajorTree'
import hostEnv from '@config/host-env'
export default {
  components: {
    ClassTree,
    MajorTree,
    UploadVideo
  },
  data() {
    return {
      flag: true,
      inputText: '',
      areaText: '',
      fileInfo: {
        url: '',
        tip: '上传图片',
        h: 200, // 高度
        w: 200 // 宽度
      },
      fileList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    console.log(this.userInfo)
    this.fileInfo.url = `${hostEnv.protal_api_11014}/study/theme/file/uploadFile?schoolCode=${this.userInfo.schoolCode}`
  },
  methods: {
    ...mapActions('home', ['getClassMotto', 'addClassMotto', 'delFile']),
    delUpload(value) {
      // this.delFile(value.id || this.fileList[0].photoId)
      this.flag = false
      this.$nextTick(() => {
        this.flag = true
      })
    },
    // 选中年级
    select(item) {
      console.log(item)
      if (item.classCode) {
        this.classInfo = item
        this.getMotto()
      }
    },
    async getMotto() {
      const req = {
        ...this.classInfo,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getClassMotto(req)
      if (!res.data) {
        this.inputText = ''
        this.areaText = ''
        this.fileList = []
      } else {
        this.inputText = res.data.motto
        this.areaText = res.data.introduce
        this.fileList = res.data.photoUrl ? [{ url: res.data.photoUrl, id: res.data.photoId }] : []
      }
    },
    async save() {
      console.log(this.inputText)
      if (this.inputText === '') {
        this.$message.error('请输入班级格言')
        return
      }
      if (this.areaText === '') {
        this.$message.error('请输入班级简介')
        return
      }
      const req = {
        ...this.classInfo,
        motto: this.inputText,
        introduce: this.areaText,
        schoolCode: this.userInfo.schoolCode,
        photoUrl: ''
      }
      if (this.fileList.length > 0) {
        req.photoUrl = this.fileList[0].url
        req.photoId = this.fileList[0].id
      }
      console.log(req)
      if (this.addOrEditTag) {
        req.id = this.mottoId
      }
      this.addClassMotto(req).then(() => {
        this.$message.success('编辑成功')
        this.$tools.goNext(() => {
          this.getMotto()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.class-card {
  flex: 1;
  overflow: hidden;
  .left {
    background: #fff;
    margin-right: 10px;
    padding: 10px;
    width: 200px;
  }
  .right {
    position: relative;
    flex: 1;
    background: #fff;
    padding: 10px;
    width: calc(100% - 210px);
    background: #fff url('../../assets/img/class_show.png') no-repeat fixed bottom;
    background-size: 100% 200px;
    .tit {
      margin: 20px 0;
      p {
        border-left: 3px solid @main-color;
        padding-left: 10px;
        font-weight: bold;
        margin: 0 0 0 5px;
        line-height: 16px;
        height: 16px;
      }
    }
    input {
      margin-bottom: 20px;
    }
    .button {
      margin: 20px auto;
    }
  }
}
</style>
