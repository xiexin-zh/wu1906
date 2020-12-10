<template>
  <div class="page-layout qui-fx-ver">
    <!-- <choose-class
      title="选择班级"
      ref="chooseClass"
      :classList="classList"
      is-check
      v-model="chooseTag"
      v-if="chooseTag"
      @submit="chooseClass"
    ></choose-class> -->
    <div class="mode-content qui-fx-f2 qui-fx">
      <div class="qui-fx-f3 content-left" :style="{ backgroundImage: 'url(' + appForm.imgUrl + ')' }">
        <a-input placeholder="示例：热烈欢迎" class="content-input" v-model="appForm.title" />
        <a-textarea
          :autoSize="{ minRows: 2, maxRows: 4 }"
          placeholder="朋友们"
          class="content-input"
          v-model="appForm.content"
        />
        <!-- <a-input placeholder="莅临指导" class="content-input" v-model="appForm.contentThree"/> -->
      </div>
      <div class="qui-fx-f2 box-scroll" :style="{ height: scrollH - 220 + 'px' }">
        <a-button type="primary">选择背景</a-button>
        <div>
          <div class="notice-card qui-fx-ver" @click="newBackground">
            <div class="qui-fx-f1 qui-fx-ver qui-fx-jsb right-img">
              <a-upload
                name="fileList"
                :action="reqUrl"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                @change="uploadPic"
                class="add qui-fx-ac-jc"
              >
                <div class="qui-fx-ac-jc">
                  <a-icon type="plus" :style="{ fontSize: '28px' }" />
                  <p>自定义背景</p>
                </div>
              </a-upload>
            </div>
          </div>
          <div
            :class="active === index ? 'notice-card qui-fx-ver active' : 'notice-card qui-fx-ver'"
            v-for="(item, index) in imgList"
            :key="item.key"
            @click="chooseImg(item, index)"
          >
            <div
              class="qui-fx-f1 qui-fx-ver qui-fx-jsb right-img"
              :style="{ backgroundImage: 'url(' + item.img + ')' }"
            ></div>
            <div class="notice-title qui-fx-jc qui-je">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-table qui-fx-f1 qui-fx-ver">
      <a-form :form="form">
        <a-form-item label="生效时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-range-picker
            v-decorator="[
              'time',
              { initialValue: [appForm.startTime, appForm.endTime], rules: [{ required: true, message: '请选择时间' }] }
            ]"
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            @change="onChange"
            @ok="onOk"
          />
        </a-form-item>
        <a-form-item label="应用班牌：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-radio-group
            name="radioGroup"
            :default-value="appForm.showType ? appForm.showType : '1'"
            v-model="appForm.showType"
          >
            <a-radio value="1">全校班牌</a-radio>
            <a-radio value="2">指定班牌</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="appForm.showType === '2'"
          label="选择班牌："
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
          :required="false"
        >
          <div>
            <a-select
              mode="multiple"
              :defaultValue="chooseList"
              style="width: 100%"
              @change="handleChange"
              placeholder="请选择班牌场地"
            >
              <a-select-option v-for="item in classCardList" :key="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <!-- <a-form-item v-if="appForm.showType === '2'" label="选择班级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" :required="false">
          <div>
            <a-tag @click="classSelect" style="background: #fff; borderStyle: dashed;">
              <a-icon type="plus" />添加班级
            </a-tag>
            <template v-for="tag in classList">
              <a-tag color="blue" :key="tag.id" :closable="true" @close="() => classClose(tag)">
                {{ tag.gradeName }}{{ tag.className }}
              </a-tag>
            </template>
          </div>
        </a-form-item> -->
        <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
          <a-button type="primary" @click="addSubmit">
            确认
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import UploadMulti from '@c/UploadMulti'
import hostEnv from '@config/host-env'
import ChooseClass from '@c/ChooseClass'
import { mapState, mapActions } from 'vuex'
import bImg1 from '../../assets/img/bg_1.png'
import bImg2 from '../../assets/img/bg_2.png'
import bImg3 from '../../assets/img/bg_3.png'
import addImg from '../../assets/img/add-btn.png'
import moment from 'moment'
import 'moment/locale/zh-cn'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'AddWelcome',
  components: {
    UploadMulti,
    ChooseClass
  },
  props: {},
  data() {
    return {
      moment,
      chooseTag: false,
      form: this.$form.createForm(this),
      bImg1,
      bImg2,
      bImg3,
      addImg,
      reqUrl: '',
      scrollH: 0,
      appForm: {},
      active: 0,
      classList: [],
      chooseList: [],
      type: 0,
      id: '',
      classCardList: [],
      imgList: [
        {
          key: '1',
          title: '欢迎',
          img: bImg1
        },
        {
          key: '2',
          title: '春节',
          img: bImg2
        },
        {
          key: '3',
          title: '学无止境',
          img: bImg3
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.showList()
    this.scrollH = document.documentElement.offsetHeight - 200
    this.type = this.$route.query.type
    this.id = this.$route.query.id
    console.log(this.type)
    this.reqUrl = `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.userInfo.schoolCode}`
    if (this.id) {
      this.getWelcomeDetail(this.id).then(res => {
        this.appForm = res.data
        this.appForm.startTime = moment(new Date(res.data.startTime), 'YYYY-MM-DD HH:ss')
        this.appForm.endTime = moment(new Date(res.data.endTime), 'YYYY-MM-DD HH:ss')
        res.data.outClasscardDtoList.forEach(item => {
          this.chooseList.push(item.deviceName)
        })
      })
    } else {
      this.appForm = {
        showType: '1',
        imgUrl: this.imgList[0].img
      }
    }
    console.log(this.chooseList)
  },
  methods: {
    ...mapActions('home', [
      'addWelcome',
      'getWelcomeDetail',
      'getFaceLib',
      'getLibUserList',
      'editWelcomeById',
      'getClassCardList'
    ]),
    async showList() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        bindStatus: '1',
        page: 1,
        size: 9999
      }
      const res = await this.getClassCardList(req)
      if (!res.data) {
        return
      }
      res.data.list.forEach(item => {
        this.classCardList.push({
          key: item.id,
          name: item.deviceName
        })
      })
    },
    handleChange(value, option) {
      console.log(value)
      this.chooseList = value
    },
    /* chooseClass(classInfo) {
      this.classList = classInfo
      this.$refs.chooseClass.reset()
    },
    classSelect() {
      this.chooseTag = true
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    }, */
    beforeUpload(file) {
      const isJpg = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJpg && !isPng) {
        this.$message.error('请上传图片格式的文件(jpg/png)')
      }
      return isJpg || isPng
    },
    uploadPic(info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'error') {
        this.$message.warning('图片太大')
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 400) {
          this.$message.warning(info.file.response.message)
          return
        }
        getBase64(info.file.originFileObj, imageUrl => {
          this.appForm.imgUrl = info.file.response.data[0].url
        })
      }
    },
    chooseImg(item, index) {
      this.active = index
      this.appForm.imgUrl = item.img
      this.appForm.templateId = item.key
    },
    onChange(value, dateString) {
      this.appForm.startTime = dateString[0]
      this.appForm.endTime = dateString[1]
    },
    onOk(value) {
      this.appForm.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm')
      this.appForm.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm')
    },
    addSubmit() {
      this.appForm.schoolCode = this.userInfo.schoolCode
      if (!this.appForm.title && !this.appForm.contente) {
        this.$message.warning('请填写内容')
        return
      }
      if (!this.appForm.startTime || !this.appForm.endTime) {
        this.$message.warning('请选择时间')
        return
      }
      if (this.appForm.showType === '2') {
        this.appForm.classcardIds = []
        this.chooseList.forEach(ele => {
          this.classCardList.forEach(item => {
            if (item.name === ele) {
              this.appForm.classcardIds.push(item.key)
            }
          })
        })
      }
      console.log(this.appForm)
      if (this.type === '1') {
        this.editWelcomeById(this.appForm).then(res => {
          this.$message.success('编辑成功')
          this.$tools.goNext(() => {
            this.$router.go(-1)
          })
        })
      } else {
        this.addWelcome(this.appForm).then(res => {
          this.$message.success('新增成功')
          this.$tools.goNext(() => {
            this.$router.go(-1)
          })
        })
      }
    },
    newBackground() {}
  }
}
</script>

<style lang="less" scoped>
.control-tab {
  width: 180px;
  background-color: #fff;
}
.mode-content {
  background-color: #fff;
  padding: 20px 0px 20px 20px;
}
.go-back {
  margin-bottom: 5px;
  color: #1890ff;
  cursor: pointer;
}
.content-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .content-input {
    margin-bottom: 40px;
    width: 60%;
    height: 10%;
    text-align: center;
    font-size: 18px;
    border-radius: 8px;
  }
}
.notice-card {
  border-radius: 4px;
  float: left;
  width: 32%;
  margin-right: 1.3%;
  overflow: hidden;
  border: 1px solid #ccc;
  margin-top: 10px;
  min-height: 150px;
  cursor: pointer;
  position: relative;
  .notice-title {
    margin: 5px 0;
  }
  .add {
    p {
      margin-top: 5px;
    }
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ddd;
  }
}
.active {
  border: 2px solid @main-color;
}
.qui-fx-f3 {
  min-width: 0px;
  flex: 3;
  position: relative;
}
.right-img {
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
