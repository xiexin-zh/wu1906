<template>
  <div class="page-layout qui-fx-ver">
    <a-tabs>
      <a-tab-pane :tab="title" key="1">
        <submit-form ref="form" @submit-form="submitForm" title="上传照片" v-model="showTag" :form-data="formData">
          <div slot="upload" class="qui-fx qui-fx-ac">
            <upload-web
              ref="uploadWeb"
              :length="50"
              v-model="fileList"
              tip="上传照片"
              :schoolCode="userInfo.schoolCode"
            ></upload-web>
          </div>
        </submit-form>
        <div class="qui-fx-jsb u-mar-b10 u-mar-l10">
          <div>
            <a-button class="mar-r10" type="primary" @click="addPhoto"> <a-icon type="plus" />上传照片 </a-button>
            <a-button class="mar-r10" type="primary" @click="setAlbum"> <a-icon type="form" />轮播图设置 </a-button>
            <a-button type="primary" @click="batchDelePhoto"> <a-icon type="delete" />批量删除 </a-button>
          </div>
          <div v-if="checkTag">
            <a-button class="mar-r10" @click="cancle">取消</a-button>
            <a-button class="mar-r10" type="primary" @click="submit">确定</a-button>
          </div>
        </div>
        <no-data msg="暂无照片" v-if="photoList.length === 0"></no-data>
        <div v-else class="photo u-auto" :style="{ height: scrollH + 'px' }">
          <a-checkbox-group @change="onChange" v-model="checkedList">
            <div class="photo-list" v-for="(list, index) in photoList" :key="list.id">
              <div class="title qui-fx-je">
                <div>
                  <a-tooltip placement="topLeft" title="删除">
                    <a-button
                      size="small"
                      class="del-action-btn"
                      icon="delete"
                      @click.stop="delePhoto(list)"
                    ></a-button>
                  </a-tooltip>
                </div>
              </div>
              <img @click="show(index)" :src="list.photoSrc" alt />
              <div class="bottom">
                <a-checkbox v-if="checkTag" :value="list.id"></a-checkbox>
              </div>
            </div>
          </a-checkbox-group>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      destroyOnClose
      :maskClosable="false"
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
      width="800px"
    >
      <div class="content">
        <div class="album">
          <swiper :options="swiperOption">
            <swiper-slide class="u-fx-ac-jc" style="height: 400px" :key="item.id" v-for="item in photoList">
              <img :src="item.photoSrc" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import SubmitForm from '@c/SubmitForm'
import UploadWeb from '@c/UploadWeb'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
const formData = [
  {
    type: 'upload',
    label: '照片',
    placeholder: '请上传照片'
  }
]
export default {
  name: 'AlbumPhoto',
  components: {
    NoData,
    SubmitForm,
    UploadWeb,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      showTag: false,
      previewVisible: false,
      formData,
      title: '',
      checkTag: false,
      publishVisible: false,
      checkedList: [],
      photoList: [],
      fileList: [],
      chooseList: [],
      scrollH: 0,
      swiperOption: {
        autoplay: false,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        initialSlide: 0
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.scrollH = document.documentElement.offsetHeight - 180
    this.title = this.$route.query.title
    this.id = this.$route.query.id
    this.showList()
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['getPhotoList', 'addPhotos', 'deletePhoto', 'deletePhotos', 'setCover']),
    async showList() {
      const res = await this.getPhotoList({
        albumId: this.id
      })
      this.photoList = res.data.list
    },
    onChange(checkedValues) {
      this.chooseList = checkedValues
    },
    setAlbum() {
      this.checkTag = true
      this.checkedList = []
      if (this.photoList.length === 0) {
        return
      }
      this.photoList.forEach((item) => {
        if (item.isCover === '1') {
          this.checkedList.push(item.id)
        }
      })
      this.type = '1'
    },
    show(index) {
      this.swiperOption.initialSlide = index
      this.previewVisible = true
    },
    batchDelePhoto() {
      this.checkTag = true
      this.checkedList = []
      this.type = '2'
    },
    cancle() {
      this.checkTag = false
    },
    submit() {
      if (this.type === '1') {
        if (this.chooseList.length > 20) {
          this.$message.warning('最多只能设置20张')
          return
        }
        const req = {
          schoolCode: this.userInfo.schoolCode,
          ids: this.chooseList.join(',')
        }
        this.setCover(req).then(() => {
          this.$message.success('设置成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择照片')
          return
        }
        this.$tools.delTip('是否删除这些照片?', () => {
          this.deletePhotos(this.chooseList).then(() => {
            this.$message.success('删除成功')
            this.$tools.goNext(() => {
              this.showList()
            })
          })
        })
      }
      this.checkTag = false
    },
    addPhoto() {
      this.showTag = true
      this.addOrEditTag = 0
      this.formTitle = '上传照片'
      this.fileList = []
      this.formData = this.$tools.fillForm(formData, {})
    },
    delePhoto(list) {
      this.$tools.delTip('是否删除此照片?', () => {
        this.deletePhoto(list.id).then(() => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    sure() {
      this.publishVisible = false
    },
    submitForm(values) {
      if (this.fileList.length === 0) {
        this.$message.error('照片不能为空')
        this.$refs.form.error()
        return
      }
      const req = {
        albumId: this.id,
        createUsercode: this.userInfo.userCode,
        createUsername: this.userInfo.userName,
        photoSrcList: this.fileList.map((item) => {
          return item.url
        })
      }
      this.addPhotos(req).then(() => {
        this.$refs.form.reset()
        this.$message.success('上传成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.photo-list {
  margin-bottom: 1.2%;
  border-radius: 6px;
  overflow: hidden;
  width: 18.5%;
  min-width: 200px;
  background-color: #fff;
  height: 200px;
  float: left;
  margin-left: 1.2%;
  position: relative;
  & > img {
    width: 100%;
    height: 200px;
    display: block;
  }
  .title {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(220, 220, 220, 0.2);
    padding: 6px 0px 6px 10px;
    color: #fff;
    opacity: 0;
    transition: 1s;
  }
  &:hover .title {
    opacity: 1;
  }
  .bottom {
    width: 100%;
    position: absolute;
    bottom: 2px;
    left: 2px;
  }
}
/deep/ .ant-tabs-bar {
  margin-bottom: 10px;
}
.content {
  width: 100%;
  .album {
    width: 600px;
    height: 400px;
    background: rgba(220, 220, 220, 0.2);
    margin: 20px auto;
    img {
      max-width: 600px;
      max-height: 400px;
    }
  }
}
</style>
