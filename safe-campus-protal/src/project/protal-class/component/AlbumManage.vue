<template>
  <div>
    <a-modal
      :title="title"
      v-model="publishVisible"
      :destroyOnClose="true"
      :maskClosable="false"
      width="80%"
      class="modal"
      @cancel="cancelVisible"
      :footer="null"
      @ok="sure"
    >
      <submit-form ref="form" @submit-form="submitForm" :title="formTitle" v-model="showTag" :form-data="formData">
        <div slot="upload" class="qui-fx qui-fx-ac">
          <upload-web
            ref="uploadWeb"
            :length="photoLength"
            v-model="fileList"
            tip="上传照片"
            :schoolCode="userInfo.schoolCode"
          ></upload-web>
        </div>
      </submit-form>
      <div class="qui-fx-jsb mar-l10">
        <div>
          <a-button class="mar-r10" type="primary" @click="setAlbum"> <a-icon type="form" />轮播图设置</a-button>
          <a-button class="mar-r10" type="primary" @click="addPhoto"> <a-icon type="plus" />上传照片</a-button>
          <a-button type="primary" @click="batchDelePhoto"> <a-icon type="delete" />批量删除</a-button>
        </div>
        <div v-if="checkTag">
          <a-button class="mar-r10" @click="cancle">取消</a-button>
          <a-button type="primary" @click="submit">确定</a-button>
        </div>
      </div>
      <no-data msg="暂无照片" v-if="photoList.length === 0"></no-data>
      <div v-else class="photo">
        <a-checkbox-group @change="onChange" v-model="checkedList">
          <div class="photo-list" v-for="(list, index) in photoList" :key="list.id">
            <div class="title qui-fx-je">
              <div>
                <a-tooltip placement="topLeft" title="编辑">
                  <a-button size="small" class="edit-action-btn" icon="form" @click.stop="editPhoto(list)"></a-button>
                </a-tooltip>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button size="small" class="del-action-btn" icon="delete" @click.stop="delePhoto(list)"></a-button>
                </a-tooltip>
              </div>
            </div>
            <img :src="list.photoSrc" alt="" @click="show(index)" />
            <div class="bottom">
              <a-checkbox v-if="checkTag" :value="list.id"></a-checkbox>
            </div>
            <div class="qui-te">照片描述：{{ list.description }}</div>
          </div>
        </a-checkbox-group>
      </div>
    </a-modal>
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
import SubmitForm from '@c/SubmitForm'
import UploadWeb from '@c/UploadWeb'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
const addFormData = [
  {
    type: 'upload',
    label: '照片',
    placeholder: '请上传照片'
  }
]
const editFormData = [
  {
    value: 'description',
    initValue: '',
    type: 'input',
    label: '照片描述',
    placeholder: '请输入照片描述,不超过20字符',
    required: false,
    max: 10
  }
]
export default {
  name: 'AlbumManage',
  components: {
    SubmitForm,
    UploadWeb,
    NoData,
    Swiper,
    SwiperSlide
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    info(val) {
      this.showList()
    }
  },
  data() {
    return {
      addFormData,
      editFormData,
      formData: [],
      showTag: false,
      checkTag: false,
      publishVisible: false,
      previewVisible: false,
      checkedList: [],
      title: '',
      formTitle: '上传照片',
      pageList: {
        page: 1,
        size: 9999
      },
      photoList: [],
      photoLength: 50,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      chooseList: [],
      type: '1',
      addOrEditTag: 0,
      id: '',
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
  created() {},
  methods: {
    ...mapActions('home', ['getAlbumPhotoList', 'addPhotos', 'editPhotoById', 'delPhotoById', 'setCovers']),
    cancelVisible() {
      this.$emit('hasClose')
    },
    show(index) {
      this.swiperOption.initialSlide = index
      this.previewVisible = true
    },
    async showList() {
      const req = {
        query: this.info.id,
        ...this.pageList
      }
      const res = await this.getAlbumPhotoList(req)
      if (!res.data.list) {
        this.photoList = []
        return
      }
      this.photoList = res.data.list
      this.title =
        this.info.albumName + '(已上传' + res.data.list.length + '张，还可上传' + (50 - res.data.list.length) + '张)'
    },
    onChange(checkedValues) {
      this.chooseList = checkedValues
    },
    setAlbum() {
      this.checkTag = true
      this.checkedList = []
      this.photoList.forEach((item) => {
        if (item.isCover === '1') {
          this.checkedList.push(item.id)
        }
      })
      this.type = '1'
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
        if (this.chooseList.length > 5) {
          this.$message.warning('最多只能选择五张')
          return
        }
        console.log(this.chooseList)
        const req = {
          albumId: this.info.id,
          ids: this.chooseList
        }
        this.setCovers(req).then(() => {
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
        this.$tools.delTip('是否删除此照片?', () => {
          console.log(this.chooseList)
          this.delPhotoById(this.chooseList).then(() => {
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
      this.formData = this.$tools.fillForm(addFormData, {})
    },
    editPhoto(list) {
      this.showTag = true
      this.addOrEditTag = 1
      this.formTitle = '编辑照片信息'
      this.id = list.id
      this.formData = this.$tools.fillForm(editFormData, list)
    },
    delePhoto(list) {
      this.$tools.delTip('是否删除此照片?', () => {
        this.delPhotoById([list.id]).then(() => {
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
      if (this.addOrEditTag) {
        const req = {
          query: this.id,
          description: values.description
        }
        this.editPhotoById(req).then(() => {
          this.$refs.form.reset()
          this.$message.success('编辑成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      } else {
        if (this.$refs.uploadWeb.total !== this.$refs.uploadWeb.per) {
          this.$message.error('照片上传中，请稍候...')
          this.$refs.form.error()
          return
        }
        if (this.fileList.length === 0) {
          this.$message.error('照片不能为空')
          this.$refs.form.error()
          return
        }
        const urlList = []
        this.fileList.forEach((item) => {
          urlList.push(item.url)
        })
        const req = {
          query: this.info.id,
          data: urlList
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
}
</script>
<style lang="less" scoped>
.photo {
  height: 75vh;
  overflow: auto;
  margin-top: 25px;
}
.photo-list {
  margin-bottom: 1.2%;
  border-radius: 6px;
  overflow: hidden;
  width: 18.5%;
  min-width: 200px;
  background-color: #fff;
  height: 230px;
  float: left;
  margin-left: 1.2%;
  position: relative;
  & > img {
    width: 100%;
    height: 200px;
    display: block;
    margin-bottom: 10px;
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
    bottom: 31px;
    left: 2px;
  }
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
