<template>
  <div class="post-card page-layout qui-fx-ver">
    <div class="fill-top">
      <div class="u-mar-l40">岗位安全风险告知卡</div>
    </div>
    <div class="qui-fx-f1">
      <div class="top-btn-group">
        <a-button icon="download" class="play-action-btn" @click="exportWord">下载</a-button>
        <a-upload
          :multiple="true"
          name="fileList"
          :showUploadList="false"
          :action="reqUrl"
          :beforeUpload="beforeUpload"
          @change="uploadPic"
        >
          <a-button icon="export" class="export-btn">上传图片</a-button>
        </a-upload>
      </div>
      <div class="info u-padd-l40 u-padd-r40" v-if="detailInfo && JSON.stringify(detailInfo) !== {}">
        <div class="u-tx-c u-font-2 u-mar-b10">岗位风险告知卡</div>
        <div v-if="detailInfo.photoUrl">
          <img :src="detailInfo.photoUrl" alt="" />
        </div>
        <div v-else>
          <div>
            <div class="info-box qui-fx">
              <div class="info-title">部门：</div>
              <div class="info-content qui-fx-f1">{{ detailInfo.deptName }}</div>
            </div>
            <div class="info-box qui-fx">
              <div class="info-title">岗位：</div>
              <div class="info-content qui-fx-f1">{{ detailInfo.responsibilityPostName }}</div>
            </div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">检查对象：</div>
            <div class="info-content qui-fx-f1">{{ detailInfo.checkObject }}</div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">风险编号：</div>
            <div class="info-content qui-fx-f1">{{ detailInfo.riskAssessmentId }}</div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">事故类型：</div>
            <div class="info-content qui-fx-f1">{{ detailInfo.riskType }}</div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">潜在风险：</div>
            <div class="info-content qui-fx-f1">{{ detailInfo.riskContent }}</div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">应急处置：</div>
            <div class="info-content qui-fx-f1">{{ detailInfo.emergencyMeasure }}</div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">责任人：</div>
            <div class="info-content qui-fx-f1">{{ detailInfo.emergencyUser }}</div>
          </div>
          <div class="img-box qui-fx">
            <div class="info-title">警示标识：</div>
            <div class="info-content info-img qui-fx-f1">
              <img v-for="(list, index) in detailInfo.signs" :key="index" :src="list" alt />
            </div>
          </div>
        </div>
      </div>
      <no-data v-else msg="暂无数据~"> </no-data>
    </div>
    <page-num :changer="false" :jumper="false" v-model="pageList" :total="total" @change-page="showDetail"></page-num>
  </div>
</template>

<script>
import NoData from '@c/NoData'
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import ChoosePost from '@c/choose/ChoosePost'
import PageNum from '@c/PageNum'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'PostCard',
  components: {
    ChoosePost,
    PageNum,
    NoData
  },
  data() {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      detailInfo: {},
      detailImg: [],
      isLoad: false,
      emergencyPhone: '',
      userTag: false,
      active: '',
      leaderList: [],
      viceLeaderList: [],
      memberList: [],
      fileList: [],
      params: {},
      pageList: {
        page: 1,
        size: 1
      },
      total: 0,
      reqUrl: '',
      dataURL: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.reqUrl = `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.userInfo.schoolCode}`
    this.params.schoolCode = this.userInfo.schoolCode
    this.showDetail()
  },
  methods: {
    ...mapActions('home', [
      'riskCard',
      'saveRiskGroup',
      'riskFileList',
      'addRiskFile',
      'delRiskFile',
      'riskUpload',
      'postCardLoad'
    ]),
    async showDetail() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.riskCard(req)
      this.detailInfo = res.data.records[0]
      this.total = res.data.total
    },
    async _riskFileList(info) {
      const result = await this.riskFileList(this.userInfo.schoolCode)
      this.fileList = result.data
    },
    addTag(type) {
      this.active = type
      this.userTag = true
    },
    choosePost(list) {
      this[this.active] = list
      this.$refs.choosePost.reset()
    },
    userClose(removedTag, string) {
      this[string] = this[string].filter(tag => tag !== removedTag)
    },
    async _addRiskFile(info) {
      const req = {
        fileName: info.file.name,
        fileUrl: info.file.response.data[0],
        schoolCode: this.userInfo.schoolCode
      }
      this.addRiskFile(req).then(res => {
        this.$message.success(`${info.file.name} 上传成功`)
        this.$tools.goNext(() => {
          this.isLoad = false
          this._riskFileList()
        })
      })
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
        const req = {
          picture: info.file.response.data[0].url,
          schoolCode: this.userInfo.schoolCode
        }
        this.riskUpload(req).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showDetail()
          })
        })
      }
    },
    exportWord() {
      if (this.detailInfo && JSON.stringify(this.detailInfo) !== {}) {
        if (this.detailInfo.photoUrl) {
          const url = `${hostEnv.protal_api_10050}/file/downLoad/doc?url=${this.detailInfo.photoUrl}`
          window.open(url)
        } else {
          fetch(`${hostEnv.protal_api_8091}/riskNoticeCard/download/${this.detailInfo.id}`, {
            method: 'Get',
            mode: 'cors'
          })
            .then(function(response) {
              return response.text()
            })
            .then(function(myJson) {
              const blob = new Blob([myJson], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'
              })
              const objectUrl = URL.createObjectURL(blob)
              window.location.href = objectUrl
            })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.post-card {
  .fill-top {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 3px;
      background-color: #4d4cac;
      left: 25px;
      bottom: 15px;
    }
  }
  .info {
    .info-box {
      border-top: 1px solid #9698d6;
      height: 55px;
      line-height: 52px;
      width: 50%;
      float: left;
      &:nth-child(2n) {
        border-right: 1px solid #9698d6;
      }
    }
    .info-title {
      width: 150px;
      background-color: #f5f5fb;
      border-right: 1px solid #9698d6;
      border-left: 1px solid #9698d6;
      text-align: right;
      padding: 0 5px;
      color: #575758;
    }
    .info-content {
      padding: 0 10px;
      color: #333;
      width: 100%;
      overflow-x: scroll;
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
    }
    .img-box {
      border: 1px solid #9698d6;
      border-left: none;
      height: 55px;
      line-height: 50px;
      border-bottom: none;
      &:last-child {
        border-bottom: 1px solid #9698d6;
        height: 80px;
        line-height: 75px;
      }
      .info-title {
        &:last-child {
          border-bottom: 1px solid #9698d6 !important;
        }
      }
    }
    img {
      width: 100%;
      height: 600px;
    }
  }
}
</style>
