<template>
  <div class="home qui-fx">
    <album-manage :info="albumInfo" ref="albumManage" @hasClose="hasClose"></album-manage>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="showTag"
      :form-data="formData"
    ></submit-form>
    <div class="left">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <class-tree v-else @select="select"></class-tree>
    </div>
    <div class="right qui-fx-ver">
      <div class="content page-layout">
        <a-tabs default-active-key="1" @change="tabChange" v-model="autoKey">
          <a-tab-pane key="1" tab="班级相册">
            <div class="album">
              <no-data msg="暂无轮播图" v-if="banners.length === 0"></no-data>
              <swiper v-else :options="swiperOption">
                <swiper-slide :key="banner" v-for="banner in banners" class="qui-fx-ac">
                  <img :src="banner" />
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
            <div class="album-list">
              <swiper :options="swiperOption2">
                <swiper-slide key="0" class="new-album">
                  <img :src="albumImg" />
                  <div @click.stop="addAlbum(0)" class="add qui-fx-ac-jc">
                    <a-icon type="camera" :style="{ fontSize: '24px' }" />
                    <p>新建相册</p>
                  </div>
                </swiper-slide>
                <swiper-slide :key="item.key" v-for="item in albumList" class="img-list">
                  <div class="mask qui-fx-je">
                    <a-tooltip placement="topLeft" title="编辑">
                      <a-button
                        size="small"
                        class="edit-action-btn"
                        icon="form"
                        @click.stop="addAlbum(1, item)"
                      ></a-button>
                    </a-tooltip>
                    <a-tooltip placement="topLeft" title="删除">
                      <a-button
                        size="small"
                        class="del-action-btn"
                        icon="delete"
                        @click="deleAlbum(item)"
                      ></a-button>
                    </a-tooltip>
                  </div>
                  <div @click.stop="albumManage(item)">
                    <img :src="item.coverUrl ? item.coverUrl : albumImg" />
                    <div v-if="!item.coverUrl" class="add qui-fx-ac-jc">
                      <a-icon type="plus" :style="{ fontSize: '24px' }" />
                      <p>上传照片</p>
                    </div>
                  </div>
                  <p @click.stop="albumManage(item)" class="qui-te">{{ item.albumName }}</p>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </a-tab-pane>
          <!-- <a-tab-pane key="2" tab="班级视频">
            Content of Tab Pane 2
          </a-tab-pane>-->
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import albumImg from '../../assets/img/album.png'
import SubmitForm from '@c/SubmitForm'
import ClassTree from '@c/ClassTree'
import MajorTree from '@c/MajorTree'
import AlbumManage from '../../component/AlbumManage'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
const formData = [
  {
    value: 'albumName',
    initValue: '',
    type: 'input',
    label: '相册名称',
    placeholder: '请输入相册名称,不超过10字符',
    max: 10
  }
]
export default {
  name: 'ClassAlbum',
  components: {
    ClassTree,
    SubmitForm,
    AlbumManage,
    Swiper,
    SwiperSlide,
    NoData,
    MajorTree
  },
  data() {
    return {
      albumImg,
      showTag: false,
      formData,
      pageList: {
        page: 1,
        size: 9999
      },
      classInfo: {
        schoolYear: '',
        schoolYearId: '',
        gradeCode: '',
        classCode: '',
        gradeName: '',
        className: '',
        teacherName: ''
      },
      defaultValue: '',
      inputText: '',
      title: '新建相册',
      albumInfo: {},
      autoKey: '1',
      banners: [],
      albumList: [],
      type: 0,
      addOrEditTag: 0,
      mottoId: '',
      swiperOption: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      },
      swiperOption2: {
        autoplay: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        slidesPerView: 7,
        spaceBetween: 20
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', [
      'getCoversList',
      'getClassMotto',
      'getAlbumList',
      'addNewAlbum',
      'editAlbumById',
      'delAlbumById',
      'addClassMotto',
      'editClassMotto'
    ]),
    // 选中年级
    select(item) {
      console.log(item)
      if (item.classCode) {
        this.classInfo = item
        this.getMotto()
        this.showCoverList()
        this.showList()
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
        this.addOrEditTag = 0
      } else {
        this.addOrEditTag = 1
        this.inputText = res.data.motto
        this.mottoId = res.data.id
      }
    },
    async showList() {
      const req = {
        ...this.pageList,
        ...this.classInfo,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getAlbumList(req)
      if (!res.data.list) {
        this.albumList = []
        return
      }
      this.albumList = res.data.list
    },
    async showCoverList() {
      this.banners = []
      const req = {
        ...this.classInfo,
        schoolCode: this.userInfo.schoolCode
      }
      console.log(this.banners)
      const res = await this.getCoversList(req)
      if (!res.data) {
        this.banners = []
        return
      }
      res.data.forEach(item => {
        this.banners.push(item.photoSrc)
      })
    },
    async edit() {
      console.log(this.inputText)
      const req = {
        ...this.classInfo,
        motto: this.inputText,
        schoolCode: this.userInfo.schoolCode
      }
      if (this.addOrEditTag) {
        req.id = this.mottoId
      }
      this.addClassMotto(req).then(() => {
        this.$message.success('编辑成功')
        this.$tools.goNext(() => {
          this.getMotto()
        })
      })
    },
    tabChange() {
      console.log(this.autoKey)
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
      console.log(values)
      if (this.type === 0) {
        this.addNewAlbum({
          ...values,
          ...this.classInfo,
          schoolCode: this.userInfo.schoolCode
        }).then(() => {
          this.$message.success('新建成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      } else {
        this.editAlbumById({
          ...values,
          id: this.id
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
    deleAlbum(item) {
      this.$tools.delTip('是否删除此相册?', () => {
        console.log(item)
        this.delAlbumById(item.id).then(() => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    albumManage(item) {
      console.log(item)
      this.albumInfo = item
      this.$refs.albumManage.publishVisible = true
    },
    hasClose() {
      this.showList()
      this.showCoverList()
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  flex: 1;
  overflow: hidden;
  .left {
    background: #fff;
    margin-right: 10px;
    width: 200px;
  }
  .right {
    flex: 1;
    width: calc(100% - 210px);
    .top {
      margin-bottom: 10px;
      .info {
        padding: 10px 30px 0 20px;
        width: 200px;
        height: 100px;
        overflow: hidden;
        background: #fff;
        box-shadow: 2px 2px 4px 2px #e8e8e8;
        margin-right: 10px;
        h1 {
          font-size: 22px;
          width: 100%;
          text-align: center;
        }
        h2 {
          font-size: 20px;
          width: 100%;
          text-align: center;
        }
      }
      .card {
        height: 100px;
        width: calc(100% - 210px);
        overflow: hidden;
        background: #fff;
        box-shadow: 2px 2px 4px 2px #e8e8e8;
        .input {
          margin: 10px 20px;
          background: #fff;
          width: 80%;
          h2 {
            width: 110px;
            font-size: 18px;
            margin-bottom: 0;
          }
        }
      }
    }
    .content {
      width: 100%;
      .album {
        width: 800px;
        height: 450px;
        margin: 40px auto 60px auto;
        img {
          max-width: 800px;
          height: 450px;
          margin: 0 auto;
        }
      }
      .album-list {
        height: 200px;
        margin: 0 60px;
        cursor: pointer;
        .img-list,
        .new-album {
          position: relative;
          width: 100%;
          height: 160px;
          img {
            width: 100%;
            height: 120px;
            border: 1px solid #f2f2f2;
            margin-bottom: 10px;
          }
          p {
            text-align: center;
          }
          .mask {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            padding: 6px 0px;
            background: rgba(220, 220, 220, 0.2);
            opacity: 0;
            z-index: 999;
            transition: 1s;
          }
          .del-action-btn,
          .edit-action-btn {
            margin-right: 5px;
            padding: 0 3px;
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
          }
        }
        .new-album {
          height: 120px;
        }
        .img-list {
          .add {
            bottom: 25%;
          }
        }
        .img-list:hover .mask {
          opacity: 1;
        }
      }
    }
  }
}
.swiper-button-prev,
.swiper-button-next {
  top: 70px;
}
.swiper-button-prev {
  left: -40px;
}
.swiper-button-next {
  right: -40px;
}
</style>
