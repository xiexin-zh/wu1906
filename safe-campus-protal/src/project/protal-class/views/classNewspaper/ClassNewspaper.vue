<template>
  <div class="class-newspaper qui-fx">
    <div class="left">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <class-tree v-else @select="select"></class-tree>
    </div>
    <div class="right qui-fx-ver">
      <div class="u-mar-b10">
        <div class="u-bold u-mar-b10">温馨提示：</div>
        <div class="u-font-01 u-tips-color">1、限制最多9张图片</div>
        <div class="u-font-01 u-tips-color">2、支持发布不大于10M的png、jpg格式图片</div>
      </div>
      <div class="qui-fx-ver">
        <div class="box-scroll" :style="{ height: scrollH - 50 + 'px' }">
          <div class="qui-fx qui-fx-ac">
            <upload-video
              v-if="flag"
              showTimeTag
              type="image"
              :length="9"
              v-model="fileList"
              :fileInfo="fileInfo"
              @success="success"
              @delUpload="delUpload"
            ></upload-video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import UploadVideo from '@c/UploadVideo'
import ClassTree from '@c/ClassTree'
import MajorTree from '@c/MajorTree'
import hostEnv from '@config/host-env'

export default {
  components: {
    ClassTree,
    UploadVideo,
    MajorTree
  },
  data() {
    return {
      flag: true,
      dataList: [],
      fileInfo: {
        url: '',
        tip: '上传图片',
        h: 300,
        w: 300
      },
      fileList: [],
      scrollH: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'loginType'])
  },
  created() {
    this.scrollH = document.documentElement.offsetHeight - 180
    this.fileInfo.url = `${hostEnv.protal_api_11014}/study/theme/file/uploadFile?schoolCode=${this.userInfo.schoolCode}`
  },
  methods: {
    ...mapActions('home', ['delFile', 'getNewspaperList', 'addNewspaper', 'deleNewspaper']),
    // 选中年级
    select(item) {
      console.log(item)
      if (item.classCode) {
        this.classInfo = item
        this.showList()
      }
    },
    async success(value) {
      console.log(value)
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId,
        ...this.classInfo,
        className: this.classInfo.clazzName,
        createUsercode: this.loginType.userCode,
        createUsername: this.loginType.userName,
        photoUrl: value.url,
        photoId: value.id
      }
      await this.addNewspaper(req)
      this.$message.success('添加成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async delUpload(value) {
      console.log(value)
      // await this.delFile(value.recordId || value.id)
      await this.deleNewspaper(value.recordId || value.id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async showList() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.classInfo.schoolYearId,
        classCode: this.classInfo.classCode,
        gradeCode: this.classInfo.gradeCode
      }
      const res = await this.getNewspaperList(req)
      this.fileList = res.data.map(el => {
        return {
          id: el.photoId,
          url: el.photoUrl,
          createTime: el.createTime,
          recordId: el.id
        }
      })
      this.flag = false
      this.$nextTick(() => {
        this.flag = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.class-newspaper {
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
    .box-scroll {
      overflow: auto;
    }
    .notice-card {
      border-radius: 4px;
      background-color: #f5f5f5;
      padding: 10px;
      float: left;
      width: 24%;
      margin-left: 1%;
      overflow: hidden;
      margin-bottom: 20px;
      min-height: 200px;
    }
  }
}
</style>
