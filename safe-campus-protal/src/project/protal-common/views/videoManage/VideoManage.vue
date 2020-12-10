<template>
  <div class="page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="上传视频"
      @closeModal="closeModal"
      v-model="showTag"
      :form-data="formData"
    >
      <div v-if="!editTag" slot="upload" class="qui-fx qui-fx-ac">
        <upload-video
          :maxSize="500"
          @onUploadProgress="onUploadProgress"
          :length="1"
          v-model="videoList"
          :percent="uploadPercent"
          :schoolCode="userInfo.schoolCode"
        ></upload-video>
      </div>
    </submit-form>
    <choose-bind
      isCheck
      ref="bindTemplate"
      v-if="bindTag"
      v-model="bindTag"
      @submit="bindSubmit"
      title="选择发布对象"
      :bindObj="bindObj"
    ></choose-bind>
    <choose-classcard
      isCheck
      ref="chooseClasscard"
      v-if="fullTag"
      v-model="fullTag"
      :mediaCode="mediaCode"
      @submit="fullSubmit"
      title="选择全屏展示的设备"
      :bindObj="fullDeviceInfo"
    ></choose-classcard>
    <div class="u-padd-10 qui-fx-je">
      <a-button type="primary" @click="add(0)"> <a-icon type="plus" />上传视频 </a-button>
    </div>
    <no-data msg="暂无数据" v-if="dataList.length === 0"></no-data>
    <div v-else class="qui-fx-ver u-fx-f1">
      <div class="u-auto" :style="{ height: scrollH + 'px' }">
        <div class="notice-card qui-fx" v-for="(item, i) in dataList" :key="i" style="position: relative">
          <div class="pic qui-fx-f1 qui-fx-ver qui-fx-jsb">
            <div class="notice-img qui-fx-ac-jc">
              <video
                :ref="item.id"
                @click="controls($event, item.id)"
                controls
                object-fit="contain"
                :src="item.url"
                class="video"
              />
            </div>
            <div class="qui-fx-jsb qui-fx-ac">
              <div class="u-te">{{ item.fileName }}</div>
              <div class="notice-action qui-fx">
                <a-tooltip placement="topLeft" title="编辑">
                  <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, item)"></a-button>
                </a-tooltip>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button size="small" class="del-action-btn" icon="delete" @click.stop="delClick(item)"></a-button>
                </a-tooltip>
                <a-dropdown>
                  <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                    更多
                    <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click.stop="useTo(item)">发布对象</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click.stop="fullScreenTo(item)">全屏展示设置</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click.stop="setCarousel(item)">轮播设置</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-num v-if="dataList.length !== 0" v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import SubmitForm from '@c/SubmitForm'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import UploadVideo from '../../component/UploadVideo'
import ChooseBind from '../../component/ChooseBind'
import ChooseClasscard from '../../component/ChooseClasscard'
const formData = [
  {
    value: 'fileName',
    initValue: '',
    type: 'input',
    label: '视频名称',
    placeholder: '请输入视频名称'
  },
  {
    type: 'upload',
    label: '添加视频',
    placeholder: '请上传视频'
  }
]

export default {
  name: 'AlbumManage',
  components: {
    NoData,
    PageNum,
    SubmitForm,
    UploadVideo,
    ChooseBind,
    ChooseClasscard
  },
  data() {
    return {
      showTag: false,
      editTag: false,
      fullTag: false,
      bindTag: false,
      formData,
      dataList: [],
      fullDeviceInfo: {},
      bindObj: {},
      scrollH: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      videoList: [],
      uploadPercent: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.scrollH = document.documentElement.offsetHeight - 210
    this.showList()
  },

  mounted() {},
  methods: {
    ...mapActions('home', [
      'getVideoList',
      'editVideo',
      'deleteVideo',
      'getRelationData',
      'getFullDevice',
      'addRelationData',
      'setFullShow',
      'addVideo'
    ]),
    async showList() {
      this.pageList.schoolCode = this.userInfo.schoolCode
      const res = await this.getVideoList(this.pageList)
      this.dataList = res.data.list
      this.total = res.data.total
    },
    controls(e, id) {
      this.dataList.forEach((el) => {
        if (id !== el.id) {
          this.$refs[el.id][0].pause()
        }
      })
    },
    async useTo(item) {
      this.mediaCode = item.mediaCode
      const res = await this.getRelationData(item.mediaCode)
      this.bindObj = {
        classList: res.data.classList.map(el => {
          return {
            ...el,
            subjectName: el.professionName,
            subjectCode: el.professionCode
          }
        }),
        teaList: res.data.teacherList,
        deviceList: res.data.deviceList
      }
      this.bindTag = true
    },
    async fullScreenTo(item) {
      this.mediaCode = item.mediaCode
      const res = await this.getFullDevice({ mediaCode: item.mediaCode, mediaType: 2 })
      this.fullDeviceInfo = res.data
      this.fullTag = true
    },
    setCarousel(item) {
      this.$confirm({
        title: '是否将该视频设置为首页轮播?',
        okText: '设置为轮播',
        cancelText: '取消',
        onOk: async () => {
          await this.editVideo({
            mediaCode: item.mediaCode,
            id: item.id,
            schoolCode: this.userInfo.schoolCode,
            isCover: 1
          })
          this.$message.success('设置成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        },
        onCancel() {}
      })
    },
    add(type, item) {
      this.showTag = true
      this.uploadPercent = 0
      if (type) {
        this.editTag = true
        this.id = item.id
        this.formData = this.$tools.fillForm([formData[0]], item)
      } else {
        this.editTag = false
        this.formData = formData
      }
    },
    delClick(record) {
      this.$tools.delTip('确认要删除该视频吗?', () => {
        this.deleteVideo(record.id).then((res) => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    onUploadProgress(value) {
      this.uploadPercent = value
      if (value === 100) {
        this.$message.success('上传成功')
      }
    },
    async submitForm(values) {
      if (this.editTag) {
        await this.editVideo({
          fileName: values.fileName,
          id: this.id,
          schoolCode: this.userInfo.schoolCode
        })
        this.$message.success('编辑成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } else {
        if (this.videoList.length === 0) {
          this.$message.error('请上传视频')
          this.$refs.form.error()
          return
        }
        console.log(this.videoList)
        await this.addVideo({
          videoName: values.fileName,
          videoUrl: this.videoList[0].url,
          schoolCode: this.userInfo.schoolCode,
          fileType: 'mp4',
          createUsercode: this.userInfo.userCode,
          createUsername: this.userInfo.userName
        })
        this.$message.success('上传成功')
        this.$tools.goNext(() => {
          this.videoList = []
          this.$refs.form.reset()
          this.showList()
        })
      }
    },
    closeModal() {
      this.$tools.closeUpload()
    },
    async fullSubmit(value, formData) {
      await this.setFullShow({
        deviceIdList: value.map((el) => {
          return el.id
        }),
        isAll: 0,
        mediaType: 2,
        mediaCode: this.mediaCode,
        startTime: formData.startTime,
        endTime: formData.endTime
      })
      this.$message.success('发布成功')
      this.$tools.goNext(() => {
        this.$refs.chooseClasscard.reset()
        this.showList()
      })
    },
    async bindSubmit(value) {
      await this.addRelationData({
        classList: value.classList.map((el) => {
          return {
            classCode: el.classCode,
            className: el.className,
            schoolCode: el.schoolCode,
            schoolYearId: el.schoolYearId,
            gradeCode: el.gradeCode,
            gradeName: el.gradeName,
            professionName: el.subjectName,
            professionCode: el.subjectName,
            mediaCode: this.mediaCode,
            id: el.userId || undefined
          }
        }),
        teacherList: value.teaList.map((el) => {
          return {
            userCode: el.userCode,
            userName: el.userName,
            schoolCode: el.schoolCode,
            mediaCode: this.mediaCode,
            id: el.userId || undefined
          }
        }),
        deviceList: value.deviceList.map((el) => {
          return {
            deviceIp: el.deviceIp,
            deviceName: el.deviceName,
            schoolCode: el.schoolCode,
            deviceSn: el.deviceSn,
            classCode: el.classCode,
            className: el.className,
            gradeCode: el.gradeCode,
            gradeName: el.gradeName,
            placeName: el.placeName,
            placeId: el.placeId,
            mediaCode: this.mediaCode,
            id: el.userId || undefined
          }
        }),
        mediaType: 2,
        mediaCode: this.mediaCode,
        schoolCode: this.userInfo.schoolCode
      })
      this.$message.success('发布成功')
      this.$tools.goNext(() => {
        this.$refs.bindTemplate.reset()
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.notice-card {
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 10px;
  float: left;
  width: 18.88%;
  margin-left: 1%;
  overflow: hidden;
  margin-bottom: 20px;
  min-height: 200px;
}
.notice-img {
  margin: 0 15px 10px 0;
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  .video {
    width: 100%;
    height: 200px;
  }
}
.u-mar-l5 {
  margin-left: 5px;
}
.ant-dropdown-link {
  width: 45px;
}
</style>
