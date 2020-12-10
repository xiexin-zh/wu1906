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
              <!-- {{ detailInfo.signs }}  -->
              <img v-for="(list, index) in detailInfo.signs" :key="index" :src="list" alt />
              <!-- <img :src="detailInfo.signs" alt /> -->
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
import ImageModule from 'docxtemplater-image-module-free'
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'
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
    this.imageUrlToBase64()
  },
  methods: {
    ...mapActions('home', ['riskCard', 'saveRiskGroup', 'riskFileList', 'addRiskFile', 'delRiskFile', 'riskUpload']),
    imageUrlToBase64() {
      // 一定要设置为let，不然图片不显示
      const image = new Image()
      // 解决跨域问题
      image.setAttribute('crossOrigin', 'anonymous')
      const imageUrl = `${hostEnv.img_download}/security/2020/09/04/base/6af5f9d4f32c4790a7220857fc7e20f9.png`
      image.src = imageUrl
      // image.onload为异步加载
      image.onload = () => {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var quality = 0.8
        // 这里的dataurl就是base64类型
        this.dataURL = canvas.toDataURL('image/jpeg', quality) // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
        console.log('dataURL', this.dataURL)
      }
    },
    async showDetail() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.riskCard(req)
      this.detailInfo = res.data.records[0]
      // this.detailInfo.signs = res.data.records[0].signs[0]
      // this.detailInfo.signs = `${hostEnv.img_download}/security/2020/09/04/base/6af5f9d4f32c4790a7220857fc7e20f9.png`
      // console.log('signs', this.detailInfo.signs)
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
    changeImgToDataurl() {
      var charImg = document.getElementsByTagName('img')
      for (var i = 0; i < charImg.length; i++) {
        var imgURL = charImg[i].currentSrc
        this.getBase(imgURL, charImg[i])
      }
    },
    getBase(url, charImg) {
      var Img = new Image()
      Img.crossOrigin = 'Anonymous' // 跨域必须使用，且后台也得设置允许跨域
      let dataURL = ''
      Img.src = url
      Img.onload = function() {
        // 要先确保图片完整获取到，这是个异步事件
        var canvas = document.createElement('canvas') // 创建canvas元素
        var width = Img.width // 确保canvas的尺寸和图片一样
        var height = Img.height
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
        dataURL = canvas.toDataURL('image/jpg') // 转换图片为dataURL
        condataurl ? condataurl(dataURL, charImg) : null // 调用回调函数
      }
    },
    condataurl(dataURL, charImg) {
      charImg.src = dataURL
      // console.log(charImg);
    },
    exportWord() {
      if (this.detailInfo && JSON.stringify(this.detailInfo) !== {}) {
        if (this.detailInfo.photoUrl) {
          const url = `${hostEnv.protal_api_10050}/file/downLoad/doc?url=${this.detailInfo.photoUrl}`
          window.open(url)
        } else {
          this.changeImgToDataurl()
          // 读取并获得模板文件的二进制内容
          JSZipUtils.getBinaryContent('input.docx', (error, content) => {
            console.log('1212q', this.detailInfo.signs)
            // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
            // 抛出异常
            if (error) {
              throw error
            }
            const opts = {}
            opts.centered = true
            // const url = this.dataURL
            // const url = ' http://canpoint-file.oss-cn-beijing.aliyuncs.com/security/2020/09/04/base/6af5f9d4f32c4790a7220857fc7e20f9.png'
            // opts.getImage = (url) => {
            //   return this.dataURL
            // // return `${hostEnv.img_download}/security/2020/09/04/base/6af5f9d4f32c4790a7220857fc7e20f9.png`
            // }
            // opts.getSize = () => {
            //   return [600, 400]// 这里可更改输出的图片宽和高
            // }
            // const opts = {
            //   centered: false,
            //   getImage(tagValue, tagName) {
            //     return new Promise((resolve, reject) => {
            //       JSZipUtils.getBinaryContent(tagValue, (error, content) => {
            //         if (error) {
            //           return reject(error)
            //         }
            //         return resolve(content)
            //       })
            //     })
            //   },
            //   getSize(img, tagValue, tagName) {
            //     return [470, 210]
            //     // return new Promise((resolve, reject) => {

            //   // });
            //   }
            // }
            // const imageModule = new ImageModule(opts)
            // 创建一个PizZip实例，内容为模板的内容
            const zip = new PizZip(content)
            // 创建并加载docxtemplater实例对象
            // const doc = new docxtemplater().loadZip(zip).attachModule(imageModule)
            const doc = new docxtemplater().loadZip(zip)
            doc.setData({
              ...this.detailInfo
            })

            try {
              // 用模板变量的值替换所有模板变量
              doc.render()
            } catch (error) {
              // 抛出异常
              const e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties
              }
              console.log(JSON.stringify({ error: e }))
              throw error
            }

            // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
            const out = doc.getZip().generate({
              type: 'blob',
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            })
            // 将目标文件对象保存为目标类型的文件，并命名
            saveAs(out, '岗位风险告知卡.docx')
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
      height: 100%;
    }
  }
}
</style>
