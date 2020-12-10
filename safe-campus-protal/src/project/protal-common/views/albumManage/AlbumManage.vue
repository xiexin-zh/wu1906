<template>
  <div class="page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="showTag" :form-data="formData">
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
      <a-button type="primary" @click="addAlbum(0)"> <a-icon type="plus" />添加相册 </a-button>
    </div>
    <no-data msg="暂无数据" v-if="albumList.length === 0"></no-data>
    <div v-else class="qui-fx-ver">
      <div class="u-auto" :style="{ height: scrollH + 'px' }">
        <div class="notice-card qui-fx" v-for="(item, i) in albumList" :key="i" style="position: relative;">
          <div class="pic qui-fx-f1 qui-fx-ver qui-fx-jsb">
            <div
              @click="detail(item)"
              class="notice-img qui-fx-ac-jc"
              :style="{
                backgroundImage: 'url(' + (item.coverUrl || 'http://canpointtest.com/mobile-img/default.png') + ')'
              }"
            ></div>
            <div class="qui-fx-jsb qui-fx-ac">
              <div class="u-te">
                {{ item.albumName }}
              </div>
              <div class="notice-action qui-fx">
                <a-tooltip placement="topLeft" title="编辑">
                  <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addAlbum(1, item)"></a-button>
                </a-tooltip>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    @click.stop="delClick(item)"
                  ></a-button>
                </a-tooltip>
                <a-dropdown>
                  <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                    更多 <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click.stop="detail(item)">添加照片</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click.stop="useTo(item)">发布对象</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click.stop="fullScreenTo(item)">全屏展示设置</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ChooseBind from '../../component/ChooseBind'
import ChooseClasscard from '../../component/ChooseClasscard'
import NoData from '@c/NoData'
import SubmitForm from '@c/SubmitForm'
const formData = [
  {
    value: 'albumName',
    initValue: '',
    type: 'input',
    label: '相册名称',
    placeholder: '请输入相册名称,不超过10字符',
    required: true,
    max: 10
  }
]
export default {
  name: 'AlbumManage',
  components: {
    NoData,
    SubmitForm,
    ChooseBind,
    ChooseClasscard
  },
  data() {
    return {
      showTag: false,
      fullTag: false,
      bindTag: false,
      formData,
      title: '新建相册',
      albumList: [],
      fullDeviceInfo: {},
      bindObj: {},
      scrollH: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.scrollH = document.documentElement.offsetHeight - 120
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getAlbumList',
      'addNewAlbum',
      'deleteAlbum',
      'detailAlbum',
      'editAlbum',
      'addRelationData',
      'getRelationData',
      'setFullShow',
      'getDeviceData',
      'getFullDevice'
    ]),
    async showList() {
      const res = await this.getAlbumList({
        schoolCode: this.userInfo.schoolCode
      })
      this.albumList = res.data
    },
    async useTo(item) {
      this.albumCode = item.albumCode
      const res = await this.getRelationData(item.albumCode)
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
      console.log(this.bindObj)
      this.bindTag = true
    },
    async fullScreenTo(item) {
      this.mediaCode = item.albumCode
      const res = await this.getFullDevice({ mediaCode: item.albumCode, mediaType: 1 })
      this.fullDeviceInfo = res.data
      this.fullTag = true
    },
    detail(item) {
      this.$router.push({ path: `/albumManage/albumPhoto?id=${item.id}&title=${item.albumName}` })
    },
    async addAlbum(type, record) {
      this.showTag = true
      this.type = type
      if (type === 1) {
        this.title = '编辑相册'
        this.id = record.id
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.title = '新建相册'
        this.formData = this.$tools.fillForm(formData, {})
      }
    },
    submitForm(values) {
      if (this.type === 0) {
        this.addNewAlbum({
          ...values,
          schoolCode: this.userInfo.schoolCode,
          createUsercode: this.userInfo.userCode,
          createUsername: this.userInfo.userName
        }).then(() => {
          this.$message.success('新建成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      } else {
        this.editAlbum({
          ...values,
          id: this.id,
          schoolCode: this.userInfo.schoolCode,
          createUsercode: this.userInfo.userCode,
          createUsername: this.userInfo.userName
        }).then(() => {
          this.$message.success('编辑成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      }
      this.showTag = false
      this.$refs.form.reset()
    },
    delClick(record) {
      this.$tools.delTip('确认要删除该相册吗?', () => {
        this.deleteAlbum(record.id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    async fullSubmit(value, formData) {
      await this.setFullShow({
        deviceIdList: value.map(el => {
          return el.id
        }),
        isAll: 0,
        mediaType: 1,
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
        classList: value.classList.map(el => {
          return {
            classCode: el.classCode,
            className: el.className,
            schoolCode: el.schoolCode,
            schoolYearId: el.schoolYearId,
            gradeCode: el.gradeCode,
            gradeName: el.gradeName,
            professionName: el.subjectName,
            professionCode: el.subjectName,
            mediaCode: this.albumCode,
            id: el.userId || undefined
          }
        }),
        teacherList: value.teaList.map(el => {
          return {
            userCode: el.userCode,
            userName: el.userName,
            schoolCode: el.schoolCode,
            mediaCode: this.albumCode,
            id: el.userId || undefined
          }
        }),
        deviceList: value.deviceList.map(el => {
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
            mediaCode: this.albumCode,
            id: el.userId || undefined
          }
        }),
        mediaType: 1,
        mediaCode: this.albumCode,
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
}
.u-mar-l5 {
  margin-left: 5px;
}
.ant-dropdown-link{
  width: 45px;
}
</style>
